/* ══════════════════════════════════════════
   ABHIRAM — LVL 16  |  script.js
   ══════════════════════════════════════════ */

// ══════════════════════════════════════════
// SOUND ENGINE (Web Audio API — no files)
// ══════════════════════════════════════════
let audioCtx = null;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// Generic tone player
function playTone({ freq=440, type='square', gain=0.18, duration=0.08, attack=0.005, decay=0.05, detune=0 } = {}) {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.connect(env);
    env.connect(ctx.destination);
    osc.type    = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.detune.setValueAtTime(detune, ctx.currentTime);
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(gain, ctx.currentTime + attack);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + decay);
  } catch(e) {}
}

// Specific sound effects
const SFX = {
  // Typewriter key click
  type: () => playTone({ freq: 800 + Math.random()*400, type:'square', gain:0.06, duration:0.04, attack:0.001 }),

  // Boot line confirmed
  bootOk: () => {
    playTone({ freq:523, type:'square', gain:0.12, duration:0.06 });
    setTimeout(() => playTone({ freq:659, type:'square', gain:0.12, duration:0.08 }), 60);
  },

  // Boot warning
  bootWarn: () => {
    playTone({ freq:220, type:'sawtooth', gain:0.15, duration:0.12 });
    setTimeout(() => playTone({ freq:180, type:'sawtooth', gain:0.15, duration:0.18 }), 100);
  },

  // Loading bar tick
  tick: () => playTone({ freq:1200, type:'square', gain:0.04, duration:0.03 }),

  // XP bar fill (rising sweep)
  xpTick: () => playTone({ freq: 300 + Math.random()*200, type:'sine', gain:0.07, duration:0.05 }),

  // Level up fanfare
  levelUp: () => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => setTimeout(() => playTone({ freq:f, type:'square', gain:0.18, duration:0.18, attack:0.01 }), i * 100));
    setTimeout(() => playTone({ freq:1047, type:'square', gain:0.22, duration:0.4, attack:0.01 }), 450);
  },

  // Screen transition whoosh
  whoosh: () => {
    try {
      const ctx = getAudio();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ctx.createBufferSource();
      const filt = ctx.createBiquadFilter();
      const env  = ctx.createGain();
      filt.type = 'bandpass';
      filt.frequency.setValueAtTime(800, ctx.currentTime);
      filt.frequency.linearRampToValueAtTime(3200, ctx.currentTime + 0.12);
      filt.Q.value = 0.8;
      env.gain.setValueAtTime(0.3, ctx.currentTime);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      src.buffer = buf;
      src.connect(filt);
      filt.connect(env);
      env.connect(ctx.destination);
      src.start();
    } catch(e) {}
  },

  // Achievement unlock
  achieve: () => {
    const notes = [784, 988, 1175];
    notes.forEach((f, i) => setTimeout(() => playTone({ freq:f, type:'sine', gain:0.16, duration:0.14, attack:0.01 }), i * 80));
  },

  // Button click
  click: () => playTone({ freq:660, type:'square', gain:0.1, duration:0.05, attack:0.001 }),

  // Firework pop
  pop: () => {
    try {
      const ctx = getAudio();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
      const src  = ctx.createBufferSource();
      const env  = ctx.createGain();
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = 1800;
      env.gain.setValueAtTime(0.4, ctx.currentTime);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      src.buffer = buf;
      src.connect(filt); filt.connect(env); env.connect(ctx.destination);
      src.start();
    } catch(e) {}
  },

  // Final birthday jingle
  jingle: () => {
    const melody = [523,523,587,523,698,659, 0, 523,523,587,523,784,698];
    const timings = [0,250,500,750,1000,1250, 0, 1750,2000,2250,2500,2750,3000];
    melody.forEach((f, i) => {
      if (f === 0) return;
      setTimeout(() => playTone({ freq:f, type:'triangle', gain:0.2, duration:0.22, attack:0.01 }), timings[i]);
    });
  },
};

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
    if (name !== 'boot') SFX.whoosh();
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
    SFX.type();
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
        typeBootLine(el, text, () => {
          if (cls === 'ok') SFX.bootOk();
          if (cls === 'err') SFX.bootWarn();
          setTimeout(res, 120);
        });
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
        SFX.tick();
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
    if (Math.random() < 0.3) SFX.xpTick();
    if (cur >= target) {
      clearInterval(iv);
      setTimeout(() => SFX.levelUp(), 200);
    }
  }, 25);
}

document.getElementById('continueBtn').addEventListener('click', () => {
  SFX.click();
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
  SFX.click();
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
    if (LORE_TEXT[i-1] !== ' ' && LORE_TEXT[i-1] !== '\n') SFX.type();
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
  SFX.click();
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
    if (a.unlocked) setTimeout(() => SFX.achieve(), i * 70 + 100);
    grid.appendChild(card);
  });
}

document.getElementById('achNextBtn').addEventListener('click', () => {
  SFX.click();
  goTo('finale');
  startFireworks();
  setTimeout(() => SFX.jingle(), 400);
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
    SFX.pop();
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
  SFX.click();
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

// ── MUTE TOGGLE ───────────────────────────────────────────────
let muted = false;
const _playTone = playTone;
const muteBtn = document.getElementById('muteBtn');
muteBtn.addEventListener('click', () => {
  muted = !muted;
  muteBtn.textContent = muted ? '🔇' : '🔊';
  if (audioCtx) muted ? audioCtx.suspend() : audioCtx.resume();
});

// Wrap SFX calls to respect mute
Object.keys(SFX).forEach(k => {
  const orig = SFX[k];
  SFX[k] = (...args) => { if (!muted) orig(...args); };
});

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  goTo('boot');
  runBoot();
});
