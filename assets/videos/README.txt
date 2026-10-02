═══════════════════════════════════════════════════════════
VIDEOS DIRECTORY (assets/videos/)
═══════════════════════════════════════════════════════════

This folder holds short romantic video clips (like reel snippets, candid
moments, laugh clips) for the "Our Story" memory scene.

HOW TO USE YOUR OWN VIDEOS:
1. Save your short video clip here (e.g. clip1.mp4).
2. Supported format: .mp4 (H.264 video codec + AAC audio) or .webm.
3. (Optional but recommended) Save a matching poster image in
   `assets/images/` to show before the video plays.
4. Update `js/config.js` in the `memories` array:
   {
     type: "video",
     videoSrc: "assets/videos/clip1.mp4",
     poster: "assets/images/clip1_poster.jpg",
     ...
   }

TIPS FOR MOBILE PLAYBACK:
- Length: 5–20 seconds is ideal for web scenes.
- Size: Compress under 5MB–10MB so mobile data doesn't lag.
- Free compression tool: https://handbrake.fr or https://www.freeconvert.com/video-compressor
