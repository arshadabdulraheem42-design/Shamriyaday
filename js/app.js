/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    APP.JS — CORE APPLICATION ENGINE
 * ═══════════════════════════════════════════════════════════════════════════
 * Scene management, live counter ticker, memories polaroids, gallery lightbox,
 * 3D flip cards, typewriter letter, recap slideshow, cake blow detection,
 * touch gestures, and keyboard navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Validate configuration object
  if (typeof CONFIG === 'undefined') {
    console.error('[App] Critical: CONFIG object not found. Ensure config.js is loaded first.');
    return;
  }

  // Fallback image in case any user image path is broken
  const DEFAULT_FALLBACK_IMAGE = 'assets/images/memory-1.svg';

  /* ─────────────────────────────────────────────────────────────────────────
     STATE MANAGEMENT
     ───────────────────────────────────────────────────────────────────────── */
  const scenes = Array.from(document.querySelectorAll('.scene'));
  let currentSceneIndex = 0;
  const totalScenes = scenes.length;

  let currentMemoryIndex = 0;
  let currentLightboxIndex = 0;
  let currentRecapSlideIndex = 0;
  let recapInterval = null;

  let typewriterTimeout = null;
  let letterIsTyped = false;

  let candlesBlownOut = false;
  let micStream = null;
  let micAudioContext = null;

  // Touch gesture tracking
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  /* ─────────────────────────────────────────────────────────────────────────
     DOM CACHE
     ───────────────────────────────────────────────────────────────────────── */
  const progressBar = document.getElementById('progressBar');
  const sceneIndicator = document.getElementById('sceneIndicator');
  const bottomNav = document.getElementById('bottomNav');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const swipeHintPill = document.getElementById('swipeHintPill');
  const swipeHintText = document.getElementById('swipeHintText');
  const lightBloom = document.getElementById('lightBloom');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  /* ─────────────────────────────────────────────────────────────────────────
     ROBUST IMAGE FALLBACK HANDLER
     Gracefully catches any missing/broken image path without ugly broken icons
     ───────────────────────────────────────────────────────────────────────── */
  function attachImageFallback(imgElement, originalPath) {
    if (!imgElement) return;
    imgElement.addEventListener('error', function errorHandler() {
      console.warn(`[Image Fallback] Failed to load image: "${originalPath}". Using graceful placeholder.`);
      this.src = DEFAULT_FALLBACK_IMAGE;
      this.removeEventListener('error', errorHandler);
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     SCENE MANAGER & NAVIGATION
     ───────────────────────────────────────────────────────────────────────── */
  function updateProgressAndControls() {
    // Top Progress Bar
    const progressPercent = (currentSceneIndex / (totalScenes - 1)) * 100;
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }

    // Scene indicator badge
    if (sceneIndicator) {
      if (currentSceneIndex === 0) {
        sceneIndicator.classList.remove('visible');
      } else {
        sceneIndicator.classList.add('visible');
        sceneIndicator.textContent = `${currentSceneIndex} of ${totalScenes - 1}`;
      }
    }

    // Bottom Navigation visibility & button states
    if (bottomNav) {
      if (currentSceneIndex === 0) {
        bottomNav.classList.remove('visible');
      } else {
        bottomNav.classList.add('visible');
      }
    }

    if (prevBtn) {
      prevBtn.disabled = currentSceneIndex <= 1 && currentMemoryIndex <= 0;
    }

    if (nextBtn) {
      if (currentSceneIndex === totalScenes - 1) {
        nextBtn.style.display = 'none';
      } else {
        nextBtn.style.display = 'inline-flex';
        nextBtn.disabled = false;
      }
    }

    // Dynamic Swipe Prompt Hint Text
    if (swipeHintText) {
      const activeScene = scenes[currentSceneIndex];
      const activeId = activeScene ? activeScene.id : '';
      if (activeId === 'scene-story') {
        const memCount = (CONFIG.memories && CONFIG.memories.length) || 1;
        if (currentMemoryIndex < memCount - 1) {
          swipeHintText.textContent = `Swipe right for memory ${currentMemoryIndex + 2}`;
        } else {
          swipeHintText.textContent = "Swipe right to continue";
        }
      } else if (activeId === 'scene-wish') {
        swipeHintText.textContent = "Swipe right for finale";
      } else if (currentSceneIndex === totalScenes - 1) {
        swipeHintText.textContent = "Replay our story ↺";
      } else {
        swipeHintText.textContent = "Swipe right to continue";
      }
    }
  }

  function goToScene(index, direction = 'next') {
    if (index < 0 || index >= totalScenes) return;
    if (index === currentSceneIndex && scenes[currentSceneIndex].classList.contains('active')) return;

    const oldScene = scenes[currentSceneIndex];
    const targetScene = scenes[index];

    // Exit hooks
    if (oldScene && oldScene.id === 'scene-recap' && (!targetScene || targetScene.id !== 'scene-recap')) {
      stopRecapAutoPlay();
    }

    if (oldScene && oldScene !== targetScene) {
      oldScene.classList.remove('active', 'slide-enter-left', 'slide-enter-right');
      if (direction === 'next') {
        oldScene.classList.add('slide-exit-left');
        targetScene.classList.add('slide-enter-right');
      } else {
        oldScene.classList.add('slide-exit-right');
        targetScene.classList.add('slide-enter-left');
      }

      // Force layout recalculation
      void targetScene.offsetWidth;

      setTimeout(() => {
        oldScene.classList.remove('slide-exit-left', 'slide-exit-right');
      }, 700);
    }

    currentSceneIndex = index;
    targetScene.classList.add('active');
    targetScene.classList.remove('slide-enter-left', 'slide-enter-right');
    targetScene.setAttribute('aria-hidden', 'false');

    // Scroll scene to top
    targetScene.scrollTop = 0;

    updateProgressAndControls();

    // Scene Entry Hooks
    if (targetScene && targetScene.id === 'scene-letter' && !letterIsTyped) {
      startLetterTypewriter();
    } else if (targetScene && targetScene.id === 'scene-recap') {
      startRecapAutoPlay();
    } else if (targetScene && targetScene.id === 'scene-gallery') {
      const vids = targetScene.querySelectorAll('video');
      vids.forEach(v => { v.muted = true; v.play().catch(() => {}); });
    } else if (targetScene && targetScene.id === 'scene-wish' && !candlesBlownOut) {
      setupMicBlowDetection();
    }
  }

  function nextScene() {
    if (currentSceneIndex < totalScenes - 1) {
      goToScene(currentSceneIndex + 1, 'next');
    }
  }

  function prevScene() {
    if (currentSceneIndex > 1) {
      goToScene(currentSceneIndex - 1, 'prev');
    }
  }

  // Unified Swipe Left (Forward) Handler
  function swipeLeft() {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      const list = activeLightboxList || CONFIG.gallery || [];
      if (list.length) openLightbox((currentLightboxIndex + 1) % list.length, list);
      return;
    }

    // In Our Story scene: swipe left traverses polaroids first
    const activeScene = scenes[currentSceneIndex];
    if (activeScene && activeScene.id === 'scene-story') {
      const list = CONFIG.memories || [];
      if (currentMemoryIndex < list.length - 1) {
        renderMemory(currentMemoryIndex + 1);
        updateProgressAndControls();
        return;
      }
    }

    nextScene();
  }

  // Unified Swipe Right (Backward) Handler
  function swipeRight() {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      const list = activeLightboxList || CONFIG.gallery || [];
      if (list.length) openLightbox((currentLightboxIndex - 1 + list.length) % list.length, list);
      return;
    }

    // In Our Story scene: swipe right traverses polaroids backward first
    const activeScene = scenes[currentSceneIndex];
    if (activeScene && activeScene.id === 'scene-story') {
      if (currentMemoryIndex > 0) {
        renderMemory(currentMemoryIndex - 1);
        updateProgressAndControls();
        return;
      }
    }

    prevScene();
  }

  /* ─────────────────────────────────────────────────────────────────────────
     TOUCH & DRAG SWIPE GESTURES
     ───────────────────────────────────────────────────────────────────────── */
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }

  function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Minimum horizontal swipe distance of 40px, dominating vertical movement
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0 && currentSceneIndex > 0) {
        // Swiped Left -> Advance
        swipeLeft();
      } else if (deltaX > 0 && currentSceneIndex > 1) {
        // Swiped Right -> Go Back
        swipeRight();
      }
    }
  }

  // Desktop Mouse Drag Swipe Support
  let isMouseDown = false;
  let mouseStartX = 0;
  let mouseStartY = 0;

  function handleMouseDown(e) {
    if (e.target.closest('button, input, a, .flip-card, .cake-container, #audioToggle, .lightbox-modal')) return;
    isMouseDown = true;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
  }

  function handleMouseUp(e) {
    if (!isMouseDown) return;
    isMouseDown = false;
    const deltaX = e.clientX - mouseStartX;
    const deltaY = e.clientY - mouseStartY;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0 && currentSceneIndex > 0) {
        swipeLeft();
      } else if (deltaX > 0 && currentSceneIndex > 1) {
        swipeRight();
      }
    }
  }

  // Trackpad horizontal swipe
  let wheelThrottle = false;
  function handleWheel(e) {
    if (lightboxModal && lightboxModal.classList.contains('active')) return;
    if (Math.abs(e.deltaX) > 45 && !wheelThrottle) {
      wheelThrottle = true;
      if (e.deltaX > 0) {
        swipeLeft();
      } else {
        swipeRight();
      }
      setTimeout(() => { wheelThrottle = false; }, 500);
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     1. INVITATION SCENE
     ───────────────────────────────────────────────────────────────────────── */
  function initInvitation() {
    const teaserEl = document.getElementById('invitationTeaser');
    const promptEl = document.getElementById('invitationPrompt');
    const hintEl = document.getElementById('invitationHint');
    const startBtn = document.getElementById('startJourneyBtn');

    if (teaserEl && CONFIG.invitation) teaserEl.textContent = CONFIG.invitation.teaser || '';
    if (promptEl && CONFIG.invitation) promptEl.textContent = CONFIG.invitation.promptText || '';
    if (hintEl && CONFIG.invitation) hintEl.textContent = CONFIG.invitation.audioHint || '';

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        // 1. Trigger background romantic music
        if (typeof AudioManager !== 'undefined') {
          AudioManager.startAudioOnUserGesture();
        }

        // 2. Gentle light-bloom transition
        if (lightBloom) {
          lightBloom.classList.add('active');
          setTimeout(() => {
            goToScene(1); // Title scene
            setTimeout(() => {
              lightBloom.classList.remove('active');
            }, 500);
          }, 450);
        } else {
          goToScene(1);
        }
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     2. TITLE SCENE
     ───────────────────────────────────────────────────────────────────────── */
  function initTitleScene() {
    const greetingEl = document.getElementById('titleGreeting');
    const petnameEl = document.getElementById('titlePetName');
    const fullnameEl = document.getElementById('titleFullName');
    const taglineEl = document.getElementById('titleTagline');

    if (greetingEl) greetingEl.textContent = (CONFIG.titleScene && CONFIG.titleScene.greeting) || "Happy Birthday";
    if (petnameEl) petnameEl.textContent = CONFIG.petName || "Ponnummaa";
    if (fullnameEl) fullnameEl.textContent = CONFIG.fullName || "Shamriya Sherin";
    if (taglineEl) taglineEl.textContent = (CONFIG.titleScene && CONFIG.titleScene.tagline) || "";
  }

  /* ─────────────────────────────────────────────────────────────────────────
     3. TIME TOGETHER COUNTER
     ───────────────────────────────────────────────────────────────────────── */
  function initTimeCounter() {
    const titleEl = document.getElementById('counterTitle');
    const subtitleEl = document.getElementById('counterSubtitle');
    const dateLabelEl = document.getElementById('counterDateLabel');

    if (titleEl) titleEl.textContent = (CONFIG.counterScene && CONFIG.counterScene.title) || "Time by Your Side";
    if (subtitleEl) subtitleEl.textContent = (CONFIG.counterScene && CONFIG.counterScene.subtitle) || "";
    if (dateLabelEl) dateLabelEl.textContent = CONFIG.relationshipDateLabel || "";

    const elYears = document.getElementById('countYears');
    const elMonths = document.getElementById('countMonths');
    const elDays = document.getElementById('countDays');
    const elHours = document.getElementById('countHours');
    const elMins = document.getElementById('countMinutes');
    const elSecs = document.getElementById('countSeconds');

    const startDate = new Date(CONFIG.relationshipStartDate || '2022-01-01');

    function updateCounter() {
      const now = new Date();
      if (now < startDate) {
        if (elYears) elYears.textContent = "0";
        return;
      }

      // Calculate calendar differences
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        // Days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      if (elYears) elYears.textContent = years;
      if (elMonths) elMonths.textContent = months;
      if (elDays) elDays.textContent = days;
      if (elHours) elHours.textContent = hours.toString().padStart(2, '0');
      if (elMins) elMins.textContent = minutes.toString().padStart(2, '0');
      if (elSecs) elSecs.textContent = seconds.toString().padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }

  /* ─────────────────────────────────────────────────────────────────────────
     4. OUR STORY (MEMORIES CAROUSEL)
     ───────────────────────────────────────────────────────────────────────── */
  function renderMemory(index) {
    const list = CONFIG.memories || [];
    if (!list.length) return;

    if (index < 0) index = 0;
    if (index >= list.length) index = list.length - 1;
    currentMemoryIndex = index;

    const item = list[currentMemoryIndex];
    const badgeEl = document.getElementById('memoryCounterBadge');
    const dateEl = document.getElementById('memoryDateTag');
    const mediaContainer = document.getElementById('polaroidMedia');
    const titleEl = document.getElementById('polaroidTitle');
    const captionEl = document.getElementById('polaroidCaption');
    const prevMemBtn = document.getElementById('memoryPrevBtn');
    const nextMemBtn = document.getElementById('memoryNextBtn');

    if (badgeEl) badgeEl.textContent = `Memory ${currentMemoryIndex + 1} of ${list.length}`;
    if (dateEl) dateEl.textContent = item.date || '';
    if (titleEl) titleEl.textContent = item.title || '';
    if (captionEl) captionEl.textContent = item.caption || '';

    if (prevMemBtn) prevMemBtn.disabled = currentMemoryIndex === 0;
    if (nextMemBtn) nextMemBtn.disabled = currentMemoryIndex === list.length - 1;

    if (mediaContainer) {
      mediaContainer.innerHTML = '';
      if (item.type === 'video') {
        const video = document.createElement('video');
        video.className = 'polaroid-video';
        video.src = item.videoSrc;
        video.poster = item.poster || DEFAULT_FALLBACK_IMAGE;
        video.controls = true;
        video.playsInline = true;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.preload = 'auto';
        if (item.objectPosition) {
          video.style.objectPosition = item.objectPosition;
        }
        mediaContainer.appendChild(video);
        video.play().catch(() => {});
      } else {
        const img = document.createElement('img');
        img.className = 'polaroid-img';
        img.src = item.media || DEFAULT_FALLBACK_IMAGE;
        img.alt = item.alt || item.title || 'Romantic memory';
        if (item.objectPosition) {
          img.style.objectPosition = item.objectPosition;
        }
        attachImageFallback(img, item.media);
        mediaContainer.appendChild(img);
      }
    }
  }

  function initStory() {
    renderMemory(0);
    const prevMemBtn = document.getElementById('memoryPrevBtn');
    const nextMemBtn = document.getElementById('memoryNextBtn');

    if (prevMemBtn) {
      prevMemBtn.addEventListener('click', () => {
        renderMemory(currentMemoryIndex - 1);
      });
    }
    if (nextMemBtn) {
      nextMemBtn.addEventListener('click', () => {
        renderMemory(currentMemoryIndex + 1);
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     5. GALLERY WALL & LIGHTBOX
     ───────────────────────────────────────────────────────────────────────── */
  let activeLightboxList = null;

  function openLightbox(index, customList = null) {
    if (customList) {
      activeLightboxList = customList;
    } else if (!activeLightboxList) {
      activeLightboxList = CONFIG.gallery || [];
    }
    const list = activeLightboxList;
    if (!list.length || index < 0 || index >= list.length) return;
    currentLightboxIndex = index;
    const item = list[currentLightboxIndex];

    const isVideo = Boolean(item.type === 'video' || item.videoSrc);

    if (isVideo) {
      if (lightboxImg) {
        lightboxImg.style.display = 'none';
        lightboxImg.src = '';
      }
      if (lightboxVideo) {
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = item.videoSrc;
        if (item.poster) lightboxVideo.poster = item.poster;
        lightboxVideo.currentTime = 0;
        lightboxVideo.play().catch(() => {});
      }
    } else {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');
        lightboxVideo.load();
        lightboxVideo.style.display = 'none';
      }
      if (lightboxImg) {
        lightboxImg.style.display = 'block';
        lightboxImg.src = item.image;
        attachImageFallback(lightboxImg, item.image);
        if (item.isGrayscale) {
          lightboxImg.classList.add('lightbox-bw');
        } else {
          lightboxImg.classList.remove('lightbox-bw');
        }
      }
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption || '';
    }
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeLightbox() {
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
      lightboxVideo.load();
      lightboxVideo.style.display = 'none';
    }
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     HER CHILDHOOD MEMORIES (3-PHOTO SHOWCASE)
     ───────────────────────────────────────────────────────────────────────── */
  function initChildhood() {
    const badgeEl = document.getElementById('childhoodBadge');
    const titleEl = document.getElementById('childhoodTitle');
    const subtitleEl = document.getElementById('childhoodSubtitle');
    const gridEl = document.getElementById('childhoodGrid');

    const config = CONFIG.childhoodScene;
    if (!config || !gridEl) return;

    if (badgeEl && config.badge) badgeEl.textContent = config.badge;
    if (titleEl && config.title) titleEl.textContent = config.title;
    if (subtitleEl && config.subtitle) subtitleEl.textContent = config.subtitle;

    const photos = config.photos || [];
    gridEl.innerHTML = '';

    photos.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'childhood-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${item.title || 'Childhood Photo'}: ${item.caption || ''}`);

      card.innerHTML = `
        <div class="childhood-photo-frame">
          <span class="childhood-tag-pill">${item.tag || `Photo 0${index + 1}`}</span>
          <img src="${item.image}" alt="${item.title || 'Childhood Memory'}" loading="lazy">
          <div class="childhood-expand-icon" aria-hidden="true" title="Expand Photo">
            <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
          </div>
        </div>
        <div class="childhood-card-content">
          <h3 class="childhood-card-title">${item.title || ''}</h3>
          <p class="childhood-card-caption">${item.caption || ''}</p>
        </div>
      `;

      const img = card.querySelector('img');
      if (item.objectPosition) {
        img.style.objectPosition = item.objectPosition;
      }
      attachImageFallback(img, item.image);

      const expandAction = () => {
        const childhoodGalleryList = photos.map(p => ({
          image: p.image,
          caption: `${p.title ? p.title + ' • ' : ''}${p.caption || ''}`,
          isGrayscale: false
        }));
        openLightbox(index, childhoodGalleryList);
      };

      card.addEventListener('click', expandAction);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          expandAction();
        }
      });

      gridEl.appendChild(card);
    });
  }

  function initGallery() {
    const container = document.getElementById('galleryGrid');
    if (!container) return;
    const list = CONFIG.gallery || [];
    container.innerHTML = '';

    list.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `gallery-item ${item.aspect || ''}`;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      const isVideo = Boolean(item.type === 'video' || item.videoSrc);
      card.setAttribute('aria-label', `View ${isVideo ? 'video' : 'photo'}: ${item.caption || ''}`);

      if (isVideo) {
        const video = document.createElement('video');
        video.src = item.videoSrc;
        if (item.poster) video.poster = item.poster;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.preload = 'metadata';
        if (item.objectPosition) {
          video.style.objectPosition = item.objectPosition;
        }
        card.appendChild(video);

        const badge = document.createElement('span');
        badge.className = 'gallery-video-badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.innerHTML = '▶';
        card.appendChild(badge);

        video.play().catch(() => {});
      } else {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.caption || 'Our moment together';
        img.loading = 'lazy';
        if (item.objectPosition) {
          img.style.objectPosition = item.objectPosition;
        }
        attachImageFallback(img, item.image);
        card.appendChild(img);
      }

      const overlay = document.createElement('div');
      overlay.className = 'gallery-item-overlay';
      overlay.innerHTML = `<p class="gallery-item-caption">${item.caption || ''}</p>`;

      card.appendChild(overlay);

      card.addEventListener('click', () => openLightbox(index, CONFIG.gallery));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index, CONFIG.gallery);
        }
      });

      container.appendChild(card);
    });

    // Lightbox Controls
    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }
    if (lightboxPrevBtn) {
      lightboxPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const list = activeLightboxList || CONFIG.gallery || [];
        if (!list.length) return;
        const newIndex = (currentLightboxIndex - 1 + list.length) % list.length;
        openLightbox(newIndex, list);
      });
    }
    if (lightboxNextBtn) {
      lightboxNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const list = activeLightboxList || CONFIG.gallery || [];
        if (!list.length) return;
        const newIndex = (currentLightboxIndex + 1) % list.length;
        openLightbox(newIndex, list);
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     6. REASONS I LOVE YOU (3D FLIP CARDS)
     ───────────────────────────────────────────────────────────────────────── */
  function initReasons() {
    const container = document.getElementById('reasonsGrid');
    if (!container) return;
    const list = CONFIG.reasons || [];
    container.innerHTML = '';

    list.forEach((item, idx) => {
      const card = document.createElement('div');
      // Card 0 starts face-up as a preview so page doesn't look empty on load
      card.className = `flip-card ${idx === 0 ? 'flipped' : ''}`;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Reason ${item.number}: ${item.title}`);

      card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <span class="flip-number">${item.number}</span>
            <svg class="flip-heart-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="flip-tap-prompt">Tap to Reveal</span>
          </div>
          <div class="flip-card-back">
            <h4 class="flip-title">${item.title}</h4>
            <p class="flip-text">${item.text}</p>
          </div>
        </div>
      `;

      const toggleFlip = () => card.classList.toggle('flipped');
      card.addEventListener('click', toggleFlip);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFlip();
        }
      });

      container.appendChild(card);
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     7. THE LETTER (TYPEWRITER EFFECT)
     ───────────────────────────────────────────────────────────────────────── */
  function renderFullLetter() {
    clearTimeout(typewriterTimeout);
    letterIsTyped = true;
    const bodyEl = document.getElementById('letterBody');
    if (!bodyEl || !CONFIG.letter) return;

    bodyEl.innerHTML = '';
    CONFIG.letter.paragraphs.forEach(p => {
      const pEl = document.createElement('p');
      pEl.className = 'letter-paragraph';
      pEl.textContent = p;
      bodyEl.appendChild(pEl);
    });

    const skipBtn = document.getElementById('letterSkipBtn');
    if (skipBtn) skipBtn.style.display = 'none';
  }

  function startLetterTypewriter() {
    const bodyEl = document.getElementById('letterBody');
    if (!bodyEl || !CONFIG.letter || letterIsTyped) return;

    const paragraphs = CONFIG.letter.paragraphs || [];
    bodyEl.innerHTML = '';

    let pIndex = 0;
    let charIndex = 0;
    let currentParagraphEl = document.createElement('p');
    currentParagraphEl.className = 'letter-paragraph';
    bodyEl.appendChild(currentParagraphEl);

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    bodyEl.appendChild(cursor);

    function typeNextChar() {
      if (pIndex >= paragraphs.length) {
        letterIsTyped = true;
        cursor.remove();
        const skipBtn = document.getElementById('letterSkipBtn');
        if (skipBtn) skipBtn.style.display = 'none';
        return;
      }

      const text = paragraphs[pIndex];
      if (charIndex < text.length) {
        currentParagraphEl.textContent += text.charAt(charIndex);
        charIndex++;
        typewriterTimeout = setTimeout(typeNextChar, 24);
      } else {
        pIndex++;
        charIndex = 0;
        if (pIndex < paragraphs.length) {
          currentParagraphEl = document.createElement('p');
          currentParagraphEl.className = 'letter-paragraph';
          bodyEl.insertBefore(currentParagraphEl, cursor);
          typewriterTimeout = setTimeout(typeNextChar, 420); // Pause between paragraphs
        } else {
          typeNextChar();
        }
      }
    }

    typeNextChar();
  }

  function initLetter() {
    const salutationEl = document.getElementById('letterSalutation');
    const closingEl = document.getElementById('letterClosing');
    const signatureEl = document.getElementById('letterSignature');
    const skipBtn = document.getElementById('letterSkipBtn');

    if (salutationEl && CONFIG.letter) salutationEl.textContent = CONFIG.letter.salutation || "My Dearest,";
    if (closingEl && CONFIG.letter) closingEl.textContent = CONFIG.letter.closing || "Forever yours,";
    if (signatureEl) signatureEl.textContent = (CONFIG.letter && CONFIG.letter.signOff) || CONFIG.senderName || "With all my love";

    if (skipBtn) {
      skipBtn.addEventListener('click', renderFullLetter);
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     8. MEMORY LANE RECAP (HIGHLIGHT REEL SLIDESHOW)
     ───────────────────────────────────────────────────────────────────────── */
  function renderRecapSlide(index) {
    const slides = (CONFIG.recap && CONFIG.recap.slides) || [];
    if (!slides.length) return;
    currentRecapSlideIndex = (index + slides.length) % slides.length;

    const viewport = document.getElementById('recapViewport');
    const captionEl = document.getElementById('recapCaption');
    const bars = document.querySelectorAll('.recap-bar-segment-fill');

    if (!viewport) return;
    const slideItems = viewport.querySelectorAll('.recap-slide');

    slideItems.forEach((s, idx) => {
      if (idx === currentRecapSlideIndex) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    if (captionEl) {
      captionEl.textContent = slides[currentRecapSlideIndex].caption || '';
    }

    // Update progress bars
    bars.forEach((bar, idx) => {
      if (idx < currentRecapSlideIndex) {
        bar.style.width = '100%';
      } else if (idx === currentRecapSlideIndex) {
        bar.style.width = '100%';
        bar.style.transition = `width ${(CONFIG.recap.autoPlayIntervalSeconds || 4)}s linear`;
      } else {
        bar.style.width = '0%';
        bar.style.transition = 'none';
      }
    });
  }

  function startRecapAutoPlay() {
    stopRecapAutoPlay();
    const slides = (CONFIG.recap && CONFIG.recap.slides) || [];
    if (!slides.length) return;

    renderRecapSlide(0);
    const intervalSecs = (CONFIG.recap && CONFIG.recap.autoPlayIntervalSeconds) || 4;

    recapInterval = setInterval(() => {
      const nextIdx = currentRecapSlideIndex + 1;
      if (nextIdx < slides.length) {
        renderRecapSlide(nextIdx);
      } else {
        // Finished highlight reel, proceed smoothly to wish scene!
        stopRecapAutoPlay();
        setTimeout(() => {
          const wishIdx = scenes.findIndex(s => s.id === 'scene-wish');
          goToScene(wishIdx !== -1 ? wishIdx : currentSceneIndex + 1);
        }, 1200);
      }
    }, intervalSecs * 1000);
  }

  function stopRecapAutoPlay() {
    if (recapInterval) {
      clearInterval(recapInterval);
      recapInterval = null;
    }
  }

  function initRecap() {
    const titleEl = document.getElementById('recapTitle');
    const subtitleEl = document.getElementById('recapSubtitle');
    const viewport = document.getElementById('recapViewport');
    const barContainer = document.getElementById('recapProgressBar');
    const skipBtn = document.getElementById('recapSkipBtn');

    if (titleEl && CONFIG.recap) titleEl.textContent = CONFIG.recap.title || "Memory Lane";
    if (subtitleEl && CONFIG.recap) subtitleEl.textContent = CONFIG.recap.subtitle || "";

    const slides = (CONFIG.recap && CONFIG.recap.slides) || [];
    if (viewport && barContainer) {
      viewport.innerHTML = '';
      barContainer.innerHTML = '';

      slides.forEach((item, i) => {
        // Slide item
        const slide = document.createElement('div');
        slide.className = `recap-slide ${i === 0 ? 'active' : ''}`;
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.caption || 'Recap moment';
        attachImageFallback(img, item.image);
        slide.appendChild(img);
        viewport.appendChild(slide);

        // Progress bar segment
        const barSeg = document.createElement('div');
        barSeg.className = 'recap-bar-segment';
        const barFill = document.createElement('div');
        barFill.className = 'recap-bar-segment-fill';
        barSeg.appendChild(barFill);
        barContainer.appendChild(barSeg);
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        stopRecapAutoPlay();
        const wishIdx = scenes.findIndex(s => s.id === 'scene-wish');
        goToScene(wishIdx !== -1 ? wishIdx : currentSceneIndex + 1);
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     9. MAKE A WISH (CAKE & CANDLES)
     ───────────────────────────────────────────────────────────────────────── */
  function blowOutCandles() {
    if (candlesBlownOut) return;
    candlesBlownOut = true;

    // 1. Extinguish candle flames
    const flames = document.querySelectorAll('.flame');
    flames.forEach(f => f.classList.add('extinguished'));

    // 2. Play celebratory birthday melody chime
    if (typeof AudioManager !== 'undefined') {
      AudioManager.playCelebrationChime();
    }

    // 3. Switch background song to celebration track (Girl in Red - We Fell in Love in October)
    const celebrationSong = (CONFIG.wishScene && CONFIG.wishScene.celebrationMusicUrl) ||
                            CONFIG.celebrationMusicUrl ||
                            "assets/audio/girl_in_red_october.mp3";
    if (typeof AudioManager !== 'undefined' && AudioManager.switchSong) {
      setTimeout(() => {
        AudioManager.switchSong(celebrationSong, 1500);
      }, 1600);
    }

    // 3. Burst sparkling confetti and rose petals
    if (typeof Particles !== 'undefined') {
      const cakeEl = document.querySelector('.cake-container');
      let ox = window.innerWidth / 2;
      let oy = window.innerHeight * 0.42;
      if (cakeEl) {
        const rect = cakeEl.getBoundingClientRect();
        ox = rect.left + rect.width / 2;
        oy = rect.top + rect.height * 0.3;
      }
      Particles.burstConfetti(ox, oy);
    }

    // 4. Update UI
    const blowBtn = document.getElementById('blowCakeBtn');
    const successBox = document.getElementById('wishSuccessBox');
    const micStatus = document.getElementById('micStatusPill');

    if (blowBtn) {
      blowBtn.disabled = true;
      blowBtn.textContent = "Candles Extinguished! ✨";
    }
    if (micStatus) {
      micStatus.style.display = 'none';
    }
    if (successBox) {
      successBox.textContent = (CONFIG.wishScene && CONFIG.wishScene.blownSuccessMessage) || "May all your dreams come true!";
      successBox.classList.add('visible');
    }

    // Stop microphone if active
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
  }

  function setupMicBlowDetection() {
    if (candlesBlownOut) return;
    if (!CONFIG.wishScene || !CONFIG.wishScene.enableMicBlowDetection) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    const micStatus = document.getElementById('micStatusPill');

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        micStream = stream;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        micAudioContext = new AudioCtx();
        const analyser = micAudioContext.createAnalyser();
        analyser.fftSize = 512;
        const microphone = micAudioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        if (micStatus) {
          micStatus.style.display = 'inline-flex';
          micStatus.innerHTML = `<span class="mic-dot"></span> Blow into your microphone to extinguish`;
        }

        function checkBlowEnergy() {
          if (candlesBlownOut) return;
          analyser.getByteFrequencyData(dataArray);

          // Rushing wind / blow sound has strong mid-to-high frequency turbulence (bins 30 to 120)
          let blowEnergy = 0;
          for (let i = 25; i < 110; i++) {
            blowEnergy += dataArray[i];
          }
          const averageEnergy = blowEnergy / 85;

          // Blow threshold
          if (averageEnergy > 72) {
            blowOutCandles();
            return;
          }
          requestAnimationFrame(checkBlowEnergy);
        }

        checkBlowEnergy();
      })
      .catch(err => {
        // User denied microphone permission or mic not present.
        // Button remains 100% accessible fallback.
        if (micStatus) micStatus.style.display = 'none';
      });
  }

  function initWishScene() {
    const titleEl = document.getElementById('wishTitle');
    const instructionEl = document.getElementById('wishInstruction');
    const blowBtn = document.getElementById('blowCakeBtn');

    if (titleEl && CONFIG.wishScene) titleEl.textContent = CONFIG.wishScene.title || "Make a Wish";
    if (instructionEl && CONFIG.wishScene) instructionEl.textContent = CONFIG.wishScene.instruction || "";
    if (blowBtn && CONFIG.wishScene) blowBtn.textContent = CONFIG.wishScene.buttonText || "Blow Out The Candles 🎂";

    if (blowBtn) {
      blowBtn.addEventListener('click', blowOutCandles);
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     10. FINALE
     ───────────────────────────────────────────────────────────────────────── */
  function initFinale() {
    const loveTextEl = document.getElementById('finaleLoveText');
    const closingEl = document.getElementById('finaleClosing');
    const senderEl = document.getElementById('finaleSender');
    const replayBtn = document.getElementById('replayBtn');

    if (loveTextEl && CONFIG.finale) loveTextEl.textContent = CONFIG.finale.bigLoveText || `I Love You, ${CONFIG.petName || 'Ponnummaa'}`;
    if (closingEl && CONFIG.finale) closingEl.textContent = CONFIG.finale.closingMessage || "";
    if (senderEl) senderEl.textContent = CONFIG.senderName || "";

    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        // Reset state for replay
        candlesBlownOut = false;
        const flames = document.querySelectorAll('.flame');
        flames.forEach(f => f.classList.remove('extinguished'));
        const blowBtn = document.getElementById('blowCakeBtn');
        if (blowBtn) {
          blowBtn.disabled = false;
          blowBtn.textContent = (CONFIG.wishScene && CONFIG.wishScene.buttonText) || "Blow Out The Candles 🎂";
        }
        const successBox = document.getElementById('wishSuccessBox');
        if (successBox) successBox.classList.remove('visible');

        // Return background audio to original story song
        if (typeof AudioManager !== 'undefined' && AudioManager.switchSong && CONFIG.musicUrl) {
          AudioManager.switchSong(CONFIG.musicUrl, 1000);
        }

        // Smoothly return to Title Scene (Scene 1)
        const titleIdx = scenes.findIndex(s => s.id === 'scene-title');
        goToScene(titleIdx !== -1 ? titleIdx : 1);
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     GLOBAL CONTROLS & LISTENERS
     ───────────────────────────────────────────────────────────────────────── */
  function initNavigationControls() {
    if (prevBtn) prevBtn.addEventListener('click', swipeRight);
    if (nextBtn) nextBtn.addEventListener('click', swipeLeft);
    if (swipeHintPill) swipeHintPill.addEventListener('click', swipeLeft);

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Lightbox active modal navigation
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') swipeRight();
        if (e.key === 'ArrowRight') swipeLeft();
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentSceneIndex > 0) swipeLeft();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentSceneIndex > 1) swipeRight();
      }
    });

    // Touch swipe gestures
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Desktop mouse drag gestures
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Trackpad horizontal swipe
    window.addEventListener('wheel', handleWheel, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     APPLICATION BOOTSTRAP
     ───────────────────────────────────────────────────────────────────────── */
  function start() {
    // 1. Initialize Subsystems
    if (typeof Particles !== 'undefined') Particles.init();
    if (typeof AudioManager !== 'undefined') AudioManager.init();

    // 2. Initialize Scenes
    initInvitation();
    initTitleScene();
    initTimeCounter();
    initChildhood();
    initStory();
    initGallery();
    initReasons();
    initLetter();
    initRecap();
    initWishScene();
    initFinale();

    // 3. Navigation Controls
    initNavigationControls();
    updateProgressAndControls();
  }

  start();
});
