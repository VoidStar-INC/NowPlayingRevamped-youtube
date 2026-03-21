# NowPlayingRevamped-youtube

A lightweight Now Playing overlay for OBS Studio, built on Windows Media Control via the TUNA plugin. Displays album art, track title, artist name, and a live progress bar as a browser source in your stream.

---

## Verified Working Platforms

- YouTube (browser)
- YouTube Music (browser)
- Spotify (browser — see Spotify notes below)

> Universal browser-based media support is the goal. Other platforms may work via Windows Media Control but have not been fully tested yet.

---

## Lineage

This project is part of a chain of open source contributions:

- **[Zephens](https://obsproject.com/forum/resources/tuna.843/)** — created the original TUNA plugin for OBS
- **[adarhn/NowPlaying](https://github.com/adarhn/NowPlaying)** — built the first browser-based Now Playing overlay concept
- **[xMannyGamingx/NowPlayingRevamped](https://github.com/xMannyGamingx/NowPlayingRevamped)** — revamped it with Spotify support and improved reliability
- **[VoidStar-INC/NowPlayingRevamped-youtube](https://github.com/VoidStar-INC/NowPlayingRevamped-youtube)** *(this repo)* — rebuilt for Windows Media Control, removing platform-specific dependencies and expanding toward universal media support

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

In OBS, open TUNA settings and configure the following:

- Set **Song source** to **Windows Media Control**
- Format `{title}` → save to a folder of your choice as `Tuna-nowplaying.txt`
- Format `{first_artist}` → save to the same folder as `tuna-artist.txt`
- Cover art → save to the same folder as `cover.png`
- Enable the TUNA webserver on port `1608`

### Step 2 — Place the Files

Download or clone this repo and place all the files into the **same folder** you configured TUNA to save its output files in. Your folder should contain:

- `index.html`
- `index.js`
- `style.css`
- `settings.json`
- `Tuna-nowplaying.txt`
- `tuna-artist.txt`
- `cover.png`

Keeping everything in one folder means no file path editing is required.

### Step 3 — Simple Web Server

1. Open Simple Web Server and create a new server
2. Point it to the folder from Step 1 and Step 2
3. Note the URL it gives you (e.g. `http://localhost:8080`)
4. Turn the server on

### Step 4 — OBS Browser Source

1. In OBS, add a new **Browser Source**
2. Set the URL to: `http://localhost:8080/index.html`
   *(adjust the port to match what Simple Web Server gave you)*
3. Width: `500`, Height: `150`
4. Check **"Refresh browser when scene becomes active"**
5. Position it wherever you like on your scene

---

## Spotify Notes

The Spotify desktop app does not register reliably with Windows Media Control. To use Spotify with this overlay:

1. Open **[open.spotify.com](https://open.spotify.com)** in your preferred browser
2. Start playing a song
3. Click the **device/speaker icon** in the bottom right of the Spotify player
4. Select your **browser** as the active playback device
5. The overlay will pick it up automatically via Windows Media Control

> If the Spotify desktop app is open it may intercept playback. Either close it or make sure the browser is selected as the active device in Spotify's device picker.

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

- Smoother Spotify integration without manual device switching
- Broader platform support (SoundCloud, iHeart Radio, etc.)
- Customizable widget position
- Multiple visual themes
- Rename repo once truly universal support is working

---

## License

MIT — free to use, modify, and build on. Credit appreciated but not required.
