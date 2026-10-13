function getSiteConfig(){
  return window.SITE_CONFIG || { className: '9 «К»', classShort: '9К' };
}

function applySiteConfig(){
  const config = getSiteConfig();
  const previousName = window.__APPLIED_CLASS_NAME || '8 «К»';
  const previousShort = window.__APPLIED_CLASS_SHORT || '8К';
  document.documentElement.style.setProperty('--class-code', `"${config.classShort}"`);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while(node = walker.nextNode()){
    if(!node.parentElement.closest('script,style')) textNodes.push(node);
  }
  textNodes.forEach((textNode) => {
    textNode.nodeValue = textNode.nodeValue
      .replaceAll(previousName, config.className)
      .replaceAll(previousShort, config.classShort)
      .replaceAll('8 «К»', config.className)
      .replaceAll('8К', config.classShort);
  });
  document.title = document.title.replaceAll(previousName, config.className).replaceAll(previousShort, config.classShort);
  document.querySelectorAll('meta[ name="description"], meta[name="description"]').forEach((meta) => {
    meta.content = meta.content.replaceAll(previousName, config.className).replaceAll(previousShort, config.classShort);
  });
  window.__APPLIED_CLASS_NAME = config.className;
  window.__APPLIED_CLASS_SHORT = config.classShort;
}
window.applySiteConfig = applySiteConfig;

const students = [
  ['Байтимиров Руслан','Активист, мультипотенциал','Байтимиров Руслан/BY.png','ruslan-baitimirov'],['Бунаков Константин','Капитан команды «Гефест»','Бунаков Константин/BUN.jpg','konstantin-bunakov'],['Бусов Кирилл','Инженер команды «МикоБу»','Бусов Кирилл/BUS.jpg','kirill-busov'],['Виноградов Максим','Универсальная личность','Виноградов Максим/V.jpg','maksim-vinogradov'],['Динер Кирилл','Спец по 3D-технологиям','Динер Кирилл/D.jpg','kirill-diner'],['Жданович Сергей','Инженер команды «Гефест»','Жданович Сергей/J.jpg','sergey-zhdanovich'],['Ильин Максим','Программист команды «Кракен»','Ильин Максим/I.jpg','maksim-ilin'],['Ковальчук Дмитрий','Программист команды «Итальянцы»','Ковальчук Дмитрий/KOC.jpg','dmitry-kovalchuk'],['Ковтунец Михаил','Участник школьных проектов','Ковтунец Михаил/MK.jpg','mihail-kovtunets'],['Константинов Михаил','Исследователь и командный игрок','Константинов Михаил/KN.jpg','mihail-konstantinov'],['Корж Михаил','Участник классных инициатив','Корж Михаил/KR.jpg','mihail-korzh'],['Кучумов Николай','Творческий участник класса','Кучумов Николай/KC.jpg','nikolay-kuchumov'],['Лелюшкина Серафима','Участница проектов класса','Лелюшкина Серафима/LL.jpeg','serafima-lelyushkina'],['Литвинова Таисия','Инициатор школьных событий','Литвинова Таисия/LT.png','taisya-litvinova'],['Малышева Диана','Участница творческих проектов','Малышева Диана/ML.jpg','diana-malysheva'],['Мартинович Артём','Участник команды класса','Мартинович Артём/MR.jpg','artyom-martinovich'],['Миков Владимир','Участник исследовательских проектов','Миков Владимир/MV.jpg','vladimir-mikov'],['Орлов Тимофей','Участник спортивных инициатив','Орлов Тимофей/O.jpg','timofey-orlov'],['Павличенко Кузьма','Участник команды класса','Павличенко Кузьма/P.jpg','kuzma-pavlichenko'],['Паладьев Даниил','Участник инженерных проектов','Паладьев Даниил/PLD.jpg','daniil-paladiev'],['Ромадин Степан','Участник школьных событий','Ромадин Степан/R.jpg','stepan-romadin'],['Скрягина Анастасия','Участница творческих проектов','Скрягина Анастасия/SK.jpg','anastasia-skryagina'],['Стопудов Тимур','Участник команды класса','Стопудов Тимур/S.jpg','timur-stopudov'],['Тепляков Дмитрий','Участник исследовательских проектов','Тепляков Дмитрий/TPL.jpg','dmitry-teplyakov'],['Тимофти Валерия','Участница классных инициатив','Тимофти Валерия/TM.jpeg','valeria-timofti'],['Трус Ева','Участница школьных событий','Трус Ева/TR.png','eva-trus'],['Хаустов Григорий','Участник инженерных проектов','Хаустов Григорий/H.jpg','grigory-haustov'],['Хуснулина Жасмин','Участница творческих проектов','Хуснулина Жасмин/HS.jpg','jasmin-husnulina'],['Чугунова Владислава','Участница командных проектов','Чугунова Владислава/CH.jpeg','vladislava-chugunova'],['Новый участник','Карточка для заполнения','', 'new-student']
];

