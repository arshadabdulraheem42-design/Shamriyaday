/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    CONFIG.JS — YOUR SPECIAL BIRTHDAY CONFIG
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 💌 THIS IS THE ONLY FILE YOU NEED TO EDIT!
 * 
 * Every field below has a clear "// REPLACE: ..." comment explaining what it
 * does, expected formats, and recommended character limits so everything fits
 * gorgeously on both mobile phones and desktop screens.
 * 
 * Simply edit the text between the quotes, save this file (Ctrl + S), and
 * refresh your browser to see your updates live!
 */

const CONFIG = {
  // ─────────────────────────────────────────────────────────────────────────
  // 1. RECIPIENT & SENDER DETAILS
  // ─────────────────────────────────────────────────────────────────────────

  // REPLACE: Your girlfriend's pet name or endearing name (used in titles & finale)
  // Recommended length: 1–3 words (e.g., "Ponnummaa", "My Love", "Sweetheart")
  petName: "Ponnummaa",

  // REPLACE: Her full official or formal name (shown elegantly letter-spaced)
  // Recommended length: Full name (e.g., "Shamriya Sherin")
  fullName: "Shamriya Sherin",

  // REPLACE: Your name or nickname for the letter sign-off and finale
  // Recommended length: 1–2 words (e.g., "Yours always, Farhan" or "With all my love, [Your Name]")
  senderName: "Yours Always & Forever",

  // Her Birthday Details: October 3, 2008 — 18th Milestone
  birthDate: "2008-10-03",
  birthDateFormatted: "October 3, 2008",
  turningAge: 18,

  // REPLACE: The date your relationship began or your special anniversary date.
  // Format: "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM:SS" (e.g., "2022-04-14" or "2023-11-20T18:30:00")
  relationshipStartDate: "2023-02-21T00:00:00",

  // REPLACE: A romantic subtitle describing this special milestone date
  // Recommended length: Under 60 characters
  relationshipDateLabel: "Since the magical day our two worlds became one — February 21, 2023",

  // ─────────────────────────────────────────────────────────────────────────
  // 2. BACKGROUND MUSIC & SOUND
  // ─────────────────────────────────────────────────────────────────────────

  // Primary romantic background song played during the story (Scene 1-8)
  musicUrl: "assets/audio/bgm.mp3",

  // Celebration song switched to right after blowing out the birthday candles!
  celebrationMusicUrl: "assets/audio/girl_in_red_october.mp3",

  // REPLACE: Default music volume between 0.1 (very soft) and 1.0 (loud). Default: 0.6
  musicVolume: 0.6,

  // ─────────────────────────────────────────────────────────────────────────
  // 3. INVITATION SCENE (Scene 1)
  // ─────────────────────────────────────────────────────────────────────────
  invitation: {
    // REPLACE: The tiny whispered teaser text above the pulsing heart
    // Recommended length: Under 40 characters
    teaser: "A quiet moment, just for you...",

    // REPLACE: The call-to-action text below the pulsing heart
    // Recommended length: Under 35 characters
    promptText: "Touch my heart to begin",

    // REPLACE: Small note regarding sound/headphones
    audioHint: "Best experienced with sound on 🎧"
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. TITLE SCENE (Scene 2)
  // ─────────────────────────────────────────────────────────────────────────
  titleScene: {
    // REPLACE: Top greeting header
    greeting: "Happy 18th Birthday",

    // REPLACE: Handwritten-style romantic line under her name
    // Recommended length: 40–90 characters
    tagline: "Welcome to Chapter 18, to the girl who turned every ordinary day into pure poetry."
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. TIME TOGETHER COUNTER (Scene 3)
  // ─────────────────────────────────────────────────────────────────────────
  counterScene: {
    // REPLACE: Header for the live timer
    title: "Every Second by Your Side",

    // REPLACE: Subtitle text explaining the counter
    subtitle: "Counting every heartbeat, laugh, and quiet miracle we've shared:"
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5.5 HER CHILDHOOD MEMORIES (Scene 4)
  // ─────────────────────────────────────────────────────────────────────────
  // Three visible photos of her childhood displayed together in an elegant
  // triptych frame. All 3 photos are visible simultaneously!
  childhoodScene: {
    badge: "✦ Before Our Paths Crossed • 2008 & Beyond ✦",
    title: "Little Ponnummaa",
    subtitle: "Three precious snapshots from her sweetest beginnings — the innocent little girl who grew up to be my entire world:",
    photos: [
      {
        // Baby photo
        image: "assets/images/Screenshot 2026-10-02 122227.png",
        objectPosition: "center 25%",
        title: "Pure Innocence",
        tag: "Baby Days",
        caption: "Those sweet sparkling eyes and cute little smile. The world had no idea what an absolute angel had just arrived."
      },
      {
        // Little girl photo
        image: "assets/images/Screenshot 2026-10-02 122442.png",
        objectPosition: "center 20%",
        title: "Little Princess",
        tag: "Early Childhood",
        caption: "In her sparkly party dress and headband, already carrying all the poise, sweetness, and magic she shares with me today."
      },
      {
        // Growing up portrait photo
        image: "assets/images/WhatsApp Image 2026-10-02 at 12.21.23 PM_cropped.jpg",
        objectPosition: "center center",
        title: "Blossoming Radiance",
        tag: "Growing Years",
        caption: "Growing up with so much warmth, kindness, and grace in her heart — blossoming into my favorite person in the entire universe."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. OUR STORY (MEMORIES SEQUENCE) (Scene 4)
  // ─────────────────────────────────────────────────────────────────────────
  // Add as many memories as you like! Each memory displays as a tilted polaroid
  // photo or video card.
  //
  // Photo Memory Template:
  // {
  //   type: "image",
  //   media: "assets/images/photo-filename.jpg",
  //   alt: "Short description of photo",
  //   date: "October 2022",
  //   title: "Under The Lanterns",
  //   caption: "First person memory: 1-3 sentences about how you felt."
  // }
  //
  // Video Memory Template:
  // {
  //   type: "video",
  //   videoSrc: "assets/videos/clip-filename.mp4",
  //   poster: "assets/images/video-poster.jpg",
  //   date: "December 2023",
  //   title: "Your Uncontrollable Laugh",
  //   caption: "1-3 sentences. Short videos (5-15s) work best on mobile."
  // }
  memories: [
    {
      type: "video",
      videoSrc: "assets/videos/VID_762790929_010440_335.mp4", // Video or GIF format for Where It All Began
      poster: "assets/images/IMG_20230929_184056_377.jpg",
      objectPosition: "center 18%",
      alt: "The first day we met, your shy radiant smile",
      date: "September 29, 2023",
      title: "The Day My World Changed",
      caption: "I still remember the sudden flutter in my chest the very first time I saw you smiling like this. Under the quiet sunlight, with that gentle, shy glow in your eyes — that was the exact moment my heart decided you were going to be my whole world, Ponnummaa."
    },
    {
      type: "image",
      media: "assets/images/Screenshot 2026-10-02 195618.png",
      objectPosition: "center 12%",
      alt: "Cheek-to-cheek with radiant smiles",
      date: "Sweet Beginnings",
      title: "Smiles That Feel Like Home",
      caption: "There is no place in the world I feel lighter than right next to you. One look at your radiant smile and every worry melts away — you are my happiest melody, Ponnummaa."
    },
    {
      type: "image",
      media: "assets/images/WhatsApp Image 2026-10-02 at 12.16.16 PM (1)_aligned.jpg",
      objectPosition: "22% center",
      alt: "Playful cute pout leaning on shoulder",
      date: "Silly & Sweet",
      title: "My Favorite Shoulder to Lean On",
      caption: "Your adorable little pout and the way you always indulge my silliness. Resting my head against your shoulder isn't just comfortable — it feels like returning home to the only peace I ever need."
    },
    {
      type: "image",
      media: "assets/images/WhatsApp Image 2026-10-02 at 7.39.26 PM (1)_enhanced.jpg",
      objectPosition: "center center",
      alt: "Gentle hand on cheek embrace",
      date: "A Tender Touch",
      title: "In The Warmth of Your Hands",
      caption: "The effortless gentleness in the way your hand rests against my cheek, Ponnummaa. In a world that is always rushing and loud, your gentle touch slows time down into pure, quiet magic."
    },
    {
      type: "video",
      videoSrc: "assets/videos/memory5_beach_moment.mp4",
      poster: "assets/images/memory5_poster.jpg",
      objectPosition: "center center",
      alt: "Resting close together under the sun",
      date: "Sunlit Haven",
      title: "Resting Beside My Whole World",
      caption: "Lying close beside you under the warm sun, listening to the quiet rhythm of your breathing. I could spend a thousand lifetimes right here, needing nothing else in this entire universe."
    },
    {
      type: "image",
      media: "assets/images/WhatsApp Image 2026-10-02 at 7.43.12 PM.jpeg",
      objectPosition: "center 38%",
      alt: "Side by side against the ancient stone wall",
      date: "Timeless & True",
      title: "Built on Something Unshakable",
      caption: "Standing together against walls that have stood for centuries, the only thing that felt truly eternal was the love and laughter we shared. With you by my side, every step feels like a story meant to last forever."
    },
    {
      type: "image",
      media: "assets/images/WhatsApp Image 2026-10-02 at 8.33.38 PM.jpeg",
      objectPosition: "center center",
      alt: "Fingers intertwined in a reassuring hold",
      date: "An Unspoken Promise",
      title: "Where My Hand Belongs",
      caption: "That gentle, reassuring grip when your fingers slip effortlessly into mine. It’s an unspoken promise that no matter where the road leads us, you will never have to walk alone."
    },
    {
      type: "image",
      media: "assets/images/WhatsApp Image 2026-10-02 at 7.20.12 PM.jpeg",
      objectPosition: "center 68%",
      alt: "Gazing deeply into each other's eyes in the cafe",
      date: "A World for Two",
      title: "Lost in the Depth of Your Eyes",
      caption: "Surrounded by the hum of the cafe, but all that existed was the depth in your gaze. When you look at me like that, Ponnummaa, the rest of the world fades into silence and my heart feels completely full."
    },
    {
      type: "image",
      media: "assets/images/WhatsApp Image 2026-10-02 at 12.08.05 PM.jpeg",
      objectPosition: "center 38%",
      alt: "Fun mirror selfie during shopping",
      date: "Everyday Magic",
      title: "Ordinary Days Made Extraordinary",
      caption: "Even wandering through clothing racks and taking silly mirror selfies becomes a treasured adventure with you. You have this magical gift of turning the simplest everyday moments into pure joy."
    },
    {
      type: "image",
      media: "assets/images/WhatsApp Image 2026-10-02 at 12.21.24 PM (1).jpeg",
      objectPosition: "center 40%",
      alt: "Warm mirror selfie embrace holding each other tight",
      date: "My Safe Haven",
      title: "Wrapped in Pure Warmth",
      caption: "Holding you close against my chest, feeling your arms wrap around me — this is where every storm stops. In your embrace, Ponnummaa, I found the safest sanctuary my heart will ever know."
    },
    {
      type: "video",
      videoSrc: "assets/videos/memory11_bike_ride.mp4",
      poster: "assets/images/memory11_poster.jpg",
      objectPosition: "center 40%",
      alt: "Riding the open road together with arms wrapped tight",
      date: "The Open Road",
      title: "Holding Tight to Forever",
      caption: "Wind rushing past us, the open sky ahead, and your arms wrapped gently around my waist. With you holding on to me, Ponnummaa, there was no destination that mattered — only the feeling of having my entire universe right behind me."
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 7. GALLERY WALL (Scene 5)
  // ─────────────────────────────────────────────────────────────────────────
  // Photos displayed in an elegant masonry grid. Clicking any photo opens a
  // full-screen swipeable lightbox. You can add as many as you wish!
  gallery: [
    {
      type: "video",
      videoSrc: "assets/videos/VID_762790929_010440_335.mp4",
      poster: "assets/images/memory1_video_poster.jpg",
      image: "assets/images/memory1_video_poster.jpg",
      objectPosition: "center center",
      caption: "Where our journey began",
      aspect: "portrait"
    },
    {
      image: "assets/images/Screenshot 2026-10-02 195618.png",
      caption: "Smiles that feel like home",
      aspect: "portrait"
    },
    {
      image: "assets/images/WhatsApp Image 2026-10-02 at 12.16.16 PM (1)_aligned.jpg",
      caption: "My favorite shoulder to lean on",
      aspect: "landscape"
    },
    {
      image: "assets/images/WhatsApp Image 2026-10-02 at 7.39.26 PM (1)_enhanced.jpg",
      caption: "In the warmth of your hands",
      aspect: "portrait"
    },
    {
      type: "video",
      videoSrc: "assets/videos/memory5_beach_moment.mp4",
      poster: "assets/images/memory5_poster.jpg",
      image: "assets/images/memory5_poster.jpg",
      caption: "Resting beside my whole world",
      aspect: "landscape"
    },
    {
      image: "assets/images/WhatsApp Image 2026-10-02 at 7.43.12 PM.jpeg",
      caption: "Built on something unshakable",
      aspect: "portrait"
    },
    {
      image: "assets/images/WhatsApp Image 2026-10-02 at 8.33.38 PM.jpeg",
      caption: "Where my hand belongs",
      aspect: "portrait"
    },
    {
      image: "assets/images/WhatsApp Image 2026-10-02 at 7.20.12 PM.jpeg",
      caption: "Lost in the depth of your eyes",
      aspect: "portrait"
    },
    {
      image: "assets/images/WhatsApp Image 2026-10-02 at 12.08.05 PM.jpeg",
      caption: "Ordinary days made extraordinary",
      aspect: "portrait"
    },
    {
      image: "assets/images/WhatsApp Image 2026-10-02 at 12.21.24 PM (1).jpeg",
      caption: "Wrapped in pure warmth",
      aspect: "portrait"
    },
    {
      type: "video",
      videoSrc: "assets/videos/memory11_bike_ride.mp4",
      poster: "assets/images/memory11_poster.jpg",
      image: "assets/images/memory11_poster.jpg",
      caption: "Holding tight to forever",
      aspect: "landscape"
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 8. REASONS I LOVE YOU (Scene 6)
  // ─────────────────────────────────────────────────────────────────────────
  // Interactive 3D flip cards! The front displays a heart & number, the back
  // reveals your heartfelt reason. Tap to flip.
  // One card starts face-up so the page feels inviting right away.
  reasons: [
    {
      number: "01",
      title: "Your Radiant Kindness",
      text: "The effortless, selfless grace with which you treat every living soul around you inspires me every single day."
    },
    {
      number: "02",
      title: "Your Little Crinkled Smile",
      text: "The way your nose crinkles when you genuinely burst out laughing. It melts every stress in my mind instantly."
    },
    {
      number: "03",
      title: "How Safe You Make Me Feel",
      text: "With you, I never have to wear a mask. You welcome every thought, every flaw, and make me feel completely cherished."
    },
    {
      number: "04",
      title: "Your Fierce Ambition",
      text: "Seeing you work hard for your dreams with such grit and passion makes me so endlessly proud to stand by your side."
    },
    {
      number: "05",
      title: "The Sound of Your Voice",
      text: "Even on my heaviest days, just one phone call from you washes away every worry. Your voice is my favorite melody."
    },
    {
      number: "06",
      title: "The Way You Hold My Hand",
      text: "That subconscious gentle squeeze you give my fingers when we are walking or sitting together. It anchors my heart."
    },
    {
      number: "07",
      title: "Your Unmatched Empathy",
      text: "You notice the little things no one else does. You feel deeply and love with an honesty that is so rare in this world."
    },
    {
      number: "08",
      title: "Simply Being Ponnummaa",
      text: "There is only one Shamriya Sherin in all the universe, and by some miracle, she chose to love me. I am the luckiest person alive."
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 9. THE LOVE LETTER (Scene 7)
  // ─────────────────────────────────────────────────────────────────────────
  // Appears on a warm deckle-edge paper card, typing itself out smoothly
  // paragraph by paragraph. A "Skip to End" button lets her read at her pace.
  letter: {
    salutation: "My Dearest Ponnummaa,",
    paragraphs: [
      "Happy 18th birthday to the most precious girl in my life. Welcoming Chapter 18 is such a magical milestone, and having you in my life is the greatest blessing I could ever ask for.",
      "As I sit down to write this, I find myself thinking back over every milestone we've shared. Time has a funny way of rushing past, yet every moment spent in your presence feels gently frozen in gold — etched deep into my soul where nothing can ever erase it.",
      "Thank you for being my anchor when life feels turbulent, and my greatest cheerleader whenever I take a leap of faith. Thank you for your warmth, your silly jokes, your patience, and the unconditional love you wrap around me like a blanket.",
      "From the deepest corner of my heart, I also want to say: I am truly sorry for every time I have ever hurt you, made you feel upset, or failed to understand you the way you deserved. If my words, my silence, or my shortcomings ever brought pain or tears to your gentle eyes, please forgive me. You are the last person in this entire world I would ever want to hurt, and I am so deeply grateful for your endless patience, your forgiveness, and the grace with which you love me even on my imperfect days.",
      "Being miles apart from you in this long distance is never easy. There are so many quiet moments where all my heart longs for is to be right there beside you — to hold your hand, to look into your eyes without a screen between us, and to wipe away your worries with a warm embrace. But this distance has only proven one undeniable truth: physical distance means nothing when someone means everything to you. No matter how many kilometers lie between us, you have never felt far from my heart, and every single day brings us one step closer to the forever where we will never have to say goodbye.",
      "On this birthday, I want to promise you that no matter how many years roll by, I will always choose you. I will listen to your stories, kiss your forehead on tired evenings, cheer for every one of your victories, and love you a little more today than yesterday.",
      "May this year bring you all the gentle joy, radiant health, and boundless dreams your pure heart deserves. You are my home, Shamriya, today and all the tomorrows to come."
    ],
    closing: "Forever and always yours,",
    // REPLACE: Your signature as it should appear in elegant script
    signOff: "With all my heart & soul"
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 10. MEMORY LANE RECAP (Scene 8)
  // ─────────────────────────────────────────────────────────────────────────
  // Quick cross-fading highlight reel re-showing your favourite moments
  // before the grand finale.
  recap: {
    title: "A Glimpse Along Memory Lane",
    subtitle: "Just a few of the million moments that made me fall for you...",
    autoPlayIntervalSeconds: 4, // Seconds per slide
    slides: [
      {
        image: "assets/images/memory1_video_poster.jpg",
        caption: "Where our journey began"
      },
      {
        image: "assets/images/WhatsApp Image 2026-10-02 at 12.16.16 PM (1)_aligned.jpg",
        caption: "My favorite shoulder to lean on"
      },
      {
        image: "assets/images/WhatsApp Image 2026-10-02 at 7.39.26 PM (1)_enhanced.jpg",
        caption: "In the warmth of your hands"
      },
      {
        image: "assets/images/WhatsApp Image 2026-10-02 at 7.20.12 PM.jpeg",
        caption: "Lost in the depth of your eyes"
      },
      {
        image: "assets/images/WhatsApp Image 2026-10-02 at 12.21.24 PM (1).jpeg",
        caption: "Wrapped in pure warmth"
      },
      {
        image: "assets/images/memory11_poster.jpg",
        caption: "Holding tight to forever"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 11. MAKE A WISH (CAKE & CANDLES) (Scene 9)
  // ─────────────────────────────────────────────────────────────────────────
  wishScene: {
    title: "Make an 18th Birthday Wish",
    instruction: "Take a deep breath, make the sweetest wish for Chapter 18 in your heart, and blow out the candles.",
    buttonText: "Blow Out The Candles 🎂",
    blownSuccessMessage: "May every wish whispered for your 18th chapter come true, Ponnummaa! ✨",
    enableMicBlowDetection: true, // Set to true to allow blowing into phone microphone (button always works as fallback)
    celebrationMusicUrl: "assets/audio/girl_in_red_october.mp3"
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 12. FINALE (Scene 10)
  // ─────────────────────────────────────────────────────────────────────────
  finale: {
    bigLoveText: "I Love You, Ponnummaa",
    closingMessage: "Happiest 18th Birthday, Shamriya Sherin. Stepping into this magical Chapter 18 as the sweetest, most precious soul in my universe. Thank you for blessing my life with your gentle smile, your warmth, and a love that feels like home. Here is to our past, our present, and the forever waiting for us.",
    replayButtonText: "Replay Our Story ↺"
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 13. VISUAL EFFECTS SETTINGS (Canvas Petals & Transitions)
  // ─────────────────────────────────────────────────────────────────────────
  effects: {
    // Number of floating rose petals on screen (lower = lighter on battery)
    petalCount: 22,
    // Celebration confetti count upon blowing out birthday candles
    confettiBurstCount: 160
  }
};

// Freeze configuration to prevent accidental mutations at runtime
Object.freeze(CONFIG);
