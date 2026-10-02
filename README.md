# 🌹 Ponnummaa’s Birthday — A Cinematic Gift of Love

> A personal, romantic, page-by-page birthday gift website crafted exclusively for **Shamriya Sherin ("Ponnummaa")**. Built with pure HTML5, CSS3, and JavaScript — no frameworks, no build steps, no external backends. 100% ready for instant deployment to Vercel.

---

## ✨ Features & Experience Flow

1. **Invitation Scene**: Deep wine/night atmosphere with a single glowing, double-thump pulsing heart. Tapping her heart triggers a gentle light-bloom flash and starts romantic background music (respecting mobile browser autoplay policies).
2. **Title Scene**: "Happy Birthday" in a delicate script, "Ponnummaa" in large glowing typography, "Shamriya Sherin" letter-spaced underneath, and a handwritten romantic tagline.
3. **Time Together Counter**: A real-time live ticker calculating years, months, days, hours, minutes, and seconds since the exact date you got together, each housed in an elegant arched frame.
4. **Our Story (Memories Sequence)**: Polaroid cards with tape details, date stamps, handwritten titles, and captions. Fully supports both photos and short video clips with custom posters.
5. **Gallery Wall**: An elegant, responsive masonry-style grid. Tapping any photo opens a full-screen, swipeable lightbox modal with prev/next navigation and keyboard support.
6. **Reasons I Love You**: Interactive 3D flip cards with a heart on the front and your custom reason on the back. The first card starts face-up as a preview so the page never feels empty on load.
7. **The Love Letter**: Presented on warm deckle-edge paper with a subtle border. Types itself out paragraph-by-paragraph with a blinking gold cursor, plus a "Skip to End" button.
8. **Memory Lane Recap**: An auto-advancing highlight reel cross-fading through favourite photos with a progress bar and skip option.
9. **Make a Wish (Birthday Cake)**: Handcrafted SVG cake with 3 flickering candle flames. A "Blow Out The Candles" button (and optional microphone blow detection) extinguishes the flames, plays a celebratory melody, and showers the screen with confetti and rose petals.
10. **Finale**: "I Love You, Ponnummaa", warm closing thoughts, your signature, and a "Replay Our Story" button that resets everything cleanly.

---

## 📁 Project Structure

```text
d:/Birthday/Bday antigravity/
├── index.html                 # Semantic HTML5 skeleton & Open Graph tags
├── vercel.json                # Vercel deployment & caching headers
├── .gitignore                 # Standard Git ignore rules
├── README.md                  # Complete guide & documentation
├── .vscode/
│   └── extensions.json        # Recommends VS Code Live Server extension
├── css/
│   ├── style.css              # Design tokens (variables), layout, typography, glassmorphism
│   └── animations.css         # Keyframes (heartbeat, flicker, petals, confetti, reduced motion)
├── js/
│   ├── config.js              # ⭐ THE ONLY FILE YOU NEED TO EDIT!
│   ├── app.js                 # Scene manager, touch swipe, counter ticker, lightbox, cake logic
│   ├── audio.js               # Audio controller (MP3 playback + Web Audio music-box synth fallback)
│   └── particles.js           # Canvas engine: ambient rose petals & celebration confetti burst
└── assets/
    ├── images/                # Your photos & SVG placeholders (with README.txt)
    ├── videos/                # Your video clips (with README.txt)
    ├── audio/                 # Background music MP3 (with README.txt)
    └── icons/                 # Favicon & Open Graph social preview (with README.txt)
```

---

## 🚀 Quick Start: Running Locally

### Step 1: Open in VS Code
1. Open **Visual Studio Code**.
2. Go to **File** > **Open Folder...** and select this project folder (`Bday antigravity`).

