/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    PARTICLES.JS — AMBIENT PETALS & CONFETTI
 * ═══════════════════════════════════════════════════════════════════════════
 * Lightweight, high-performance canvas engine.
 * - Ambient drifting rose petals across every scene
 * - Celebratory confetti & sparkle explosion on candle blowout
 */

const Particles = (() => {
  // Canvases & contexts
  let petalCanvas = null;
  let petalCtx = null;
  let confettiCanvas = null;
  let confettiCtx = null;

  let width = window.innerWidth;
  let height = window.innerHeight;

  // Particle pools
  let petals = [];
  let confetti = [];
  let animFrameId = null;
  let isRunning = false;

  // Petal color palette (wine/rose/soft blush)
  const petalColors = [
    'rgba(232, 96, 127, 0.65)',
    'rgba(255, 142, 167, 0.6)',
    'rgba(242, 120, 150, 0.55)',
    'rgba(255, 180, 196, 0.5)',
    'rgba(230, 185, 128, 0.45)' // subtle golden petal
  ];

  // Confetti celebration palette
  const confettiColors = [
    '#e8607f', '#ffd79a', '#e6b980', '#ff8ea7', '#ffffff', '#ff4d6d', '#ffd166'
  ];

  class Petal {
    constructor(initial = false) {
      this.reset(initial);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20 - Math.random() * 50;
      this.size = 9 + Math.random() * 11;
      this.speedY = 0.5 + Math.random() * 1.1;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = 0.01 + Math.random() * 0.025;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.015 + Math.random() * 0.02;
      this.swayDist = 0.6 + Math.random() * 1.2;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    }

    update() {
      this.swayAngle += this.swaySpeed;
      this.x += Math.sin(this.swayAngle) * this.swayDist + this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      this.flip += this.flipSpeed;

      // Wrap around edges
      if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
        this.reset(false);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.flip), 1);

      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Draw organic curved rose petal
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.8, this.size * 0.9, this.size * 0.3, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.3, -this.size * 0.7, -this.size * 0.8, 0, -this.size);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  class ConfettiPiece {
    constructor(originX, originY) {
      this.x = originX;
      this.y = originY;
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 11;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (3 + Math.random() * 4); // upward bias
      this.gravity = 0.22;
      this.friction = 0.96;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.size = 5 + Math.random() * 8;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.2;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = 0.08 + Math.random() * 0.12;
      this.opacity = 1;
      this.fade = 0.006 + Math.random() * 0.008;
      this.shape = Math.random() > 0.35 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'heart');
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.flip += this.flipSpeed;
      this.opacity -= this.fade;
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.flip), 1);
      ctx.fillStyle = this.color;

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.6);
      } else if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Little heart
        const s = this.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.4);
        ctx.bezierCurveTo(s * 0.5, -s * 0.5, s * 1.2, s * 0.2, 0, s * 1.2);
        ctx.bezierCurveTo(-s * 1.2, s * 0.2, -s * 0.5, -s * 0.5, 0, s * 0.4);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (petalCanvas) {
      petalCanvas.width = width;
      petalCanvas.height = height;
    }
    if (confettiCanvas) {
      confettiCanvas.width = width;
      confettiCanvas.height = height;
    }
  }

  function loop() {
    if (!isRunning) return;

    // Render drifting petals
    if (petalCtx) {
      petalCtx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw(petalCtx);
      }
    }

    // Render confetti burst if active
    if (confettiCtx) {
      confettiCtx.clearRect(0, 0, width, height);
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.update();
        c.draw(confettiCtx);
        if (c.opacity <= 0 || c.y > height + 50) {
          confetti.splice(i, 1);
        }
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  function init() {
    petalCanvas = document.getElementById('particleCanvas');
    confettiCanvas = document.getElementById('confettiCanvas');
    if (!petalCanvas || !confettiCanvas) return;

    petalCtx = petalCanvas.getContext('2d');
    confettiCtx = confettiCanvas.getContext('2d');

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Check user reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = prefersReducedMotion 
      ? 6 
      : ((typeof CONFIG !== 'undefined' && CONFIG.effects && CONFIG.effects.petalCount) || 22);

    petals = [];
    for (let i = 0; i < count; i++) {
      petals.push(new Petal(true));
    }

    isRunning = true;
    loop();

    // Pause on background tabs to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
        isRunning = false;
      } else {
        isRunning = true;
        loop();
      }
    });
  }

  function burstConfetti(originX, originY) {
    const ox = originX !== undefined ? originX : width / 2;
    const oy = originY !== undefined ? originY : height * 0.45;
    const count = (typeof CONFIG !== 'undefined' && CONFIG.effects && CONFIG.effects.confettiBurstCount) || 160;

    for (let i = 0; i < count; i++) {
      confetti.push(new ConfettiPiece(ox, oy));
    }
  }

  return {
    init,
    burstConfetti
  };
})();
