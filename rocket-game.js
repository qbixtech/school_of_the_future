(function () {
  'use strict';

  const canvas = document.getElementById('rocket-game');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scoreEl = document.getElementById('game-score');
  const bestEl = document.getElementById('game-best');
  const statusEl = document.getElementById('game-status');
  const overlay = document.getElementById('game-overlay');
  const overlayKicker = document.getElementById('game-overlay-kicker');
  const overlayTitle = document.getElementById('game-overlay-title');
  const overlayText = document.getElementById('game-overlay-text');
  const actionBtn = document.getElementById('game-action');
  const stage = document.querySelector('.game-stage');

  const GRID = 20;
  const SIZE = 440;
  const CELL = SIZE / GRID;
  const TARGET_CELL = 30;
  const MIN_CELLS = 8;
  const START_INTERVAL = 155;
  const MIN_INTERVAL = 85;
  const BEST_KEY = 'sotf-rocket-best';
  const C = {
    blue: '#25b7e3',
    blueDeep: '#086b99',
    lime: '#b8e51b',
    paper: '#f6f9fc',
    ink: '#0b2038',
    space: '#04121f'
  };

  const KEY_DIRS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0]
  };
  const PAD_DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  let scale = 1;
  let viewW = SIZE;
  let viewH = SIZE;
  let cols = GRID;
  let rows = GRID;
  let cellW = CELL;
  let cellH = CELL;
  let snake = [];
  let prevSnake = [];
  let dir = { x: 1, y: 0 };
  let queue = [];
  let star = null;
  let score = 0;
  let best = loadBest();
  let state = 'idle';
  let lastTick = 0;
  let interval = START_INTERVAL;
  let popups = [];
  let angle = Math.PI / 2;
  let inView = true;

  const bgStars = [];
  for (let i = 0; i < 72; i += 1) {
    bgStars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() < 0.3 ? 2 : 1,
      p: Math.random() * Math.PI * 2,
      c: ['#e9fbff', '#25b7e3', '#b8e51b'][i % 3]
    });
  }

  function loadBest() {
    try {
      return Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch (error) {
      return 0;
    }
  }

  function saveBest(value) {
    try {
      localStorage.setItem(BEST_KEY, String(value));
    } catch (error) {
      /* localStorage может быть недоступен */
    }
  }

  function plural(n, forms) {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
    return forms[2];
  }

  function starWord(n) {
    return plural(n, ['звезда', 'звезды', 'звёзд']);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = Math.max(1, Math.round(rect.width * dpr));
    const py = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== px || canvas.height !== py) {
      canvas.width = px;
      canvas.height = py;
    }
    scale = dpr;
    viewW = rect.width;
    viewH = rect.height;
    cols = Math.max(MIN_CELLS, Math.round(rect.width / TARGET_CELL));
    rows = Math.max(MIN_CELLS, Math.round(rect.height / TARGET_CELL));
    cellW = rect.width / cols;
    cellH = rect.height / rows;
    snake.forEach((s) => {
      s.x = Math.min(s.x, cols - 1);
      s.y = Math.min(s.y, rows - 1);
    });
    prevSnake.forEach((s) => {
      s.x = Math.min(s.x, cols - 1);
      s.y = Math.min(s.y, rows - 1);
    });
    if (star && (star.x >= cols || star.y >= rows)) spawnStar();
  }

  function spawnStar() {
    const free = [];
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
      }
    }
    star = free.length ? free[Math.floor(Math.random() * free.length)] : null;
  }

  function reset() {
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);
    snake = [
      { x: cx, y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy }
    ];
    prevSnake = snake.map((s) => ({ x: s.x, y: s.y }));
    dir = { x: 1, y: 0 };
    queue = [];
    score = 0;
    interval = START_INTERVAL;
    popups = [];
    angle = Math.PI / 2;
    spawnStar();
    updateHud();
  }

  function showOverlay(kicker, title, text, button) {
    overlayKicker.textContent = kicker;
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    actionBtn.textContent = button;
    overlay.hidden = false;
  }

  function hideOverlay() {
    overlay.hidden = true;
  }

  function updateHud() {
    if (scoreEl) scoreEl.textContent = String(score);
    if (bestEl) bestEl.textContent = String(best);
    if (!statusEl) return;
    statusEl.textContent =
      state === 'running' ? 'Полёт выполняется' :
      state === 'paused' ? 'Пауза' :
      state === 'over' ? 'Миссия завершена' : 'Готово к старту';
  }

  function start() {
    reset();
    state = 'running';
    lastTick = performance.now();
    hideOverlay();
    updateHud();
  }

  function pause() {
    if (state !== 'running') return;
    state = 'paused';
    showOverlay('Пауза на орбите', 'Полёт приостановлен', 'Ракета ждёт на орбите — продолжайте сбор звёзд, когда будете готовы.', 'Продолжить');
    updateHud();
  }

  function resume() {
    if (state !== 'paused') return;
    state = 'running';
    lastTick = performance.now();
    hideOverlay();
    updateHud();
  }

  function gameOver() {
    state = 'over';
    updateHud();
    showOverlay(
      'Миссия завершена',
      `Собрано ${score} ${starWord(score)}`,
      `Рекорд класса — ${best}. Пролетите чуть дальше в следующий раз.`,
      'Играть снова'
    );
  }

  function toggleAction() {
    if (state === 'running') pause();
    else if (state === 'paused') resume();
    else start();
  }

  function setDirection(dx, dy) {
    if (state === 'idle' || state === 'over') start();
    if (state !== 'running') return;
    const last = queue.length ? queue[queue.length - 1] : dir;
    if (dx === last.x && dy === last.y) return;
    if (dx === -last.x && dy === -last.y) return;
    if (queue.length < 2) queue.push({ x: dx, y: dy });
  }

  function tick(t) {
    if (queue.length) {
      const next = queue.shift();
      if (!(next.x === -dir.x && next.y === -dir.y)) dir = next;
    }
    prevSnake = snake.map((s) => ({ x: s.x, y: s.y }));
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) {
      gameOver();
      return;
    }

    const eating = star && head.x === star.x && head.y === star.y;
    const body = eating ? snake : snake.slice(0, -1);
    if (body.some((s) => s.x === head.x && s.y === head.y)) {
      gameOver();
      return;
    }

    snake.unshift(head);
    if (eating) {
      score += 1;
      if (score > best) {
        best = score;
        saveBest(best);
      }
      popups.push({ x: star.x, y: star.y, t: performance.now() });
      interval = Math.max(MIN_INTERVAL, interval - 4);
      spawnStar();
      updateHud();
    } else {
      snake.pop();
    }
    lastTick = t;
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function starPath(cx, cy, outer, rot) {
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const r = i % 2 === 0 ? outer : outer * 0.45;
      const a = rot + (Math.PI / 5) * i - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function drawStar(now) {
    if (!star) return;
    const pulse = 1 + Math.sin(now / 320) * 0.08;
    const cx = (star.x + 0.5) * cellW;
    const cy = (star.y + 0.5) * cellH;
    const cell = (cellW + cellH) / 2;
    ctx.save();
    ctx.shadowColor = C.lime;
    ctx.shadowBlur = 16;
    ctx.fillStyle = C.lime;
    starPath(cx, cy, cell * 0.42 * pulse, now / 900);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    starPath(cx, cy, cell * 0.15 * pulse, now / 900);
    ctx.fill();
    ctx.restore();
  }

  function strokePath(pts) {
    ctx.beginPath();
    ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    for (let i = pts.length - 2; i >= 0; i -= 1) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  function drawTrail(p) {
    if (!snake.length) return;
    const pts = [];
    for (let i = 0; i < snake.length; i += 1) {
      const to = snake[i];
      const from = prevSnake[i] || to;
      const x = from.x + (to.x - from.x) * p;
      const y = from.y + (to.y - from.y) * p;
      pts.push({ x: (x + 0.5) * cellW, y: (y + 0.5) * cellH });
    }
    const tail = pts[pts.length - 1];
    const head = pts[0];
    const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
    grad.addColorStop(0, 'rgba(184,229,27,.35)');
    grad.addColorStop(0.45, 'rgba(37,183,227,.75)');
    grad.addColorStop(1, 'rgba(246,249,252,.95)');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(37,183,227,.16)';
    ctx.lineWidth = Math.min(cellW, cellH) * 0.95;
    strokePath(pts);
    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.min(cellW, cellH) * 0.5;
    strokePath(pts);
  }

  function drawRocket(x, y, rot, now) {
    const w = Math.min(cellW, cellH) * 0.66;
    const h = Math.min(cellW, cellH) * 0.92;
    const flick = 0.8 + Math.sin(now / 55) * 0.18 + Math.random() * 0.1;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    ctx.fillStyle = C.lime;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(-w * 0.2, h * 0.3);
    ctx.lineTo(0, h * 0.3 + h * 0.5 * flick);
    ctx.lineTo(w * 0.2, h * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(-w * 0.1, h * 0.3);
    ctx.lineTo(0, h * 0.3 + h * 0.28 * flick);
    ctx.lineTo(w * 0.1, h * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = C.blue;
    ctx.beginPath();
    ctx.moveTo(-w * 0.3, h * 0.02);
    ctx.lineTo(-w * 0.62, h * 0.42);
    ctx.lineTo(-w * 0.3, h * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.02);
    ctx.lineTo(w * 0.62, h * 0.42);
    ctx.lineTo(w * 0.3, h * 0.34);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = C.paper;
    roundRect(-w * 0.3, -h * 0.38, w * 0.6, h * 0.78, w * 0.22);
    ctx.fill();

    ctx.fillStyle = C.lime;
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.62);
    ctx.lineTo(-w * 0.3, -h * 0.06);
    ctx.lineTo(w * 0.3, -h * 0.06);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = C.blueDeep;
    ctx.beginPath();
    ctx.arc(0, -h * 0.1, w * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = C.blue;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.restore();
  }

  function drawPopups(now) {
    popups = popups.filter((p) => now - p.t < 750);
    if (!popups.length) return;
    ctx.save();
    ctx.font = "700 15px 'Space Grotesk', sans-serif";
    ctx.textAlign = 'center';
    popups.forEach((p) => {
      const age = (now - p.t) / 750;
      ctx.globalAlpha = 1 - age;
      ctx.fillStyle = C.lime;
      ctx.fillText('+1', (p.x + 0.5) * cellW, (p.y + 0.5) * cellH - age * Math.min(cellW, cellH) * 1.1);
    });
    ctx.restore();
  }

  function approachAngle(current, target, step) {
    let diff = (target - current) % (Math.PI * 2);
    if (diff > Math.PI) diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (Math.abs(diff) <= step) return target;
    return current + Math.sign(diff) * step;
  }

  function draw(now) {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.fillStyle = C.space;
    ctx.fillRect(0, 0, viewW, viewH);

    bgStars.forEach((s) => {
      ctx.globalAlpha = 0.22 + 0.55 * Math.abs(Math.sin(now / 900 + s.p));
      ctx.fillStyle = s.c;
      ctx.fillRect(s.x * viewW, s.y * viewH, s.r, s.r);
    });
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgba(37,183,227,.07)';
    ctx.lineWidth = 1;
    for (let i = 1; i < cols; i += 1) {
      const pos = i * cellW;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, viewH);
      ctx.stroke();
    }
    for (let i = 1; i < rows; i += 1) {
      const pos = i * cellH;
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(viewW, pos);
      ctx.stroke();
    }

    const p = state === 'running' ? Math.min(1, (now - lastTick) / interval) : 1;
    drawStar(now);
    drawTrail(p);

    const to = snake[0];
    const from = prevSnake[0] || to;
    const hx = (from.x + (to.x - from.x) * p + 0.5) * cellW;
    const hy = (from.y + (to.y - from.y) * p + 0.5) * cellH;
    const targetAngle = Math.atan2(dir.y, dir.x) + Math.PI / 2;
    angle = approachAngle(angle, targetAngle, 0.3);
    drawRocket(hx, hy, angle, now);
    drawPopups(now);
  }

  function frame(now) {
    if (state === 'running') {
      let steps = 0;
      while (now - lastTick >= interval && steps < 4 && state === 'running') {
        tick(lastTick + interval);
        steps += 1;
      }
      if (state === 'running' && now - lastTick >= interval) lastTick = now;
    }
    draw(now);
    requestAnimationFrame(frame);
  }

  function onKey(event) {
    if (!inView) return;
    const hit = KEY_DIRS[event.code];
    if (hit) {
      event.preventDefault();
      setDirection(hit[0], hit[1]);
      return;
    }
    if (event.target && event.target.closest && event.target.closest('button')) return;
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      toggleAction();
    } else if (event.code === 'KeyP') {
      toggleAction();
    }
  }

  let touchStart = null;
  if (stage) {
    stage.addEventListener('touchstart', (event) => {
      const t = event.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    }, { passive: true });
    stage.addEventListener('touchmove', (event) => {
      if (!touchStart) return;
      const t = event.touches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      if (Math.abs(dx) > 24 || Math.abs(dy) > 24) {
        if (Math.abs(dx) > Math.abs(dy)) setDirection(Math.sign(dx), 0);
        else setDirection(0, Math.sign(dy));
        touchStart = { x: t.clientX, y: t.clientY };
      }
      event.preventDefault();
    }, { passive: false });
    stage.addEventListener('touchend', () => {
      touchStart = null;
    }, { passive: true });
  }

  if (actionBtn) actionBtn.addEventListener('click', toggleAction);

  document.querySelectorAll('.game-pad button[data-dir]').forEach((button) => {
    button.addEventListener('click', () => {
      const hit = PAD_DIRS[button.dataset.dir];
      if (hit) setDirection(hit[0], hit[1]);
    });
  });

  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', resize);
  window.addEventListener('blur', () => {
    if (state === 'running') pause();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'running') pause();
  });

  if ('IntersectionObserver' in window && stage) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
    }, { threshold: 0.25 }).observe(stage);
  }

  function init() {
    resize();
    reset();
    state = 'idle';
    updateHud();
    showOverlay(
      'Сбор звёзд',
      'Полёт начинается',
      'Стрелки или WASD, на телефоне — свайп или кнопки под полем. Собирайте звёзды и не задевайте стены.',
      'Начать миссию'
    );
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
