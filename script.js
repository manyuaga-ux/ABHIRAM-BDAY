/* ============================================================
   script.js — Abhiram's 16th Birthday Website
   ============================================================ */

// ─── 1. PARTICLE CANVAS ────────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, dots = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function randomDot() {
  return {
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  Math.random() * 1.4 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    a:  Math.random() * 0.5 + 0.1,
  };
}

function initDots() {
  dots = Array.from({ length: 120 }, randomDot);
}

function drawDots() {
  ctx.clearRect(0, 0, W, H);
  for (const d of dots) {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${d.a})`;
    ctx.fill();

    d.x += d.vx;
    d.y += d.vy;
    if (d.x < 0 || d.x > W) d.vx *= -1;
    if (d.y < 0 || d.y > H) d.vy *= -1;
  }
  requestAnimationFrame(drawDots);
}

resizeCanvas();
initDots();
drawDots();
window.addEventListener('resize', () => { resizeCanvas(); initDots(); });


// ─── 2. DAYS & HOURS ALIVE COUNTER ─────────────────────────────
// Change this to Abhiram's actual birthdate if known
const BIRTHDAY = new Date('2009-06-10T00:00:00');

function updateCounters() {
  const now     = new Date();
  const diffMs  = now - BIRTHDAY;
  const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours   = Math.floor(diffMs / (1000 * 60 * 60));

  const dEl = document.getElementById('days-alive');
  const hEl = document.getElementById('hours-alive');

  animateCounter(dEl, days);
  animateCounter(hEl, hours);
}

function animateCounter(el, target) {
  let start = 0;
  const duration = 1800;
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Run after a brief delay so the page paints first
setTimeout(updateCounters, 400);


// ─── 3. 16 WISHES ──────────────────────────────────────────────
const WISHES = [
  "Always trust your own gut — it's smarter than the crowd.",
  "Chase the thing that makes time disappear.",
  "Be the kind of person people are glad they met.",
  "Stay curious. The moment you stop asking 'why', you stop growing.",
  "Learn to lose well. It's the real cheat code.",
  "Pick your circle carefully — energy is contagious.",
  "Money can wait. Skills can't. Build both.",
  "Disagree out loud when it matters. Silence is agreement.",
  "Protect your sleep, your focus, and your time — in that order.",
  "Read one book a month. You'll outthink 90% of the room.",
  "Travel somewhere that challenges you, not just comforts you.",
  "Tell the people you care about that you care — before it's too late.",
  "Fail faster. Every mistake is just paid tuition.",
  "Master one thing deeply. Generalists are common; experts are rare.",
  "Keep a journal. Your future self will thank you.",
  "Enjoy being 16. This exact version of you only exists once.",
];

const track = document.getElementById('wishTrack');

WISHES.forEach((text, i) => {
  const card = document.createElement('div');
  card.className = 'wish-card';
  card.style.animationDelay = `${i * 0.06}s`;
  card.innerHTML = `
    <span class="wish-num">${String(i + 1).padStart(2, '0')}</span>
    <span class="wish-text">${text}</span>
  `;
  track.appendChild(card);
});


// ─── 4. CONFETTI BLAST ─────────────────────────────────────────
const COLORS  = ['#f5a623', '#00d4ff', '#ff6b35', '#ffffff', '#a855f7', '#22c55e'];

function launchConfetti(count = 120) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const x        = Math.random() * 100;
    const size     = Math.random() * 10 + 6;
    const duration = Math.random() * 2 + 2;
    const delay    = Math.random() * 0.8;
    const color    = COLORS[Math.floor(Math.random() * COLORS.length)];
    const rotation = Math.random() * 360;

    piece.style.cssText = `
      left: ${x}vw;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      transform: rotate(${rotation}deg);
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;

    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

document.getElementById('blastBtn').addEventListener('click', () => {
  launchConfetti(160);
});

// Auto-launch a small burst on load
window.addEventListener('load', () => setTimeout(() => launchConfetti(60), 600));
