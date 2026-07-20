document.addEventListener('DOMContentLoaded', () => {
  const currentYear = new Date().getFullYear();
  const targetDate = new Date(`July 20, ${currentYear} 00:00:00`).getTime();

  // Elements
  const monthsEl = document.getElementById('months');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  const interactiveZone = document.getElementById('interactive-zone');
  const lockMsg = document.getElementById('lock-msg');
  const openBtn = document.getElementById('open-btn');
  const revealedCard = document.getElementById('revealed-card');

  // Multi-unit countdown calculations including months
  function updateCountdown() {
    const now = new Date();
    const target = new Date(`July 20, ${now.getFullYear()} 00:00:00`);

    const distance = target.getTime() - now.getTime();

    if (distance <= 0) {
      // Unlocked state on/after July 24th
      monthsEl.textContent = '00';
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';

      lockMsg.classList.add('hidden');
      openBtn.classList.remove('hidden');
      return true; // Target reached
    }

    // Calculating precise months breakdown
    let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    
    // Adjust if target day in current month hasn't been reached
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

  // Initial check & interval
  const isUnlocked = updateCountdown();
  if (!isUnlocked) {
    const timer = setInterval(() => {
      if (updateCountdown()) {
        clearInterval(timer);
      }
    }, 1000);
  }

  // Card Open Trigger & Celebration
  openBtn.addEventListener('click', () => {
    interactiveZone.classList.add('hidden');
    revealedCard.classList.remove('hidden');

    // Trigger Canvas Confetti Explosion
    if (typeof confetti === 'function') {
      // Burst 1: Center Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Burst 2: Left & Right Side Cannons
      setTimeout(() => {
        confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
      }, 250);
    }

    // Trigger Fireworks Canvas Animation
    startFireworks();
  });

  // Custom Fireworks Particle Engine
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
        const speed = Math.random() * 5 + 2;
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

    // Launch initial rockets
    createFirework(canvas.width * 0.3, canvas.height * 0.4);
    setTimeout(() => createFirework(canvas.width * 0.7, canvas.height * 0.3), 300);
    setTimeout(() => createFirework(canvas.width * 0.5, canvas.height * 0.25), 600);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.alpha -= 0.015;

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
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