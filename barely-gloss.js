/* Barely Gloss — page behaviour.
   Everything here enhances markup that already renders and reads without it. */

(() => {
  'use strict';

  /* ---------- header: mobile panel + stuck state ---------- */

  const header = document.getElementById('header');
  const toggle = header.querySelector('.menu-toggle');
  const panel = document.getElementById('site-nav');

  function setMenu(open, returnFocus) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) panel.querySelector('a').focus();
    else if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true', true);
  });

  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false, false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) setMenu(false, true);
  });

  // Rotating to a wide viewport restyles the panel as a pill again; clear the
  // open state so body scroll is never left locked.
  const wide = window.matchMedia('(min-width: 901px)');
  wide.addEventListener('change', (e) => {
    if (e.matches && header.classList.contains('is-open')) setMenu(false, false);
  });

  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- treatment filters ---------- */

  const filters = [...document.querySelectorAll('.filter')];
  const grid = document.getElementById('menu-grid');
  const treatments = [...grid.querySelectorAll('.treatment')];

  const empty = document.createElement('p');
  empty.className = 'menu-empty';
  empty.hidden = true;
  empty.textContent = 'Nothing in this category yet.';
  grid.append(empty);

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.filter;
      filters.forEach((f) => f.setAttribute('aria-pressed', String(f === btn)));

      let shown = 0;
      treatments.forEach((card) => {
        const match = kind === 'all' || card.dataset.kind === kind;
        card.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
    });
  });

  /* ---------- banner tabs ---------- */

  const tabs = [...document.querySelectorAll('.tab')];
  const tabBody = document.getElementById('tab-body');

  function selectTab(tab) {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    tabBody.textContent = tab.dataset.copy;
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      const next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });

  /* ---------- quotes ---------- */

  const quotes = [
    {
      text: '“I have never had a set last four full weeks without a single lift. I stopped budgeting for a mid-month fix.”',
      name: 'Amara Whitfield',
      service: 'Builder Gel Overlay · client since 2023',
    },
    {
      text: '“They talked me out of the length I asked for and were completely right. That is the whole reason I keep coming back.”',
      name: 'Ines Duarte',
      service: 'Signature Gel Manicure · client since 2024',
    },
    {
      text: '“The foot ritual is the only hour of my week nobody can reach me. I book it standing, a month at a time.”',
      name: 'Priya Raghunathan',
      service: 'Foot & Calf Ritual · client since 2022',
    },
  ];

  const qText = document.getElementById('quote-text');
  const qName = document.getElementById('quote-name');
  const qService = document.getElementById('quote-service');
  const qIndex = document.getElementById('quote-index');
  const qBar = document.getElementById('quote-bar');
  let at = 0;

  function showQuote(i) {
    at = (i + quotes.length) % quotes.length;
    const q = quotes[at];
    qText.textContent = q.text;
    qName.textContent = q.name;
    qService.textContent = q.service;
    qIndex.textContent = String(at + 1);
    qBar.style.width = `${((at + 1) / quotes.length) * 100}%`;
  }

  document.getElementById('quote-prev').addEventListener('click', () => showQuote(at - 1));
  document.getElementById('quote-next').addEventListener('click', () => showQuote(at + 1));

  /* ---------- signup ---------- */

  const form = document.getElementById('signup-form');
  const email = document.getElementById('signup-email');
  const note = document.getElementById('signup-note');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // No mail provider is wired up yet; this validates and acknowledges only.
    note.textContent = email.validity.valid && email.value
      ? 'Thank you — we will be in touch.'
      : 'That address does not look right. Try again?';
  });

  /* ---------- studio hours ---------- */

  // Opening hours as [open, close] in 24h, indexed by day with Sunday at 0.
  // Must stay in step with the list rendered in the markup.
  const HOURS = {
    0: [11, 17], 1: null, 2: [10, 19], 3: [10, 19],
    4: [10, 20], 5: [10, 20], 6: [9, 18],
  };
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const clock = (h) => `${((h + 11) % 12) + 1}${h < 12 ? 'am' : 'pm'}`;

  // The studio is in Manila, so the answer to "are they open?" is the same
  // wherever the visitor happens to be reading from.
  function studioNow() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(new Date());
    const at = (type) => parts.find((p) => p.type === type).value;
    const index = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      day: index[at('weekday')],
      minutes: (Number(at('hour')) % 24) * 60 + Number(at('minute')),
    };
  }

  function currentStatus({ day, minutes }) {
    const today = HOURS[day];
    if (today && minutes >= today[0] * 60 && minutes < today[1] * 60) {
      return { open: true, text: `Open now · until ${clock(today[1])}` };
    }
    for (let ahead = 0; ahead < 8; ahead++) {
      const d = (day + ahead) % 7;
      const hours = HOURS[d];
      if (!hours) continue;
      if (ahead === 0) {
        if (minutes < hours[0] * 60) {
          return { open: false, text: `Closed · opens today at ${clock(hours[0])}` };
        }
        continue;
      }
      const when = ahead === 1 ? 'tomorrow' : DAYS[d];
      return { open: false, text: `Closed · opens ${when} at ${clock(hours[0])}` };
    }
    return { open: false, text: 'Closed' };
  }

  const statusEl = document.getElementById('visit-status');
  const hoursList = document.getElementById('hours-list');
  const now = studioNow();
  const status = currentStatus(now);

  document.getElementById('visit-status-text').textContent = status.text;
  statusEl.classList.toggle('is-open', status.open);
  hoursList.querySelector(`[data-day="${now.day}"]`)?.classList.add('is-today');

  /* ---------- nav reflects the section in view ---------- */

  const links = [...panel.querySelectorAll('a')];
  const targets = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => {
            const active = a.getAttribute('href') === `#${entry.target.id}`;
            if (active) a.setAttribute('aria-current', 'page');
            else a.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    targets.forEach((t) => spy.observe(t));
  }
})();
