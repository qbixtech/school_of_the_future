(function () {
  'use strict';

  var KEY = 'sotf-theme';
  var root = document.documentElement;
  var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 14.1A8.6 8.6 0 0 1 9.9 3.4a8.6 8.6 0 1 0 10.7 10.7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.6v2.2M12 19.2v2.2M4.4 4.4 6 6M18 18l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.4 19.6 6 18M18 6l1.6-1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  function readTheme() {
    try {
      var value = localStorage.getItem(KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (error) {
      /* localStorage может быть недоступен */
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', theme === 'dark' ? '#081726' : '#f6f9fc');

    var button = document.querySelector('.theme-toggle');
    if (!button) return;

    var dark = theme === 'dark';
    button.innerHTML = dark ? SUN : MOON;
    button.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
    button.setAttribute('title', dark ? 'Светлая тема' : 'Тёмная тема');
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  applyTheme(readTheme() || 'light');

  function mountToggle() {
    var nav = document.querySelector('.nav-inner');
    if (!nav || nav.querySelector('.theme-toggle')) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.innerHTML = MOON;
    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
    });

    nav.appendChild(button);
    applyTheme(root.getAttribute('data-theme') || readTheme() || 'light');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountToggle);
  } else {
    mountToggle();
  }

  window.addEventListener('storage', function (event) {
    if (event.key === KEY && (event.newValue === 'dark' || event.newValue === 'light')) {
      applyTheme(event.newValue);
    }
  });
}());
