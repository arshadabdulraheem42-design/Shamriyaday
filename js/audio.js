/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    AUDIO.JS — MUSIC & WEBAUDIO SYNTHESIZER
 * ═══════════════════════════════════════════════════════════════════════════
 * Handles romantic music playback:
 * - Plays MP3 file if provided in CONFIG.musicUrl
 * - Fallbacks to a lush, soothing music-box lullaby synthesized via Web Audio API
 * - Celebratory chime melody on blowing out birthday candles
 * - Respects mobile browser autoplay policies (starts on user tap)
 * - Accessible mute/unmute toggle
 */

const AudioManager = (() => {
  let audioContext = null;
  let masterGain = null;
  let bgmAudio = null;
  let isMuted = false;
  let isPlaying = false;
  let isUsingSynthFallback = false;
  let synthIntervalId = null;
  let synthNoteIndex = 0;

  // Romantic music box pentatonic lullaby sequence (note frequencies in Hz)
  // C4, E4, G4, A4, C5, D5, E5, G5, A5
  const lullabyNotes = [
    261.63, 329.63, 392.00, 523.25,
    392.00, 329.63, 440.00, 392.00,
    329.63, 261.63, 293.66, 392.00,
    329.63, 293.66, 261.63, 392.00,
    523.25, 587.33, 659.25, 523.25,
    440.00, 392.00, 329.63, 293.66
  ];

  function getAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        masterGain = audioContext.createGain();
        masterGain.gain.setValueAtTime(0.5, audioContext.currentTime);
        masterGain.connect(audioContext.destination);
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  }

  // Play a single bell/music-box chime via Web Audio
  function playChimeNote(freq, timeOffset = 0, duration = 1.4, volume = 0.28) {
    const ctx = getAudioContext();
    if (!ctx || !masterGain || isMuted) return;

    const startTime = ctx.currentTime + timeOffset;

    // Primary fundamental tone (sine)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Subtle bell overtone (triangle)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.76, startTime); // metallic overtone

    // Envelopes: instantaneous attack, smooth exponential bell ring decay
    gain1.gain.setValueAtTime(volume, startTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    gain2.gain.setValueAtTime(volume * 0.25, startTime);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.6);

    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc2.connect(gain2);
    gain2.connect(masterGain);

    osc1.start(startTime);
    osc1.stop(startTime + duration);
    osc2.start(startTime);
    osc2.stop(startTime + duration * 0.6);
  }

  // Starts the Web Audio music box sequence
  function startSynthLullaby() {
    if (synthIntervalId) return;
    isUsingSynthFallback = true;
    synthNoteIndex = 0;

    const playNext = () => {
      if (isMuted) return;
      const note = lullabyNotes[synthNoteIndex % lullabyNotes.length];
      playChimeNote(note, 0, 1.6, 0.22);
      // Play soft harmonic accompaniment every 4 notes
      if (synthNoteIndex % 4 === 0) {
        playChimeNote(note * 0.5, 0.05, 2.0, 0.14); // bass note
      }
      synthNoteIndex++;
    };

    playNext();
    synthIntervalId = setInterval(playNext, 620); // ~96 BPM calm tempo
  }

  function stopSynthLullaby() {
    if (synthIntervalId) {
      clearInterval(synthIntervalId);
      synthIntervalId = null;
    }
  }

  // Celebratory birthday chime for the candle blowout moment
  function playCelebrationChime() {
    const ctx = getAudioContext();
    if (!ctx || isMuted) return;

    // Celebratory melody: C4, C4, D4, C4, F4, E4, C4, C4, D4, C4, G4, F4
    const melody = [
      { f: 261.63, d: 0.35, t: 0.0 }, // Hap-
      { f: 261.63, d: 0.35, t: 0.28 }, // py
      { f: 293.66, d: 0.55, t: 0.56 }, // Birth-
      { f: 261.63, d: 0.55, t: 0.95 }, // day
      { f: 349.23, d: 0.60, t: 1.35 }, // to
      { f: 329.63, d: 0.90, t: 1.75 }, // you
      { f: 523.25, d: 1.20, t: 2.30 }, // sparkling high flourish!
      { f: 659.25, d: 1.40, t: 2.50 },
      { f: 783.99, d: 1.60, t: 2.70 }
    ];

    melody.forEach(item => {
      playChimeNote(item.f, item.t, item.d, 0.35);
    });
  }

  // Initialize and start background audio upon first user gesture
  function startAudioOnUserGesture() {
    if (isPlaying) return;
    getAudioContext();

    const musicUrl = typeof CONFIG !== 'undefined' && CONFIG.musicUrl ? CONFIG.musicUrl.trim() : "";
    const volume = (typeof CONFIG !== 'undefined' && CONFIG.musicVolume) || 0.6;

    if (musicUrl) {
      bgmAudio = new Audio(musicUrl);
      bgmAudio.loop = true;
      bgmAudio.volume = volume;

      const playPromise = bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true;
          updateAudioButtonUI();
        }).catch(err => {
          console.warn("[AudioManager] Could not play specified MP3 (" + musicUrl + "). Falling back to Web Audio music-box synth.", err);
          startSynthLullaby();
          isPlaying = true;
          updateAudioButtonUI();
        });
      }
    } else {
      // No MP3 provided — smoothly start generated music box
      startSynthLullaby();
      isPlaying = true;
      updateAudioButtonUI();
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (masterGain && audioContext) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.5, audioContext.currentTime);
    }
    if (bgmAudio) {
      bgmAudio.muted = isMuted;
    }
    updateAudioButtonUI();
    return isMuted;
  }

  function updateAudioButtonUI() {
    const btn = document.getElementById('audioToggle');
    if (!btn) return;

    if (isMuted || !isPlaying) {
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Unmute romantic music');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
      `;
    } else {
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Mute romantic music');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" class="speaker-wave" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      `;
    }
  }

  // Smoothly cross-fade and change background song
  function switchSong(newUrl, fadeDuration = 1200) {
    if (!newUrl) return;
    getAudioContext();
    const targetVolume = (typeof CONFIG !== 'undefined' && CONFIG.musicVolume) || 0.6;

    stopSynthLullaby();

    if (bgmAudio) {
      const startVolume = bgmAudio.volume;
      const fadeStartTime = performance.now();

      const fadeOut = (now) => {
        const elapsed = now - fadeStartTime;
        const progress = Math.min(elapsed / fadeDuration, 1);
        bgmAudio.volume = Math.max(0, startVolume * (1 - progress));

        if (progress < 1) {
          requestAnimationFrame(fadeOut);
        } else {
          bgmAudio.pause();
          bgmAudio.src = newUrl;
          bgmAudio.load();
          bgmAudio.currentTime = 0;
          bgmAudio.loop = true;
          bgmAudio.muted = isMuted;

          const playPromise = bgmAudio.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              isPlaying = true;
              updateAudioButtonUI();

              const fadeInStartTime = performance.now();
              const fadeIn = (t) => {
                const p = Math.min((t - fadeInStartTime) / fadeDuration, 1);
                bgmAudio.volume = targetVolume * p;
                if (p < 1) {
                  requestAnimationFrame(fadeIn);
                } else {
                  bgmAudio.volume = targetVolume;
                }
              };
              requestAnimationFrame(fadeIn);
            }).catch(err => {
              console.warn("[AudioManager] Error playing new track (" + newUrl + "):", err);
            });
          }
        }
      };

      requestAnimationFrame(fadeOut);
    } else {
      bgmAudio = new Audio(newUrl);
      bgmAudio.loop = true;
      bgmAudio.volume = targetVolume;
      bgmAudio.muted = isMuted;

      const playPromise = bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true;
          updateAudioButtonUI();
        }).catch(err => {
          console.warn("[AudioManager] Error playing new track:", err);
        });
      }
    }
  }

  function init() {
    const btn = document.getElementById('audioToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        // If user taps audio button before invitation, start audio immediately
        if (!isPlaying) {
          startAudioOnUserGesture();
        } else {
          toggleMute();
        }
      });
    }
  }

  return {
    init,
    startAudioOnUserGesture,
    playCelebrationChime,
    toggleMute,
    switchSong
  };
})();