const teachers = [
  ['Голубицкий Алексей Викторович','Директор школы','голубицкий.jpg'],['Виноградова Светлана Владимировна','Учитель музыки','Виноградова С.В..JPG'],['Володькина Наталья Сергеевна','Учитель химии','Химия/Володькина Наталья Сергеевна/VDK.jpg'],['Дутко Татьяна Николаевна','Математика · классный руководитель','Математика и Кл. рук/Дутко Татьяна Николаевна/DKO.jpg'],['Ещенко Анжелика Витальевна','Учитель английского языка','Ангийский Язык/Ещенко Анжелика Витальевна/ECH.jpg'],['Здравеющая Лилия Владимировна','Учитель английского языка','Ангийский Язык/Здравеющая Лилия Владимировна/ZDA.jpg'],['Здоровеющий Дмитрий Анатольевич','Учитель истории','История/Здравеющих Дмитрий Анатольевич/ZDR.jpg'],['Климанова Мария Сергеевна','Русский язык и литература','Рус. Яз и Литература/Климанова Мария Сергеевна/KLM.jpg'],['Коцюба Олег Станиславович','Учитель обществознания','Обществознание/Коцюба Олег Станиславовоич/KCB.jpg'],['Мазаев Сергей Владимирович','ОБЖ и защита Родины','Мазаев С.В..JPG'],['Ореев Андрей Жумамбаевич','Информатика и технологии','Труд/Ореев Андрей Жумамбаевич/ORE.jpg'],['Орлов Сергей Викторович','Информатика и технологии','Информатика/Орлов Сергей Викторович/ORL.jpg'],['Куцева Альфия Анатольевна','Информатика','Информатика/Куцева Альфия Анатольевна/KUC.jpg'],['Оськина Василиса Васильевна','Физическая культура','Оськина В.В..JPG'],['Рубцова Ольга Александровна','Учитель биологии','Биология/Рубцова Ольга Александровна/RUB.jpg'],['Топольницкая Галина Геннадьевна','Учитель географии','География/Топольницкая Галина Генадьевна/TPL.jpg'],['Тычко Игорь Александрович','Учитель физики','Физика/Тычко Игорь Александрович/TCK.jpg'],['Щукина Татьяна Александровна','Русский язык · заместитель директора','Щукина Т.А..JPG']
];

const root = location.pathname.includes('/pages/students/') ? '../../' : location.pathname.includes('/pages/') ? '../' : './';
const photoRoot = `${root}Фото 8K/1/Ученики/`;
const teacherRoot = `${root}Фото 8K/Учителя/`;
const esc = (value) => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function renderStudents(){
  const element = document.querySelector('[data-students]');
  if(!element) return;
  element.innerHTML = students.map(([name, role, image, slug]) => `<a class="student-card" href="${root}pages/students/student.html?id=${slug}"><div class="student-photo">${image ? `<img src="${photoRoot}${image}" alt="${esc(name)}">` : '<div class="placeholder-mark" style="margin-top:45%">+</div>'}</div><div class="student-body"><h3 class="student-name">${esc(name)}</h3><span class="student-role">${esc(role)}</span><span class="student-action"><span>Профиль</span><b aria-hidden="true">↗</b></span></div></a>`).join('');
  const counter = document.querySelector('[data-student-count]');
  if(counter) counter.textContent = students.length;
}

