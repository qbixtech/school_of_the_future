(function () {
  'use strict';

  const canvas = document.getElementById('chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const stage = document.getElementById('chart-stage');
  const tabs = Array.prototype.slice.call(document.querySelectorAll('.coin-tab'));
  const tabPrices = Array.prototype.slice.call(document.querySelectorAll('[data-tab-price]'));
  const captionName = document.querySelector('[data-caption-name]');
  const captionChange = document.querySelector('[data-caption-change]');
  const priceEl = document.querySelector('.trade-price');
  const changeEl = document.querySelector('.trade-change');
  const holdEl = document.querySelector('[data-hold]');
  const holdTickerEl = document.querySelector('[data-hold-ticker]');
  const qtyInput = document.querySelector('[data-qty]');
  const buyBtn = document.querySelector('[data-buy]');
  const sellBtn = document.querySelector('[data-sell]');
  const balanceEl = document.getElementById('hud-balance');
  const capitalEl = document.getElementById('hud-capital');
  const bestEl = document.getElementById('hud-best');
  const statusEl = document.getElementById('game-status');
  const goalFill = document.getElementById('goal-fill');
  const pauseBtn = document.getElementById('btn-pause');
  const restartBtn = document.getElementById('btn-restart');
  const overlay = document.getElementById('game-overlay');
  const overlayKicker = document.getElementById('overlay-kicker');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayText = document.getElementById('overlay-text');
  const actionBtn = document.getElementById('game-action');

  const START_CASH = 1000;
  const GOAL = 5000;
  const RUIN = 20;
  const TICK_MS = 1100;
  const MAX_CANDLES = 40;
  const SEED_CANDLES = 26;
  const BEST_KEY = 'sotf-trade-best';
  const CANDLE_UP = '#22c58b';
  const CANDLE_DOWN = '#e8384f';

  /* Цены растут от самой дешёвой монеты к самой дорогой. */
  const COINS = [
    { name: 'Moon Coin', ticker: 'MOON', color: '#25b7e3', base: 12, vol: 0.045, lot: 10 },
    { name: 'Saturn Coin', ticker: 'SAT', color: '#b8e51b', base: 118, vol: 0.03, lot: 1 },
    { name: 'Solar System Coin', ticker: 'SOL', color: '#ff9b29', base: 1320, vol: 0.019, lot: 1 }
  ];

  const EVENTS = [
    {
      coin: 0,
      up: 'Лунная база закупила партию MOON — спрос растёт.',
      down: 'На рынок вылили лишние MOON — цена просела.'
    },
    {
      coin: 1,
      up: 'Открыли туры к кольцам Сатурна — SATURN в моде.',
      down: 'Буря в кольцах задержала поставки SATURN.'
    },
    {
      coin: 2,
      up: 'Запущена новая солнечная станция — SOLAR SYSTEM дорожает.',
      down: 'Затмение снизило выработку — SOLAR SYSTEM дешевеет.'
    }
  ];

  const state = {
    mode: 'idle',
    cash: START_CASH,
    holdings: [0, 0, 0],
    prices: COINS.map((coin) => coin.base),
    moods: [0, 0, 0],
    candles: COINS.map(() => []),
    qtys: COINS.map((coin) => coin.lot),
    eventIn: 16,
    active: 0,
    best: loadBest()
  };

  const intFmt = new Intl.NumberFormat('ru-RU');
  let timer = null;
  let canvasW = 0;
  let canvasH = 0;
  let dpr = 1;

  function loadBest() {
    try {
      return Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch (error) {
      return 0;
    }
  }

  function saveBest(value) {
    try {
      localStorage.setItem(BEST_KEY, String(Math.round(value)));
    } catch (error) {
      /* localStorage может быть недоступен */
    }
  }

  function money0(value) {
    return intFmt.format(Math.round(value)) + ' ₡';
  }

  function money2(value) {
    return value.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' ₡';
  }

  function shortPrice(value) {
    if (value >= 1000) return intFmt.format(Math.round(value));
    if (value >= 100) return String(Math.round(value));
    return value.toFixed(1).replace('.', ',');
  }

  function pct(value) {
    const abs = Math.abs(value).toFixed(1).replace('.', ',');
    return (value >= 0 ? '+' : '−') + abs + '%';
  }

  function round2(value) {
    return Math.round(value * 100) / 100;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function gauss() {
    return Math.random() + Math.random() + Math.random() - 1.5;
  }

  function capital() {
    return state.cash + state.prices.reduce((sum, price, i) => sum + price * state.holdings[i], 0);
  }

  function announce(text) {
    statusEl.textContent = text;
  }

  function readQty() {
    const value = Math.floor(Number(String(qtyInput.value).replace(',', '.')));
    if (!Number.isFinite(value) || value < 1) return 1;
    return Math.min(value, 99999);
  }

  function makeCandle(from, to) {
    const high = Math.max(from, to) * (1 + Math.random() * 0.004);
    const low = Math.min(from, to) * (1 - Math.random() * 0.004);
    return { o: from, c: to, h: high, l: low };
  }

  function nextPrice(i, price) {
    const coin = COINS[i];
    state.moods[i] = state.moods[i] * 0.86 + gauss() * 0.4;
    const move = gauss() * coin.vol + state.moods[i] * coin.vol * 0.9;
    let next = price * (1 + move);
    next += (coin.base - next) * 0.012;
    return clamp(next, coin.base * 0.2, coin.base * 9);
  }

  /* Первые свечи рисуем заранее, чтобы график не начинался с пустого поля. */
  function seedCandles() {
    state.candles = COINS.map(() => []);
    state.prices = COINS.map((coin) => coin.base);
    COINS.forEach((coin, i) => {
      let price = coin.base;
      const list = state.candles[i];
      for (let k = 0; k < SEED_CANDLES; k += 1) {
        const next = nextPrice(i, price);
        list.push(makeCandle(price, next));
        price = next;
      }
      state.prices[i] = price;
    });
  }

  function fireEvent() {
    const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    const up = Math.random() < 0.5;
    const i = event.coin;
    const jump = (0.035 + Math.random() * 0.05) * (up ? 1 : -1);
    state.prices[i] = clamp(state.prices[i] * (1 + jump), COINS[i].base * 0.2, COINS[i].base * 9);
    state.moods[i] = up ? 1.2 : -1.2;
    state.eventIn = 12 + Math.floor(Math.random() * 12);
    announce((up ? '↑ ' : '↓ ') + event[up ? 'up' : 'down']);
  }

  function updateUI() {
    const cap = capital();
    if (cap > state.best) {
      state.best = cap;
      saveBest(cap);
    }

    balanceEl.textContent = money0(state.cash);
    capitalEl.textContent = money0(cap);
    bestEl.textContent = state.best > 0 ? money0(state.best) : '—';
    goalFill.style.width = Math.min(100, (cap / GOAL) * 100).toFixed(1) + '%';

    COINS.forEach((coin, i) => {
      tabPrices[i].textContent = money2(state.prices[i]);
    });

    const coin = COINS[state.active];
    const price = state.prices[state.active];
    const change = ((price - coin.base) / coin.base) * 100;

    priceEl.textContent = money2(price);
    changeEl.textContent = pct(change);
    changeEl.classList.toggle('down', change < 0);
    holdEl.textContent = intFmt.format(state.holdings[state.active]);
    holdTickerEl.textContent = coin.ticker;

    captionChange.textContent = pct(change);
    captionChange.classList.toggle('down', change < 0);

    const qty = readQty();
    buyBtn.disabled = state.mode !== 'running' || price * qty > state.cash + 0.005;
    sellBtn.disabled = state.mode !== 'running' || qty > state.holdings[state.active];

    pauseBtn.hidden = !(state.mode === 'running' || state.mode === 'paused');
    pauseBtn.textContent = state.mode === 'paused' ? 'Дальше' : 'Пауза';
  }

  function selectCoin(i, options) {
    if (i === state.active) return;
    if (!options || options.keepQty !== true) state.qtys[state.active] = readQty();
    state.active = i;
    tabs.forEach((tab, index) => {
      const active = index === i;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    qtyInput.value = String(state.qtys[i]);
    captionName.textContent = COINS[i].name;
    updateUI();
    draw();
  }

  function showOverlay(kicker, title, text, label, handler) {
    overlayKicker.textContent = kicker;
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    actionBtn.textContent = label;
    actionBtn.onclick = handler;
    overlay.hidden = false;
  }

  function hideOverlay() {
    overlay.hidden = true;
  }

  function trade(side) {
    if (state.mode === 'paused') {
      announce('Рынок на паузе — нажмите «Дальше»');
      return;
    }
    if (state.mode !== 'running') {
      announce('Сначала откройте торги');
      return;
    }

    const i = state.active;
    const coin = COINS[i];
    const qty = readQty();
    const price = state.prices[i];

    if (side === 'buy') {
      const cost = round2(price * qty);
      if (cost > state.cash + 0.005) {
        announce('Не хватает ' + money2(cost - state.cash) + ' — уменьшите количество');
        return;
      }
      state.cash = round2(state.cash - cost);
      state.holdings[i] += qty;
      announce('Куплено ' + qty + ' ' + coin.ticker + ' за ' + money2(cost));
    } else {
      if (qty > state.holdings[i]) {
        announce(state.holdings[i] === 0
          ? 'В кошельке нет ' + coin.ticker
          : 'В кошельке только ' + state.holdings[i] + ' ' + coin.ticker);
        return;
      }
      const income = round2(price * qty);
      state.cash = round2(state.cash + income);
      state.holdings[i] -= qty;
      announce('Продано ' + qty + ' ' + coin.ticker + ' за ' + money2(income));
    }

    updateUI();
    checkEnd();
  }

  function resetMarket() {
    state.mode = 'running';
    state.cash = START_CASH;
    state.holdings = [0, 0, 0];
    state.moods = [0, 0, 0];
    state.candles = COINS.map(() => []);
    state.qtys = COINS.map((coin) => coin.lot);
    state.eventIn = 14 + Math.floor(Math.random() * 10);
    seedCandles();
    qtyInput.value = String(state.qtys[state.active]);
    updateUI();
    draw();
  }

  function stopLoop() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startLoop() {
    stopLoop();
    timer = setInterval(tick, TICK_MS);
  }

  function tick() {
    if (state.mode !== 'running') return;

    const opened = state.prices.slice();
    state.prices = state.prices.map((price, i) => nextPrice(i, price));
    state.eventIn -= 1;
    if (state.eventIn <= 0) fireEvent();

    COINS.forEach((coin, i) => {
      const list = state.candles[i];
      list.push(makeCandle(opened[i], state.prices[i]));
      if (list.length > MAX_CANDLES) list.shift();
    });

    updateUI();
    draw();
    checkEnd();
  }

  function checkEnd() {
    if (state.mode !== 'running') return;
    const cap = capital();

    if (cap >= GOAL) {
      state.mode = 'over';
      stopLoop();
      if (cap > state.best) {
        state.best = cap;
        saveBest(cap);
      }
      updateUI();
      showOverlay(
        'Цель достигнута',
        'Капитал ' + money0(cap),
        'Из 1 000 ₡ вы сделали ' + money0(cap) + '. Рынок вам покорился — попробуете повторить?',
        'Сыграть ещё',
        startNew
      );
      announce('Цель достигнута — капитал ' + money0(cap));
      return;
    }

    if (cap < RUIN) {
      state.mode = 'over';
      stopLoop();
      updateUI();
      showOverlay(
        'Разорение',
        'Капитал почти на нуле',
        'Осталось меньше 20 ₡. Рынок бывает жестоким — попробуйте другую стратегию.',
        'Начать заново',
        startNew
      );
      announce('Капитал на нуле');
    }
  }

  function resume() {
    if (state.mode !== 'paused') return;
    state.mode = 'running';
    hideOverlay();
    updateUI();
    startLoop();
  }

  function togglePause() {
    if (state.mode === 'running') {
      state.mode = 'paused';
      stopLoop();
      updateUI();
      showOverlay(
        'Пауза',
        'Рынок замер',
        'Цены остановились. Можно спокойно подумать и вернуться в игру.',
        'Продолжить торги',
        resume
      );
    } else if (state.mode === 'paused') {
      resume();
    }
  }

  function startNew() {
    stopLoop();
    hideOverlay();
    resetMarket();
    announce('Рынок открыт — покупайте дёшево, продавайте дорого');
    startLoop();
  }

  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasW = rect.width;
    canvasH = rect.height;
    const px = Math.round(rect.width * dpr);
    const py = Math.round(rect.height * dpr);
    if (canvas.width !== px || canvas.height !== py) {
      canvas.width = px;
      canvas.height = py;
    }
  }

  function draw() {
    fitCanvas();
    const w = canvasW;
    const h = canvasH;
    if (!w || !h) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const i = state.active;
    const candles = state.candles[i];
    if (!candles || !candles.length) return;

    const base = COINS[i].base;
    const padLeft = 10;
    const padRight = 46;
    const padTop = 34;
    const padBottom = 14;

    let min = base;
    let max = base;
    candles.forEach((k) => {
      if (k.l < min) min = k.l;
      if (k.h > max) max = k.h;
    });

    let span = max - min;
    if (span <= 0) span = base * 0.04;
    const padding = span * 0.1;
    min -= padding;
    max += padding;
    span = max - min;

    const plotW = Math.max(10, w - padLeft - padRight);
    const plotH = Math.max(10, h - padTop - padBottom);
    const step = plotW / candles.length;
    const bodyW = Math.max(2, Math.min(14, step * 0.62));
    const xAt = (index) => padLeft + step * (index + 0.5);
    const yAt = (price) => padTop + plotH - ((price - min) / span) * plotH;

    ctx.lineWidth = 1;
    ctx.font = "600 9px Manrope, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let g = 0; g <= 3; g += 1) {
      const y = padTop + (plotH * g) / 3;
      ctx.strokeStyle = "rgba(255,255,255,.055)";
      ctx.beginPath();
      ctx.moveTo(padLeft, y + 0.5);
      ctx.lineTo(padLeft + plotW, y + 0.5);
      ctx.stroke();
      const value = max - (span * g) / 3;
      ctx.fillStyle = "#5f7d90";
      ctx.fillText(shortPrice(value), w - 4, y);
    }

    for (let g = 1; g <= 4; g += 1) {
      const x = padLeft + (plotW * g) / 5;
      ctx.strokeStyle = "rgba(255,255,255,.04)";
      ctx.beginPath();
      ctx.moveTo(x + 0.5, padTop);
      ctx.lineTo(x + 0.5, padTop + plotH);
      ctx.stroke();
    }

    if (base > min && base < max) {
      const baseY = yAt(base);
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = "rgba(255,255,255,.18)";
      ctx.beginPath();
      ctx.moveTo(padLeft, baseY);
      ctx.lineTo(padLeft + plotW, baseY);
      ctx.stroke();
      ctx.restore();
    }

    candles.forEach((k, index) => {
      const up = k.c >= k.o;
      const color = up ? CANDLE_UP : CANDLE_DOWN;
      const x = xAt(index);
      const yOpen = yAt(k.o);
      const yClose = yAt(k.c);
      const top = Math.min(yOpen, yClose);
      const bodyH = Math.max(1, Math.abs(yClose - yOpen));

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yAt(k.h));
      ctx.lineTo(x, yAt(k.l));
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.fillRect(x - bodyW / 2, top, bodyW, bodyH);
    });
  }

  function resize() {
    draw();
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectCoin(Number(tab.dataset.tab)));
  });

  document.querySelectorAll('[data-step]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = COINS[state.active].lot * Number(btn.dataset.step);
      qtyInput.value = String(clamp(readQty() + step, 1, 99999));
      state.qtys[state.active] = readQty();
      updateUI();
    });
  });

  qtyInput.addEventListener('change', () => {
    qtyInput.value = String(readQty());
    state.qtys[state.active] = readQty();
    updateUI();
  });

  buyBtn.addEventListener('click', () => trade('buy'));
  sellBtn.addEventListener('click', () => trade('sell'));

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target;
    if (target && target.closest && target.closest('input, textarea, select')) return;

    const key = event.key.toLowerCase();
    if (key === '1' || key === '2' || key === '3') {
      selectCoin(Number(key) - 1);
    } else if (key === 'b' || key === 'и') {
      trade('buy');
    } else if (key === 's' || key === 'ы') {
      trade('sell');
    }
  });

  pauseBtn.addEventListener('click', togglePause);
  restartBtn.addEventListener('click', startNew);
  actionBtn.onclick = startNew;

  seedCandles();
  updateUI();
  fitCanvas();
  draw();

  window.addEventListener('resize', resize);
  if (typeof ResizeObserver === 'function' && stage) {
    new ResizeObserver(resize).observe(stage);
  }
}());
