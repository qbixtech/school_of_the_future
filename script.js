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
  ['Байтимиров Руслан','Активист, мультипотенциал','Байтимиров Руслан/BY.jpg','ruslan-baitimirov'],['Бунаков Константин','Капитан команды «Гефест»','Бунаков Константин/BUN.jpg','konstantin-bunakov'],['Бусов Кирилл','Инженер команды «МикоБу»','Бусов Кирилл/BUS.jpg','kirill-busov'],['Виноградов Максим','Универсальная личность','Виноградов Максим/V.jpg','maksim-vinogradov'],['Динер Кирилл','Спец по 3D-технологиям','Динер Кирилл/D.jpg','kirill-diner'],['Жданович Сергей','Инженер команды «Гефест»','Жданович Сергей/J.jpg','sergey-zhdanovich'],['Ильин Максим','Программист команды «Кракен»','Ильин Максим/I.jpg','maksim-ilin'],['Ковальчук Дмитрий','Программист команды «Итальянцы»','Ковальчук Дмитрий/KOC.jpg','dmitry-kovalchuk'],['Ковтунец Михаил','Участник школьных проектов','Ковтунец Михаил/MK.jpg','mihail-kovtunets'],['Константинов Михаил','Исследователь и командный игрок','Константинов Михаил/KN.jpg','mihail-konstantinov'],['Корж Михаил','Участник классных инициатив','Корж Михаил/KR.jpg','mihail-korzh'],['Кучумов Николай','Творческий участник класса','Кучумов Николай/KC.jpg','nikolay-kuchumov'],['Лелюшкина Серафима','Участница проектов класса','Лелюшкина Серафима/LL.jpg','serafima-lelyushkina'],['Литвинова Таисия','Инициатор школьных событий','Литвинова Таисия/LT.jpg','taisya-litvinova'],['Малышева Диана','Участница творческих проектов','Малышева Диана/ML.jpg','diana-malysheva'],['Мартинович Артём','Участник команды класса','Мартинович Артём/MR.jpg','artyom-martinovich'],['Миков Владимир','Участник исследовательских проектов','Миков Владимир/MV.jpg','vladimir-mikov'],['Мунько Олег','Участник школьных событий','Мунько Олег/MN.jpg','oleg-munko'],['Орлов Тимофей','Участник спортивных инициатив','Орлов Тимофей/O.jpg','timofey-orlov'],['Павличенко Кузьма','Участник команды класса','Павличенко Кузьма/P.jpg','kuzma-pavlichenko'],['Паладьев Даниил','Участник инженерных проектов','Паладьев Даниил/PLD.jpg','daniil-paladiev'],['Ромадин Степан','Участник школьных событий','Ромадин Степан/R.jpg','stepan-romadin'],['Скрягина Анастасия','Участница творческих проектов','Скрягина Анастасия/SK.jpg','anastasia-skryagina'],['Стопудов Тимур','Участник команды класса','Стопудов Тимур/S.jpg','timur-stopudov'],['Тепляков Дмитрий','Участник исследовательских проектов','Тепляков Дмитрий/TPL.jpg','dmitry-teplyakov'],['Тимофти Валерия','Участница классных инициатив','Тимофти Валерия/TM.jpg','valeria-timofti'],['Трус Ева','Участница школьных событий','Трус Ева/TR.jpg','eva-trus'],['Хаустов Григорий','Участник инженерных проектов','Хаустов Григорий/H.jpg','grigory-haustov'],['Хуснулина Жасмин','Участница творческих проектов','Хуснулина Жасмин/HS.jpg','jasmin-husnulina'],['Чугунова Владислава','Участница командных проектов','Чугунова Владислава/CH.jpg','vladislava-chugunova'],['Новый участник','Карточка для заполнения','', 'new-student']
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

function initLightbox(){
  const images = Array.from(document.querySelectorAll('.article-gallery img, .memory-grid img'));
  if(!images.length) return;
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Просмотр фотографии');
  overlay.innerHTML = '<button class="lightbox-close" type="button" aria-label="Закрыть">×</button><button class="lightbox-nav prev" type="button" aria-label="Предыдущее фото">‹</button><img class="lightbox-img" alt=""><span class="lightbox-counter"></span><button class="lightbox-nav next" type="button" aria-label="Следующее фото">›</button>';
  overlay.hidden = true;
  document.body.appendChild(overlay);
  const preview = overlay.querySelector('.lightbox-img');
  const closeButton = overlay.querySelector('.lightbox-close');
  const prevButton = overlay.querySelector('.lightbox-nav.prev');
  const nextButton = overlay.querySelector('.lightbox-nav.next');
  const counter = overlay.querySelector('.lightbox-counter');
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
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };
  const close = () => {
    overlay.hidden = true;
    document.body.classList.remove('lightbox-open');
    preview.removeAttribute('src');
    if(lastFocus && lastFocus.focus) lastFocus.focus();
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

document.addEventListener('DOMContentLoaded', () => { renderStudents(); renderTeachers(); renderProfile(); applySiteConfig(); initHeroScrollCue(); initCosmicScene(); initLightbox(); });