function renderTeachers(){
  const element = document.querySelector('[data-teachers]');
  if(!element) return;
  element.innerHTML = teachers.map(([name, subject, image]) => `<article class="teacher-card"><img src="${teacherRoot}${image}" alt="${esc(name)}"><h3>${esc(name)}</h3><p>${esc(subject)}</p></article>`).join('');
}

function renderProfile(){
  const element = document.querySelector('[data-profile]');
  if(!element) return;
  const id = new URLSearchParams(location.search).get('id') || 'new-student';
  const [name, role, image] = students.find((item) => item[3] === id) || students.at(-1);
  element.innerHTML = `<a class="back-link" href="../../index.html#students">← Вернуться к ученикам</a><div class="student-profile"><div class="profile-photo">${image ? `<img src="${photoRoot}${image}" alt="${esc(name)}">` : '<div class="placeholder" style="height:100%;padding:85px 20px"><div class="placeholder-mark">+</div><p>Фото появится позже</p></div>'}</div><div class="profile-content"><div class="profile-meta"><span class="tag">Ученик класса</span><span>8 «К» · 2026</span></div><h1 class="page-title" style="font-size:clamp(40px,5vw,68px)">${esc(name)}</h1><p>${esc(role)}. Здесь появится личная история, интересы и важные этапы школьного пути.</p><div class="profile-cards"><article class="info-card"><h3>Достижения</h3><p>Добавьте олимпиады, конкурсы, проекты и другие результаты.</p></article><article class="info-card"><h3>Проекты</h3><p>Место для описания командной и индивидуальной работы.</p></article><article class="info-card"><h3>Интересы</h3><p>Здесь можно рассказать о хобби, навыках и мечтах ученика.</p></article><article class="info-card"><h3>Галерея</h3><p>Фотографии и материалы будут добавлены позже.</p></article></div></div></div>`;
}

function initHeroScrollCue(){
  const hero = document.querySelector('.hero');
  if(!hero || hero.querySelector('.scroll-cue')) return;
  const cue = document.createElement('a');
  cue.className = 'scroll-cue';
  cue.href = '#students';
  cue.setAttribute('aria-label','Прокрутить к ученикам класса');
  cue.innerHTML = '<span>Листать вниз</span><i aria-hidden="true"></i>';
  hero.appendChild(cue);
}

function initCosmicScene(){
  const hero = document.querySelector('.hero');
  const scene = document.querySelector('.orbit-stage');
  if(!hero || !scene || scene.querySelector('.star-field')) return;

  const stars = document.createElement('div');
  stars.className = 'star-field';
  stars.setAttribute('aria-hidden','true');
  for(let index = 0; index < 34; index += 1){
    const star = document.createElement('span');
    const x = (index * 37 + 11) % 100;
    const y = (index * 61 + 7) % 100;
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.animationDelay = `${(index % 9) * -0.38}s`;
    star.style.animationDuration = `${2.8 + (index % 5) * .65}s`;
    star.style.setProperty('--star-scale', `${.65 + (index % 4) * .2}`);
    stars.appendChild(star);
  }
  scene.appendChild(stars);

  const rocket = document.createElement('div');
  rocket.className = 'rocket';
  rocket.setAttribute('aria-hidden','true');
  rocket.innerHTML = '<span class="rocket-window"></span><span class="rocket-fin left"></span><span class="rocket-fin right"></span><span class="rocket-flame"></span>';
  scene.appendChild(rocket);

  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    let frame = 0;
    hero.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * 10;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * 7;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        scene.style.setProperty('--scene-x', `${x.toFixed(2)}px`);
        scene.style.setProperty('--scene-y', `${y.toFixed(2)}px`);
      });
    });
    hero.addEventListener('pointerleave', () => {
      scene.style.setProperty('--scene-x','0px');
      scene.style.setProperty('--scene-y','0px');
    });
  }
}