### Step 2: Launch Live Server
1. If not already installed, install the **Live Server** extension (`ritwickdey.liveserver`) from the VS Code Extensions tab (`Ctrl + Shift + X`).
2. Right-click [`index.html`](file:///d:/Birthday/Bday%20antigravity/index.html) in the file explorer and click **"Open with Live Server"**.
3. Your default browser will launch at `http://127.0.0.1:5500`.

---

## 💌 How to Personalize (Editing `js/config.js`)

You **never need to touch HTML or CSS** unless you want to change colors. Every word, date, photo, song, and reason is configured in [`js/config.js`](file:///d:/Birthday/Bday%20antigravity/js/config.js).

### 1. Names and Milestone Date
```javascript
petName: "Ponnummaa",
fullName: "Shamriya Sherin",
senderName: "Yours Always & Forever",
relationshipStartDate: "2023-02-21T00:00:00", // Format: YYYY-MM-DD
relationshipDateLabel: "Since the magical day our two worlds became one — February 21, 2023",
```

### 2. Romantic Background Song
- Place your `.mp3` file into `assets/audio/` (e.g. `assets/audio/our-song.mp3`).
- In `js/config.js`:
  ```javascript
  musicUrl: "assets/audio/our-song.mp3",
  ```
- *Note:* If you leave `musicUrl: ""` empty, the website automatically plays a soothing Web Audio music-box lullaby!

### 3. Adding Your Photos to Memories
- Place your photos inside `assets/images/` (e.g. `assets/images/photo1.jpg`).
- In `js/config.js`, update the `memories` array:
  ```javascript
  {
    type: "image",
    media: "assets/images/photo1.jpg",
    alt: "Under the stars",
    date: "October 2022",
    title: "Where It All Began",
    caption: "Write 1–3 heartfelt sentences here about how you felt."
  }
  ```

### 4. Adding a Video Memory
- Place a short `.mp4` clip inside `assets/videos/` (e.g. `assets/videos/laughing.mp4`).
- In `js/config.js`:
  ```javascript
  {
    type: "video",
    videoSrc: "assets/videos/laughing.mp4",
    poster: "assets/images/laughing_thumbnail.jpg",
    date: "Candid Snapshot",
    title: "Your Infectious Laughter",
    caption: "Watching you laugh until your cheeks turn pink is my favorite sight."
  }
  ```

### 5. Customizing Flip Cards ("Reasons I Love You")
- In `js/config.js`, modify or add items to `reasons`:
  ```javascript
  {
    number: "01",
    title: "Your Radiant Kindness",
    text: "The selfless grace with which you treat everyone inspires me every day."
  }
  ```

### 6. Writing The Love Letter
- In `js/config.js`, update the `letter` object:
  ```javascript
  letter: {
    salutation: "My Dearest Ponnummaa,",
    paragraphs: [
      "Happy, happy birthday to the most precious girl in my life...",
      "Second paragraph here...",
      "Final heartfelt promise..."
    ],
    closing: "Forever and always yours,",
    signOff: "With all my heart & soul"
  }
  ```

---

## 📷 Media Preparation & Compression Guide

To ensure lightning-fast loading on her mobile phone (even on cellular data):

| Media Type | Recommended Format | Recommended Dimensions | Max File Size | Free Tool |
| :--- | :--- | :--- | :--- | :--- |
| **Photos** | `.jpg` or `.webp` | 1200px wide | 200KB – 400KB | [Squoosh.app](https://squoosh.app) / [TinyPNG](https://tinypng.com) |
| **Videos** | `.mp4` (H.264 / AAC) | 1080p or 720p | Under 8MB – 12MB | [HandBrake](https://handbrake.fr) / [FreeConvert](https://www.freeconvert.com) |
| **Audio** | `.mp3` (128–192 kbps) | N/A | Under 5MB | [AudioTrimmer](https://audiotrimmer.com) |

> [!TIP]
> **Built-in Fallback Protection**: If you make a typo in a file path or miss an image, the site will **never** display a broken-image icon. It automatically falls back to an elegant wine/rose gradient illustration and prints a helpful note in the browser console (`F12`).

---

## 🌐 Deploying to Vercel

### Method A: Deploy via GitHub (Recommended — 2 Minutes)
1. Initialize a Git repository and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Ponnummaa Birthday Website"
   ```
2. Create a **Private Repository** on [GitHub](https://github.com) (e.g., `birthday-ponnummaa`).
3. Push your repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/birthday-ponnummaa.git
   git branch -M main
   git push -u origin main
   ```
4. Go to [Vercel](https://vercel.com) and log in.
5. Click **"Add New..."** > **"Project"**.
6. Select your GitHub repository and click **Deploy**.
7. Vercel automatically detects the static project and gives you a live URL in seconds (e.g. `https://birthday-ponnummaa.vercel.app`)!

### Method B: Deploy via Vercel CLI
1. Open PowerShell or Terminal in the project root:
   ```bash
   npm i -g vercel
   ```
2. Run:
   ```bash
   vercel
   ```
3. Follow the prompts:
   - *Set up and deploy?* **Y**
   - *Which scope?* (Select your Vercel account)
   - *Link to existing project?* **N**
   - *Project name?* `ponnummaa-birthday`
   - *In which directory is your code located?* `./`
4. For production deployment, run:
   ```bash
   vercel --prod
   ```

### (Optional) Custom Domain
1. In Vercel, navigate to **Project Settings** > **Domains**.
2. Enter your custom domain (e.g. `ponnummaa.love` or `happybirthdayshamriya.com`).
3. Follow Vercel's DNS instructions (add an `A` record pointing to `76.76.21.21` or `CNAME` for subdomains).

---

## 📴 Offline & Self-Hosting Google Fonts (Optional)

The website uses Google Fonts (`Cormorant Garamond`, `Playfair Display`, `Great Vibes`, `Montserrat`). It caches them automatically once loaded. If you anticipate opening the gift without any internet connection at all:
1. Download font files from [Google Webfonts Helper](https://gwfh.mranftl.com/fonts).
2. Place `.woff2` files into `assets/fonts/`.
3. Update `css/style.css` with `@font-face` rules pointing to your local files.

---

## 🛠️ Troubleshooting Guide

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **No sound plays on invitation tap** | Mobile browser autoplay policy or volume down | Ensure your phone's physical mute switch is off and volume is up. Tap the glowing heart button directly (which triggers the user gesture required by iOS Safari/Android Chrome). |
| **My custom song doesn't play** | Wrong file path in `config.js` or invalid format | Check `CONFIG.musicUrl`. Use forward slashes (`/`), e.g., `"assets/audio/song.mp3"`. Check browser console (`F12`) for any 404 message. If unavailable, the site automatically uses the soothing music-box synthesizer. |
| **Image is showing placeholder art** | File name mismatch or wrong path | Ensure file name matches exactly including extension (e.g. `.jpg` vs `.png` or capital `.JPG`). Check browser console (`F12`) for `[Image Fallback]` logs. |
| **Video doesn't play on iPhone** | Unsupported video codec | Use standard H.264 video with AAC audio. Ensure `<video>` has `playsinline` (already included in `app.js`). |
| **Text overflows on small screens** | Caption or letter paragraph is excessively long | Shorten captions to 1–3 concise sentences as recommended in `config.js` comments. |
| **Live counter shows 0 or NaN** | Incorrect date format in `config.js` | Ensure `CONFIG.relationshipStartDate` is formatted as `"YYYY-MM-DDTHH:MM:SS"` (e.g. `"2022-06-18T00:00:00"`). |

---

## 🎁 With Love

Crafted with dedication for **Ponnummaa (Shamriya Sherin)**. May this birthday be filled with endless smiles, warmth, and the start of another wonderful year together.
"# Shamriyaday" 
