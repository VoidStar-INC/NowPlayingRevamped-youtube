"use strict";

// ─── Settings ──────────────────────────────────────────────────────────────
const SETTINGS = {
    pollInterval:      1000,       // How often to check for song changes (ms)
    artRefreshDelay:   200,        // Delay before refreshing album art (ms)
    transitionDelay:   300,        // Delay for text swap animation (ms)
    hideWhenEmpty:     true,       // Auto-hide widget when nothing is playing
    placeholder:       "the vibes will return shortly :)", // Shown when nothing plays

    // File paths — must match what Simple Web Server is serving
    titleFile:         "Tuna-nowplaying.txt",
    artistFile:        "tuna-artist.txt",
    coverFile:         "cover.png",

    // Source filtering — add keywords to IGNORE certain sources
    // e.g. if Windows Media sees your game audio reporting a track name, ignore it
    ignoredArtists:    [],   // e.g. ["Rocket League", "Windows"]
    ignoredTitles:     [],   // e.g. ["Unknown", ""]
};

// ─── State ─────────────────────────────────────────────────────────────────
let currentTitle  = "";
let currentArtist = "";
let isVisible     = false;
let coverVersion  = 0; // cache-buster for album art

// ─── DOM refs ──────────────────────────────────────────────────────────────
const widget    = document.getElementById("nowplaying-widget");
const albumArt  = document.getElementById("album-art");
const artistEl  = document.getElementById("artist-name");
const titleEl   = document.getElementById("track-title");
const progressBar = document.getElementById("progress-bar");

// ─── Helpers ───────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchText(url) {
    try {
        const res = await fetch(url + "?t=" + Date.now()); // prevent caching
        if (!res.ok) return null;
        const text = (await res.text()).trim();
        return text || null;
    } catch {
        return null;
    }
}

function isIgnored(title, artist) {
    if (!title && !artist) return true;
    if (title === SETTINGS.placeholder) return true;
    for (const ignored of SETTINGS.ignoredArtists) {
        if (artist && artist.toLowerCase().includes(ignored.toLowerCase())) return true;
    }
    for (const ignored of SETTINGS.ignoredTitles) {
        if (title && title.toLowerCase().includes(ignored.toLowerCase())) return true;
    }
    return false;
}

// ─── Widget Visibility ─────────────────────────────────────────────────────
function showWidget() {
    if (isVisible) return;
    isVisible = true;
    widget.classList.remove("hidden", "slide-out");
    widget.classList.add("slide-in");
}

function hideWidget() {
    if (!isVisible) return;
    isVisible = false;
    widget.classList.remove("slide-in");
    widget.classList.add("slide-out");
    setTimeout(() => {
        if (!isVisible) widget.classList.add("hidden");
    }, 500);
}

// ─── Album Art ─────────────────────────────────────────────────────────────
function refreshAlbumArt() {
    coverVersion++;
    albumArt.classList.add("loading");
    const newSrc = SETTINGS.coverFile + "?v=" + coverVersion + "&t=" + Date.now();
    const testImg = new Image();
    testImg.onload = () => {
        albumArt.src = newSrc;
        albumArt.classList.remove("loading");
    };
    testImg.onerror = () => {
        // Keep existing art if new one fails to load
        albumArt.classList.remove("loading");
    };
    testImg.src = newSrc;
}

// ─── Progress Bar ──────────────────────────────────────────────────────────
// TUNA's webserver (port 1608) exposes JSON with duration/progress data
// We poll it separately for the progress bar
let progressPollActive = false;

async function pollProgress() {
    if (progressPollActive) return;
    progressPollActive = true;
    while (true) {
        try {
            const res = await fetch("http://localhost:1608?t=" + Date.now());
            if (res.ok) {
                const data = await res.json();
                const progress = data.progress_ms  || 0;
                const duration = data.duration_ms  || 0;
                if (duration > 0) {
                    const pct = Math.min(100, (progress / duration) * 100);
                    progressBar.style.width = pct + "%";
                } else {
                    progressBar.style.width = "0%";
                }
            }
        } catch {
            progressBar.style.width = "0%";
        }
        await sleep(1000);
    }
}

// ─── Text Transition ───────────────────────────────────────────────────────
async function updateText(newTitle, newArtist) {
    // Fade out current text
    artistEl.classList.add("updating");
    titleEl.classList.add("updating");
    await sleep(SETTINGS.transitionDelay);

    // Swap content
    artistEl.textContent = newArtist || "Unknown Artist";
    titleEl.textContent  = newTitle  || "Unknown Track";

    // Fade back in
    artistEl.classList.remove("updating");
    titleEl.classList.remove("updating");
}

// ─── Main Poll Loop ────────────────────────────────────────────────────────
async function poll() {
    const title  = await fetchText(SETTINGS.titleFile);
    const artist = await fetchText(SETTINGS.artistFile);

    const nothingPlaying =
        !title ||
        title === SETTINGS.placeholder ||
        isIgnored(title, artist);

    if (nothingPlaying) {
        if (SETTINGS.hideWhenEmpty) hideWidget();
        currentTitle  = "";
        currentArtist = "";
        await sleep(SETTINGS.pollInterval);
        poll();
        return;
    }

    const songChanged   = title  !== currentTitle;
    const artistChanged = artist !== currentArtist;

    if (!isVisible) {
        // First appearance — set content silently then show
        artistEl.textContent = artist || "Unknown Artist";
        titleEl.textContent  = title  || "Unknown Track";
        refreshAlbumArt();
        showWidget();
    } else if (songChanged || artistChanged) {
        // Song changed — animate text swap and refresh art
        await updateText(title, artist);
        if (songChanged) {
            await sleep(SETTINGS.artRefreshDelay);
            refreshAlbumArt();
        }
    }

    currentTitle  = title;
    currentArtist = artist;

    await sleep(SETTINGS.pollInterval);
    poll();
}

// ─── Boot ──────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Start hidden
    widget.classList.add("hidden");

    // Kick off polling
    poll();

    // Kick off progress bar (uses TUNA's local webserver)
    pollProgress();
});
