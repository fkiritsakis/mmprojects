document.addEventListener('DOMContentLoaded', () => {

  // Countdown Elements
  const monthsEl = document.getElementById('months');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // Interactive Stage Elements
  const cardWrapper = document.getElementById('card-wrapper');
  const heartSeal = document.getElementById('heart-seal');
  const envFlap = document.getElementById('env-flap');
  const cardPreview = document.getElementById('card-preview');
  
  const interactiveZone = document.getElementById('interactive-zone');
  const lockMsg = document.getElementById('lock-msg');
  const openBtn = document.getElementById('open-btn');
  const revealedCard = document.getElementById('revealed-card');

  // Start initial sway
  cardWrapper.classList.add('idle-sway');

  function updateCountdown() {
    const now = new Date();
    const target = new Date(`July 24, ${now.getFullYear()} 00:00:00`);
    const distance = target.getTime() - now.getTime();

    if (distance <= 0) {
      monthsEl.textContent = '00';
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';

      lockMsg.classList.add('hidden');
      openBtn.classList.remove('hidden');
      return true;
    }

    let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    const tempDate = new Date(now);
    tempDate.setMonth(tempDate.getMonth() + months);
    if (tempDate > target) {
      months--;
      tempDate.setMonth(tempDate.getMonth() - 1);
    }

    const diffTime = target - tempDate;
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    monthsEl.textContent = String(Math.max(0, months)).padStart(2, '0');
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    return false;
  }

  const isUnlocked = updateCountdown();
  if (!isUnlocked) {
    const timer = setInterval(() => {
      if (updateCountdown()) {
        clearInterval(timer);
      }
    }, 1000);
  }

  // Choreographed Opening Sequence
  openBtn.addEventListener('click', () => {
    openBtn.style.pointerEvents = 'none';
    openBtn.style.opacity = '0.5';

    // Step 1: Freeze gentle sway & pop heart seal
    cardWrapper.classList.remove('idle-sway');
    heartSeal.classList.add('heart-pop');

    // Step 2: Unfold top flap after seal vanishes (300ms)
    setTimeout(() => {
      envFlap.classList.add('flap-open');
    }, 300);

    // Step 3: Slide preview card out of envelope (700ms)
    setTimeout(() => {
      cardPreview.classList.add('card-slide-out');
    }, 700);

    // Step 4: Swap envelope zone for the full vertical unfolded card (1400ms)
    setTimeout(() => {
      interactiveZone.classList.add('hidden');
      revealedCard.classList.remove('hidden');

      // Trigger Fireworks & Confetti
      triggerCelebration();
    }, 1400);
  });

  function triggerCelebration() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
      }, 250);
    }

    startFireworks();
  }

  function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#f43f5e', '#38bdf8', '#facc15', '#a855f7', '#34d399'];

    function createFirework(x, y) {
      const count = 40;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        const speed = Math.random() * 4.5 + 2;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    createFirework(canvas.width * 0.25, canvas.height * 0.35);
    setTimeout(() => createFirework(canvas.width * 0.75, canvas.height * 0.3), 200);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= 0.016;

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        if (p.alpha <= 0) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  }
});