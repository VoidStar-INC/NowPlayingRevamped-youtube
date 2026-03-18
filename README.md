# Now Playing Overlay — Setup Guide

Built for OBS Studio with TUNA plugin + Windows Media Control.
Adapted from xMannyGamingx/NowPlayingRevamped, rebuilt for universal media support.

---

## Files in this folder

| File | Purpose |
|------|---------|
| index.html | The overlay layout |
| index.js | Logic that reads TUNA output and updates the display |
| style.css | Visual styling |
| settings.json | Config options |

---

## Step 1 — TUNA Setup (already done)

Make sure TUNA has two outputs configured:
- Format `{title}` → saved to your Stream data folder as `Tuna-nowplaying.txt`
- Format `{first_artist}` → saved to your Stream data folder as `tuna-artist.txt`
- Cover art path set to your Stream data folder as `cover.png`
- Webserver enabled on port 1608

---

## Step 2 — Move these files

Copy this entire NowPlaying folder into:
`E:\backup\Projects\Stream data\`

So the final paths look like:
- `E:\backup\Projects\Stream data\NowPlaying\index.html`
- `E:\backup\Projects\Stream data\NowPlaying\index.js`
- etc.

---

## Step 3 — Simple Web Server Setup

1. Open Simple Web Server
2. Click "New Server"
3. Set the folder path to: `E:\backup\Projects\Stream data\`
4. Enable "Accessible on local network"
5. Note the URL it gives you (e.g. `http://localhost:3000`)
6. Turn the server ON

---

## Step 4 — OBS Browser Source

1. In OBS add a new Browser source
2. Set URL to: `http://localhost:3000/NowPlaying/index.html`
   (replace 3000 with whatever port Simple Web Server gave you)
3. Width: 500, Height: 150
4. Check "Refresh browser when scene becomes active"
5. Position it in the bottom left of your scene

---

## Customization

### Filtering out unwanted sources
If Windows Media Control picks up game audio or system sounds you don't want displayed,
open `index.js` and add them to the ignore lists near the top:

```js
ignoredArtists: ["Rocket League", "Windows"],
ignoredTitles:  ["Unknown", ""],
```

### Colors
Open `style.css` and change the `--accent` variable at the top:
- Current: `#00e5ff` (cyan)
- Try: `#ff6b6b` (red), `#a8ff78` (green), `#ffd700` (gold)

### Size
Change `--art-size` in style.css to make the album art bigger or smaller.
