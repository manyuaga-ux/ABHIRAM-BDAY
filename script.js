/* ══════════════════════════════════════════
   ABHIRAM — LVL 16  |  script.js
   ══════════════════════════════════════════ */

// ── BIRTHDAY (change to actual date if known) ──────────────────
const BDAY = new Date('2009-06-10T00:00:00');

// ── SCREEN MANAGER ────────────────────────────────────────────
const screens = ['boot','levelup','stats','lore','achievements','finale'];
let currentScreen = 0;

function goTo(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) {
    el.classList.add('active');
    currentScreen = screens.indexOf(name);
  }
}

// ══════════════════════════════════════════
// 1. BOOT SEQUENCE
// ══════════════════════════════════════════
const BOOT_LINES = [
  { id:'bl1', text:'SYSTEM INIT... BIRTHDAY_OS v16.0.0', cls:'ok', delay:200 },
  { id:'bl2', text:'LOADING PLAYER DATA... [ABHIRAM.DAT]', cls:'ok', delay:800 },
  { id:'bl3', text:'SCANNING MEMORY BANKS... 5840 DAYS FOUND', cls:'ok', delay:1600 },
  { id:'bl4', text:'VERIFYING LEGEND STATUS... CONFIRMED', cls:'ok', delay:2400 },
  { id:'bl5', text:'WARNING: MAXIMUM COOLNESS THRESHOLD EXCEEDED', cls:'err', delay:3200 },
];

function typeBootLine(el, text, cb) {
  let i = 0;
  const iv = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) { clearInterval(iv); if(cb) cb(); }
  }, 28);
}

function runBoot() {
  let chain = Promise.resolve();
  BOOT_LINES.forEach(({ id, text, cls, delay }) => {
    chain = chain.then(() => new Promise(res => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (cls) el.classList.add(cls);
        typeBootLine(el, text, res);
      }, delay);
    }));
  });

  chain.then(() => {
    setTimeout(() => {
      const barWrap = document.getElementById('boot-bar-wrap');
      barWrap.style.display = 'block';
      const bar = document.getElementById('bootBar');
      let pct = 0;
      const iv = setInterval(() => {
        pct += Math.random() * 4 + 1;
        if (pct >= 100) { pct = 100; clearInterval(iv); setTimeout(() => startLevelUp(), 600); }
        bar.style.width = pct + '%';
      }, 60);
    }, 400);
  });
}

// ══════════════════════════════════════════
// 2. LEVEL UP SCREEN
// ══════════════════════════════════════════
const XP_MAX = 5840; // days alive approx

function startLevelUp() {
  goTo('levelup');
  const bar  = document.getElementById('xpBar');
  const xpV  = document.getElementById('xpVal');

  // Calculate real days
  const daysAlive = Math.floor((new Date() - BDAY) / 86400000);
  const target = Math.min(daysAlive, XP_MAX);

  let cur = 0;
  const step = target / 120;
  const iv = setInterval(() => {
    cur = Math.min(cur + step, target);
    const pct = (cur / XP_MAX) * 100;
    bar.style.width = pct + '%';
    xpV.textContent = Math.floor(cur).toLocaleString() + ' / ' + XP_MAX.toLocaleString();
    if (cur >= target) clearInterval(iv);
  }, 25);
}

document.getElementById('continueBtn').addEventListener('click', () => {
  goTo('stats');
  loadStats();
});

// ══════════════════════════════════════════
// 3. STATS SCREEN
// ══════════════════════════════════════════
function loadStats() {
  const now = new Date();
  const days  = Math.floor((now - BDAY) / 86400000);
  const hours = Math.floor((now - BDAY) / 3600000);

  animCount(document.getElementById('s-days'),  days,  1600);
  animCount(document.getElementById('s-hours'), hours, 1800);

  // Animate stat bars
  setTimeout(() => {
    document.querySelectorAll('.stat-bar-inner').forEach(b => {
      b.style.width = b.style.getPropertyValue('--w') || '80%';
    });
  }, 200);
}

