═══════════════════════════════════════════════════════════
AUDIO & MUSIC DIRECTORY (assets/audio/)
═══════════════════════════════════════════════════════════

This folder holds background romantic music for the birthday gift.

HOW TO USE YOUR OWN SONG:
1. Drop your favorite romantic song into this folder (e.g. `bgm.mp3`).
2. Supported format: .mp3 or .m4a.
3. Open `js/config.js` and set:
   `musicUrl: "assets/audio/bgm.mp3"`

FALLBACK WEBAUDIO SYNTHESIZER:
- If `musicUrl` is left empty `""` or if the file cannot be loaded,
  the website uses a built-in Web Audio API music-box synthesizer
  to play a gentle, romantic lullaby in the background without needing
  any external audio file!
- It also has a built-in celebratory chime for blowing out the birthday
  candles.
- Audio starts gently only after Ponnummaa taps the pulsing heart on
  the Invitation scene, fully respecting modern mobile browser autoplay
  policies.