function prefersReducedMotion(){
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initScrollDock(){
  if(document.querySelector('.scroll-dock')) return;
  const dock = document.createElement('div');
  dock.className = 'scroll-dock';
  dock.setAttribute('aria-label','Листать страницу');
  dock.innerHTML = '<button type="button" data-scroll="-1" aria-label="Прокрутить вверх" title="Вверх"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg></button><button type="button" data-scroll="1" aria-label="Прокрутить вниз" title="Вниз"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg></button>';
  document.body.appendChild(dock);
  const up = dock.querySelector('[data-scroll="-1"]');
  const down = dock.querySelector('[data-scroll="1"]');
  dock.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-scroll]');
    if(!button) return;
    const direction = Number(button.dataset.scroll);
    window.scrollBy({ top: direction * Math.round(window.innerHeight * .86), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
  const sync = () => {
    const doc = document.documentElement;
    up.hidden = window.scrollY <= 8;
    down.hidden = window.innerHeight + window.scrollY >= doc.scrollHeight - 8;
  };
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();
}

function initPhotoViewer(){
  const cards = Array.from(document.querySelectorAll('.memory-card'));
  if(!cards.length || document.querySelector('.lightbox')) return;

  const grid = cards[0].parentElement;
  let items = [];

  const collectItems = () => cards
    .filter((card) => !card.classList.contains('is-hidden'))
    .map((card) => {
      const image = card.querySelector('img');
      const caption = card.querySelector('figcaption');
      return {
        card,
        src: image ? image.getAttribute('src') : '',
        alt: image ? (image.getAttribute('alt') || '') : '',
        caption: caption ? caption.textContent.trim() : ''
      };
    });

  const albumNames = [];
  cards.forEach((card) => {
    const album = card.dataset.album;
    if(album && !albumNames.includes(album)) albumNames.push(album);
  });
  const hasAlbums = albumNames.length > 1;

  const albumBar = document.createElement('div');
  albumBar.className = 'album-bar';
  albumBar.setAttribute('role','tablist');
  albumBar.setAttribute('aria-label','Альбомы фотографий');

  const applyFilter = (album, animate) => {
    const visible = [];
    cards.forEach((card) => {
      const match = !album || card.dataset.album === album;
      card.classList.toggle('is-hidden', !match);
      if(match) visible.push(card);
    });
    if(grid) grid.classList.toggle('album-active', Boolean(album));
    if(animate && !prefersReducedMotion()){
      visible.forEach((card, position) => {
        card.animate(
          [
            { opacity: 0, transform: 'translateY(12px) scale(.96)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' }
          ],
          { duration: 360, delay: position * 45, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'backwards' }
        );
      });
    }
    albumBar.querySelectorAll('.album-chip').forEach((chip) => {
      const value = chip.dataset.album;
      const isActive = (album === null && value === '') || value === album;
      chip.classList.toggle('active', isActive);
      chip.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  if(hasAlbums){
    const chips = [{ label: 'Все фото', value: null, count: cards.length }];
    albumNames.forEach((name) => {
      chips.push({ label: name, value: name, count: cards.filter((card) => card.dataset.album === name).length });
    });
    chips.forEach((data) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'album-chip';
      chip.dataset.album = data.value === null ? '' : data.value;
      chip.setAttribute('role','tab');
      chip.innerHTML = `<span>${data.label}</span><span class="album-count">${data.count}</span>`;
      chip.addEventListener('click', () => applyFilter(data.value, true));
      albumBar.appendChild(chip);
    });
    if(grid && grid.parentNode) grid.parentNode.insertBefore(albumBar, grid);
    applyFilter(null, false);
  }

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Просмотр фотографий');
  overlay.innerHTML = '<div class="lightbox-ui"><span class="lightbox-count"></span><span class="lightbox-hint">Листайте стрелками ← →</span></div><button class="lightbox-close" type="button" aria-label="Закрыть просмотр">×</button><button class="lightbox-nav prev" type="button" aria-label="Предыдущее фото">‹</button><div class="lightbox-stage"><img class="lightbox-img" alt="" draggable="false"></div><button class="lightbox-nav next" type="button" aria-label="Следующее фото">›</button><p class="lightbox-caption"></p>';
  document.body.appendChild(overlay);

  const stage = overlay.querySelector('.lightbox-stage');
  const imgEl = overlay.querySelector('.lightbox-img');
  const captionEl = overlay.querySelector('.lightbox-caption');
  const countEl = overlay.querySelector('.lightbox-count');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-nav.prev');
  const nextBtn = overlay.querySelector('.lightbox-nav.next');

  const cache = new Map();
  let index = 0;
  let isOpen = false;
  let busy = false;
  let lastFocused = null;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let dragging = false;
  let swallowClick = false;

  const loadImage = (src) => {
    if(!src) return Promise.resolve();
    if(cache.has(src)) return cache.get(src);
    const promise = new Promise((resolve) => {
      const image = new Image();
      image.onload = image.onerror = () => resolve(image);
      image.src = src;
    });
    cache.set(src, promise);
    return promise;
  };

  const paint = (position, direction) => {
    const item = items[position];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    captionEl.textContent = item.caption;
    countEl.textContent = `${position + 1} / ${items.length}`;
    if(prefersReducedMotion()) return;
    imgEl.animate(
      [
        { opacity: 0, transform: `translateX(${(direction || 0) * 7}%) scale(.94)` },
        { opacity: 1, transform: 'translateX(0) scale(1)' }
      ],
      { duration: 440, easing: 'cubic-bezier(.22,.61,.36,1)' }
    );
  };

  const show = (position, direction) => {
    if(!isOpen || busy) return;
    const target = (position + items.length) % items.length;
    busy = true;
    loadImage(items[target].src).then(() => {
      const settle = () => { index = target; paint(index, direction); busy = false; };
      if(prefersReducedMotion() || !direction){ settle(); return; }
      imgEl.animate(
        [
          { opacity: 1, transform: 'translateX(0) scale(1)' },
          { opacity: 0, transform: `translateX(${direction * -7}%) scale(.94)` }
        ],
        { duration: 230, easing: 'ease-in' }
      ).finished.then(settle, settle);
    });
  };

  const openAt = (card) => {
    items = collectItems();
    const position = items.findIndex((item) => item.card === card);
    if(position < 0 || !items[position].src) return;
    lastFocused = document.activeElement;
    index = position;
    isOpen = true;
    overlay.classList.add('open');
    document.body.classList.add('lightbox-locked');
    paint(index, 0);
    loadImage(items[(index + 1) % items.length].src);
    loadImage(items[(index - 1 + items.length) % items.length].src);
    closeBtn.focus({ preventScroll: true });
  };

  const close = () => {
    if(!isOpen) return;
    isOpen = false;
    overlay.classList.remove('open');
    document.body.classList.remove('lightbox-locked');
    if(lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
  };

  cards.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role','button');
    const image = card.querySelector('img');
    const caption = card.querySelector('figcaption');
    const label = caption ? caption.textContent.trim() : (image ? (image.getAttribute('alt') || '') : '');
    card.setAttribute('aria-label', `Открыть фото: ${label}`);
    card.addEventListener('click', () => openAt(card));
    card.addEventListener('keydown', (event) => {
      if(event.key === 'Enter' || event.key === ' '){ event.preventDefault(); openAt(card); }
    });
  });

  prevBtn.addEventListener('click', (event) => { event.stopPropagation(); show(index - 1, -1); });
  nextBtn.addEventListener('click', (event) => { event.stopPropagation(); show(index + 1, 1); });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if(swallowClick){ swallowClick = false; return; }
    if(event.target === overlay || event.target === stage) close();
  });

  document.addEventListener('keydown', (event) => {
    if(!isOpen) return;
    if(event.key === 'ArrowRight'){ event.preventDefault(); show(index + 1, 1); }
    else if(event.key === 'ArrowLeft'){ event.preventDefault(); show(index - 1, -1); }
    else if(event.key === 'Escape'){ close(); }
  });

  stage.addEventListener('pointerdown', (event) => {
    if(event.pointerType === 'mouse' && event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    dragging = false;
    try { stage.setPointerCapture(pointerId); } catch(_) {}
  });
  stage.addEventListener('pointermove', (event) => {
    if(event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if(Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) dragging = true;
    if(dragging && !prefersReducedMotion()){
      imgEl.style.transform = `translateX(${dx * .4}px)`;
      imgEl.style.opacity = String(Math.max(.35, 1 - Math.abs(dx) / 700));
    }
  });
  const finishDrag = (event) => {
    if(event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    imgEl.style.transform = '';
    imgEl.style.opacity = '';
    const wasDragging = dragging;
    pointerId = null;
    dragging = false;
    if(wasDragging){
      swallowClick = true;
      if(Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
  };
  stage.addEventListener('pointerup', finishDrag);
  stage.addEventListener('pointercancel', finishDrag);
}

function initArticleViewer(){
  const images = Array.from(document.querySelectorAll('.article-gallery img'));
  if(!images.length || document.querySelector('.article-lightbox')) return;
  const overlay = document.createElement('div');
  overlay.className = 'article-lightbox';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Просмотр фотографии');
  overlay.innerHTML = '<button class="article-lightbox-close" type="button" aria-label="Закрыть">×</button><button class="article-lightbox-nav prev" type="button" aria-label="Предыдущее фото">‹</button><img class="article-lightbox-img" alt="" draggable="false"><span class="article-lightbox-counter"></span><button class="article-lightbox-nav next" type="button" aria-label="Следующее фото">›</button>';
  overlay.hidden = true;
  document.body.appendChild(overlay);
  const preview = overlay.querySelector('.article-lightbox-img');
  const closeButton = overlay.querySelector('.article-lightbox-close');
  const prevButton = overlay.querySelector('.article-lightbox-nav.prev');
  const nextButton = overlay.querySelector('.article-lightbox-nav.next');
  const counter = overlay.querySelector('.article-lightbox-counter');
  const many = images.length > 1;
  prevButton.hidden = !many;
  nextButton.hidden = !many;
  counter.hidden = !many;
  let current = 0;
  let lastFocus = null;
  const show = (index) => {
    current = (index + images.length) % images.length;
    const source = images[current];
    preview.src = source.currentSrc || source.src;
    preview.alt = source.alt || '';
    counter.textContent = `${current + 1} / ${images.length}`;
  };
  const open = (index, source) => {
    lastFocus = source || document.activeElement;
    show(index);
    overlay.hidden = false;
    document.body.classList.add('article-lightbox-locked');
    closeButton.focus({ preventScroll: true });
  };
  const close = () => {
    overlay.hidden = true;
    document.body.classList.remove('article-lightbox-locked');
    preview.removeAttribute('src');
    if(lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  const step = (delta) => show(current + delta);
  images.forEach((image, index) => {
    image.classList.add('is-zoomable');
    image.setAttribute('tabindex','0');
    image.setAttribute('role','button');
    image.addEventListener('click', () => open(index, image));
    image.addEventListener('keydown', (event) => {
      if(event.key === 'Enter' || event.key === ' '){ event.preventDefault(); open(index, image); }
    });
  });
  prevButton.addEventListener('click', (event) => { event.stopPropagation(); step(-1); });
  nextButton.addEventListener('click', (event) => { event.stopPropagation(); step(1); });
  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', (event) => { if(event.target === overlay) close(); });
  document.addEventListener('keydown', (event) => {
    if(overlay.hidden) return;
    if(event.key === 'Escape') close();
    else if(event.key === 'ArrowLeft') step(-1);
    else if(event.key === 'ArrowRight') step(1);
  });
  let touchStartX = 0;
  overlay.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if(Math.abs(delta) > 40) step(delta < 0 ? 1 : -1);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => { renderStudents(); renderTeachers(); renderProfile(); applySiteConfig(); initHeroScrollCue(); initCosmicScene(); initPhotoViewer(); initScrollDock(); initArticleViewer(); });