function animCount(el, target, duration) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(easeOut(p) * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

document.getElementById('statsNextBtn').addEventListener('click', () => {
  goTo('lore');
  startLore();
});

// ══════════════════════════════════════════
// 4. LORE / MESSAGE SCREEN
// ══════════════════════════════════════════
const LORE_TEXT =
`Sixteen years ago, something irreversible happened.

You showed up.

And the world, without knowing it, started running a different version of itself — one with you in it. A louder version. A smarter one. One that asks harder questions and refuses to settle for the obvious answer.

Sixteen isn't a milestone you reach. It's one you earn. Every late night, every thing you pushed through, every time you bet on yourself when nobody else was watching — that's the XP that got you here.

The level isn't the destination. It never was.

It's just proof you survived everything before it.

Happy Birthday, Abhiram.
Now go break something worth breaking.`;

let loreTyping = false;

function startLore() {
  const el = document.getElementById('loreText');
  const btn = document.getElementById('loreNextBtn');
  el.textContent = '';
  loreTyping = true;

  let i = 0;
  const iv = setInterval(() => {
    el.textContent = LORE_TEXT.slice(0, ++i);
    if (i >= LORE_TEXT.length) {
      clearInterval(iv);
      loreTyping = false;
      document.getElementById('loreCursor').style.display = 'none';
      btn.style.display = 'inline-block';
    }
  }, 22);

  // Click to skip
  document.getElementById('lore-skip-hint');
  el.addEventListener('click', () => {
    if (loreTyping) {
      clearInterval(iv);
      el.textContent = LORE_TEXT;
      loreTyping = false;
      document.getElementById('loreCursor').style.display = 'none';
      btn.style.display = 'inline-block';
    }
  }, { once: true });
}

document.getElementById('loreNextBtn').addEventListener('click', () => {
  goTo('achievements');
  loadAchievements();
});

// ══════════════════════════════════════════
// 5. ACHIEVEMENTS SCREEN
// ══════════════════════════════════════════
const ACHIEVEMENTS = [
  { icon:'🌍', title:'BORN', desc:'Successfully entered the world. First attempt.',         unlocked:true  },
  { icon:'🔤', title:'FIRST WORDS', desc:'Achieved basic verbal communication protocol.',   unlocked:true  },
  { icon:'📚', title:'SCHOLAR', desc:'Survived 10+ years of academic levelling.',          unlocked:true  },
  { icon:'🧩', title:'PROBLEM SOLVER', desc:'Found shortcuts nobody thought to try.',       unlocked:true  },
  { icon:'🎯', title:'FOCUSED', desc:'Locked in when it actually mattered.',                unlocked:true  },
  { icon:'🤝', title:'ALLY', desc:'Someone people can actually count on.',                  unlocked:true  },
  { icon:'⚡', title:'QUICK THINKER', desc:'Replied before the question finished loading.', unlocked:true  },
  { icon:'🏆', title:'LEGENDARY', desc:'Reached Level 16 without a walkthrough.',           unlocked:true  },
  { icon:'🚀', title:'WHAT\'S NEXT', desc:'Unlock after Level 16. Something huge.',        unlocked:false },
  { icon:'👑', title:'UNDISPUTED', desc:'Reserved. You\'ll know when you earn it.',        unlocked:false },
];

function loadAchievements() {
  const grid = document.getElementById('achGrid');
  grid.innerHTML = '';
  ACHIEVEMENTS.forEach((a, i) => {
    const card = document.createElement('div');
    card.className = 'ach-card' + (a.unlocked ? '' : ' locked');
    card.style.animationDelay = (i * 0.07) + 's';
    card.innerHTML = `
      <div class="ach-icon">${a.icon}</div>
      <div class="ach-info">
        <div class="ach-title">${a.unlocked ? '✓ ' : '🔒 '}${a.title}</div>
        <div class="ach-desc">${a.desc}</div>
      </div>`;
    grid.appendChild(card);
  });
}

document.getElementById('achNextBtn').addEventListener('click', () => {
  goTo('finale');
  startFireworks();
});

// ══════════════════════════════════════════
// 6. FIREWORKS (FINALE)
// ══════════════════════════════════════════
let fwCanvas, fwCtx, fwParticles = [], fwRaf;

function startFireworks() {
  fwCanvas = document.getElementById('fireworkCanvas');
  fwCtx    = fwCanvas.getContext('2d');

  function resize() {
    fwCanvas.width  = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  fwParticles = [];
  let launchCount = 0;

  function launchBurst() {
    const cx = Math.random() * fwCanvas.width;
    const cy = Math.random() * fwCanvas.height * 0.6 + 40;
    const colors = ['#00ff88','#ffb300','#00e5ff','#ff004c','#ffffff','#c8e6c8'];
    const col = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 70; i++) {
      const angle = (Math.PI * 2 / 70) * i + Math.random() * 0.2;
      const speed = Math.random() * 5 + 2;
      fwParticles.push({
        x:cx, y:cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha:1, color:col,
        size: Math.random() * 2.5 + 1,
        decay: Math.random() * 0.015 + 0.012,
      });
    }
    launchCount++;
    if (launchCount < 18) setTimeout(launchBurst, 350 + Math.random() * 400);
  }

  setTimeout(launchBurst, 200);

  function drawFw() {
    fwCtx.fillStyle = 'rgba(5,6,8,0.18)';
    fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

    fwParticles = fwParticles.filter(p => p.alpha > 0.02);
    for (const p of fwParticles) {
      fwCtx.globalAlpha = p.alpha;
      fwCtx.fillStyle   = p.color;
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fwCtx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.vx *= 0.98;
      p.alpha -= p.decay;
    }
    fwCtx.globalAlpha = 1;
    fwRaf = requestAnimationFrame(drawFw);
  }
  drawFw();
}

// ══════════════════════════════════════════
// 7. REPLAY
// ══════════════════════════════════════════
document.getElementById('replayBtn').addEventListener('click', () => {
  if (fwRaf) cancelAnimationFrame(fwRaf);
  fwParticles = [];
  if (fwCtx) fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

  // Reset all typed text
  ['bl1','bl2','bl3','bl4','bl5'].forEach(id => {
    const el = document.getElementById(id);
    el.textContent = '';
    el.className = 'boot-line';
  });
  document.getElementById('boot-bar-wrap').style.display = 'none';
  document.getElementById('bootBar').style.width = '0%';
  document.getElementById('loreNextBtn').style.display = 'none';
  document.getElementById('loreCursor').style.display = 'block';

  goTo('boot');
  runBoot();
});

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  goTo('boot');
  runBoot();
});
