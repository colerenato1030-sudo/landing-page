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

  const statusEl = document.getElementById('studio-status');
  const hoursList = document.getElementById('hours-list');
  const now = studioNow();
  const status = currentStatus(now);

  document.getElementById('studio-status-text').textContent = status.text;
  statusEl.classList.toggle('is-open', status.open);
  // Rows cover a span of days, so match a member of the list rather than one day.
  hoursList.querySelector(`[data-days~="${now.day}"]`)?.classList.add('is-today');

  /* ---------- booking ---------- */
  // Reuses HOURS, DAYS and clock() above: the form offers exactly the times
  // the studio is actually open, so the two can never drift apart.

  const bookForm = document.getElementById('book-form');
  const bkService = document.getElementById('bk-service');
  const bkDate = document.getElementById('bk-date');
  const bkSlots = document.getElementById('bk-slots');
  const bkDayNote = document.getElementById('bk-day-note');
  const bkPatch = document.getElementById('bk-patch');
  const bkSummary = document.getElementById('bk-summary');
  const bkFine = document.getElementById('bk-fine');
  let chosenSlot = null;

  const isoToday = () =>
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(new Date());
  // midday avoids the parsed date sliding a day either way across timezones
  const asDate = (iso) => new Date(`${iso}T12:00:00`);
  const hhmm = (m) => {
    const h = Math.floor(m / 60);
    return `${((h + 11) % 12) + 1}:${String(m % 60).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`;
  };

  bkDate.min = isoToday();

  function fillSummary() {
    bkSummary.textContent = '';
    const opt = bkService.selectedOptions[0];
    if (!opt || !opt.dataset.min) {
      bkSummary.textContent = 'Nothing selected yet.';
      return;
    }
    const parts = [['b', opt.textContent.split(' · ')[0]]];
    if (bkDate.value) {
      parts.push(['span', asDate(bkDate.value).toLocaleDateString('en-PH',
        { weekday: 'short', day: 'numeric', month: 'short' })]);
    }
    if (chosenSlot) parts.push(['b', chosenSlot.textContent]);
    parts.push(['span', `${opt.dataset.min} min`], ['span', `from ₱${opt.dataset.price}`]);

    parts.forEach(([tag, text], i) => {
      if (i) bkSummary.append(' · ');
      const el = document.createElement(tag);
      el.textContent = text;
      bkSummary.append(el);
    });
  }

  function checkPatchTest() {
    const opt = bkService.selectedOptions[0];
    if (!opt?.dataset.patch || !bkDate.value) {
      bkPatch.hidden = true;
      return;
    }
    const days = Math.round((asDate(bkDate.value) - asDate(isoToday())) / 86400000);
    bkPatch.hidden = days >= 2;
  }

  function renderSlots() {
    const opt = bkService.selectedOptions[0];
    const duration = Number(opt?.dataset.min || 0);
    chosenSlot = null;
    bkSlots.textContent = '';

    const say = (message) => {
      const p = document.createElement('p');
      p.className = 'slot-empty';
      p.textContent = message;
      bkSlots.append(p);
    };

    if (!duration || !bkDate.value) {
      say('Choose a treatment and a date to see open times.');
      fillSummary();
      return;
    }

    const day = asDate(bkDate.value).getDay();
    const hours = HOURS[day];
    bkDayNote.textContent = hours
      ? `Open ${clock(hours[0])} – ${clock(hours[1])} on ${DAYS[day]}s.`
      : `The studio is closed on ${DAYS[day]}s.`;

    if (!hours) {
      say('Closed that day — try another date.');
      fillSummary();
      return;
    }

    const close = hours[1] * 60;
    const today = bkDate.value === isoToday();
    const nowMinutes = studioNow().minutes;
    let bookable = 0;

    for (let start = hours[0] * 60; start + duration <= close; start += 30) {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'slot';
      slot.setAttribute('role', 'radio');
      slot.setAttribute('aria-checked', 'false');
      slot.textContent = hhmm(start);
      // an hour's notice on the day itself, so nobody books a slot already gone
      if (today && start <= nowMinutes + 60) slot.disabled = true;
      else bookable++;
      bkSlots.append(slot);
    }

    if (!bkSlots.children.length) {
      say('That treatment needs more time than this day has left. Try another date.');
    } else if (!bookable) {
      bkSlots.prepend(Object.assign(document.createElement('p'),
        { className: 'slot-empty', textContent: 'Nothing left today — try tomorrow.' }));
    }
    fillSummary();
  }

  bkSlots.addEventListener('click', (e) => {
    const slot = e.target.closest('.slot');
    if (!slot || slot.disabled) return;
    bkSlots.querySelectorAll('.slot').forEach((s) =>
      s.setAttribute('aria-checked', String(s === slot)));
    chosenSlot = slot;
    fillSummary();
  });

  bkService.addEventListener('change', () => { renderSlots(); checkPatchTest(); });
  bkDate.addEventListener('change', () => { renderSlots(); checkPatchTest(); });

  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const required = [bkService, document.getElementById('bk-name'),
      document.getElementById('bk-email'), document.getElementById('bk-phone'), bkDate];

    let firstBad = null;
    required.forEach((el) => {
      const ok = el.value.trim() !== '' && el.checkValidity();
      el.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstBad) firstBad = el;
    });

    if (firstBad) {
      bkFine.className = 'book-fine is-error';
      bkFine.textContent = 'A starred field is still empty or not quite right.';
      firstBad.focus();
      return;
    }
    if (!chosenSlot) {
      bkFine.className = 'book-fine is-error';
      bkFine.textContent = 'Pick a start time to finish the request.';
      return;
    }

    // No booking system is wired up yet; this acknowledges and stops there.
    bkFine.className = 'book-fine is-done';
    bkFine.textContent = 'Request sent. We will text you within one working day to confirm — nothing is charged now.';
  });

  renderSlots();

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
