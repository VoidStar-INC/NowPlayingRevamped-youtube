# NowPlayingRevamped-youtube

A lightweight Now Playing overlay for OBS Studio, built on Windows Media Control via the TUNA plugin. Displays album art, track title, artist name, and a live progress bar as a browser source in your stream.

> Currently verified working with **YouTube Music** and **YouTube** in browser.
> Spotify and broader universal support is planned for a future release.

---

## Lineage

This project is part of a chain of open source contributions:

- **[Zephens](https://obsproject.com/forum/resources/tuna.843/)** — created the original TUNA plugin for OBS
- **[adarhn/NowPlaying](https://github.com/adarhn/NowPlaying)** — built the first browser-based Now Playing overlay concept
- **[xMannyGamingx/NowPlayingRevamped](https://github.com/xMannyGamingx/NowPlayingRevamped)** — revamped it with Spotify support and improved reliability
- **[VoidStar-INC/NowPlayingRevamped-youtube](https://github.com/VoidStar-INC/NowPlayingRevamped-youtube)** *(this repo)* — rebuilt for Windows Media Control, removing the Spotify-only dependency and expanding toward universal media support

---

## Features

- Album art with smooth fade on track change
- Artist name and track title with animated text transition
- Live progress bar pulled from TUNA's local webserver
- Auto-hides when nothing is playing
- Slide in / slide out animation
- Customizable accent color and size via CSS variables
- Filter out unwanted audio sources via ignore lists

---

## Requirements

- [OBS Studio](https://obsproject.com/)
- [TUNA plugin for OBS](https://obsproject.com/forum/resources/tuna.843/)
- [Simple Web Server](https://simplewebserver.org/) (free)
- Windows (uses Windows Media Control as the audio source)

---

## Setup

### Step 1 — TUNA Configuration

In OBS, open the TUNA settings and configure the following outputs:

- Format `{title}` → save to a folder of your choice as `Tuna-nowplaying.txt`
- Format `{first_artist}` → save to the same folder as `tuna-artist.txt`
- Cover art → save to the same folder as `cover.png`
- Enable the TUNA webserver on port `1608`

### Step 2 — Place the Files

Download or clone this repo and place the folder anywhere on your PC.
All files (`index.html`, `index.js`, `style.css`, `settings.json`) should stay together in the same folder.

Update the file paths in `index.js` at the top of the settings block to point to wherever your TUNA output files are:
```js
titleFile:  "Tuna-nowplaying.txt",
artistFile: "tuna-artist.txt",
coverFile:  "cover.png",
```

### Step 3 — Simple Web Server

1. Open Simple Web Server and create a new server
2. Point it to the folder containing your TUNA output files
3. Note the URL it gives you (e.g. `http://localhost:3000`)
4. Turn the server on

### Step 4 — OBS Browser Source

1. In OBS, add a new **Browser Source**
2. Set the URL to: `http://localhost:3000/NowPlayingRevamped-youtube/index.html`
   *(adjust the path to match your folder structure)*
3. Width: `500`, Height: `150`
4. Check **"Refresh browser when scene becomes active"**
5. Position it wherever you like on your scene

---

## Customization

### Accent color
Open `style.css` and change the `--accent` variable:
```css
--accent: #00e5ff;  /* cyan — default */
--accent: #ff6b6b;  /* red */
--accent: #a8ff78;  /* green */
--accent: #ffd700;  /* gold */
```

### Widget size
Change `--art-size` in `style.css` to resize the album art (and the whole widget scales with it).

### Filtering unwanted sources
If Windows Media Control picks up game audio or other apps you don't want displayed, open `index.js` and add them to the ignore lists:
```js
ignoredArtists: ["Rocket League", "Windows"],
ignoredTitles:  ["Unknown", ""],
```

---

## Planned

- Spotify integration
- Broader platform support (SoundCloud, iHeart Radio, etc.)
- Customizable widget position
- Multiple visual themes

---

## License

MIT — free to use, modify, and build on. Credit appreciated but not required.
