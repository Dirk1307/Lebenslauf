/* Touch adaptations of the existing V6A split/stack effects.
 * Navigation pattern: Watermelon Carousel Navigator (MIT), see docs/WATERMELON.md.
 */
(() => {
  'use strict';
  const small = matchMedia('(max-width: 780px)');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const label = heading => {
    const copy = heading.cloneNode(true);
    copy.querySelectorAll('br').forEach(br => br.replaceWith(' '));
    return copy.textContent.replace(/\s+/g, ' ').trim();
  };
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 7 7-7 7"/></svg>';

  // The same three faces flip on tap; without JS/reduced motion the text stays open.
  function setupSplit() {
    let enabled = null;
    const items = [...document.querySelectorAll('.split-panel')].map((panel, i) => {
      const front = panel.querySelector('.split-front');
      const back = panel.querySelector('.split-back');
      const heading = back.querySelector('h3');
      const title = label(heading);
      back.id = `competency-detail-${i + 1}`;
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'split-open';
      open.setAttribute('aria-controls', back.id);
      open.setAttribute('aria-label', `${title}: Details öffnen`);
      open.innerHTML = '<small></small><strong></strong><span>Details ansehen '+arrow+'</span>';
      open.querySelector('small').textContent = `0${i + 1} / 03`;
      open.querySelector('strong').textContent = title;
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'split-close';
      close.textContent = 'Zurück zur Übersicht';
      close.setAttribute('aria-label', `${title}: Details schließen`);
      front.append(open);
      back.append(close);
      function setOpen(value, animate = false, focus = false) {
        panel.classList.toggle('split-instant', !animate);
        panel.classList.toggle('is-open', value);
        open.setAttribute('aria-expanded', String(value));
        front.setAttribute('aria-hidden', String(value));
        back.setAttribute('aria-hidden', String(!value));
        front.inert = value;
        back.inert = !value;
        open.disabled = value;
        close.disabled = !value;
        if (focus) (value ? heading : open).focus({ preventScroll: true });
      }
      open.addEventListener('click', e => setOpen(true, e.detail > 0, true));
      close.addEventListener('click', e => setOpen(false, e.detail > 0, true));
      panel.addEventListener('keydown', e => {
        if (e.key === 'Escape' && panel.classList.contains('is-open')) {
          e.preventDefault(); setOpen(false, false, true);
        }
      });
      return { panel, front, back, heading, open, close, setOpen };
    });
    function sync() {
      const active = small.matches && !motion.matches;
      if (active === enabled) return;
      enabled = active;
      document.documentElement.classList.toggle('split-touch', active);
      items.forEach(item => {
        item.open.hidden = item.close.hidden = !active;
        if (active) {
          item.heading.tabIndex = -1;
          item.setOpen(false);
        } else {
          const focused = item.front.contains(document.activeElement) || document.activeElement === item.close;
          item.panel.classList.remove('is-open', 'split-instant');
          item.front.inert = false;
          item.back.inert = false;
          item.front.setAttribute('aria-hidden', 'true');
          item.back.removeAttribute('aria-hidden');
          if (focused) { item.heading.tabIndex = -1; item.heading.focus({ preventScroll: true }); }
          else item.heading.removeAttribute('tabindex');
        }
      });
    }
    small.addEventListener('change', sync);
    motion.addEventListener('change', sync);
    sync();
  }

  // Native scrolling preserves iOS momentum and vertical page gestures.
  function setupCases() {
    const stage = document.querySelector('.cases-stage');
    const cards = [...stage.querySelectorAll('.case-card')];
    const controls = document.createElement('div');
    controls.className = 'case-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Erfahrungsfelder wechseln');
    controls.innerHTML = '<button type="button" class="case-prev" aria-label="Vorheriges Erfahrungsfeld">'+arrow+'</button><div class="case-pagination"></div><button type="button" class="case-next" aria-label="Nächstes Erfahrungsfeld">'+arrow+'</button><span class="visually-hidden" role="status" aria-atomic="true"></span>';
    const previous = controls.querySelector('.case-prev');
    const next = controls.querySelector('.case-next');
    const status = controls.querySelector('[role="status"]');
    let current = -1, pending = false;
    const dots = cards.map((card, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `0${i + 1}`;
      button.setAttribute('aria-label', `Erfahrungsfeld ${i + 1}: ${label(card.querySelector('h3'))}`);
      button.addEventListener('click', e => go(i, e.detail > 0));
      controls.querySelector('.case-pagination').append(button);
      return button;
    });
    stage.after(controls);
    function update() {
      pending = false;
      if (!small.matches) return;
      const left = stage.getBoundingClientRect().left;
      const nearest = cards.reduce((best, card, i) =>
        Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[best].getBoundingClientRect().left - left) ? i : best, 0);
      if (nearest === current) return;
      current = nearest;
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
      previous.disabled = current === 0;
      next.disabled = current === cards.length - 1;
      status.textContent = `Erfahrungsfeld ${current + 1} von ${cards.length}: ${label(cards[current].querySelector('h3'))}`;
    }
    function go(index, animate) {
      index = Math.max(0, Math.min(cards.length - 1, index));
      stage.scrollTo({ left: cards[index].offsetLeft - cards[0].offsetLeft, behavior: animate && !motion.matches ? 'smooth' : 'auto' });
      if (!animate || motion.matches) update();
    }
    previous.addEventListener('click', e => go(current - 1, e.detail > 0));
    next.addEventListener('click', e => go(current + 1, e.detail > 0));
    stage.addEventListener('scroll', () => {
      if (!pending) { pending = true; requestAnimationFrame(update); }
    }, { passive: true });
    stage.addEventListener('keydown', e => {
      if (!small.matches || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      go(e.key === 'Home' ? 0 : e.key === 'End' ? cards.length - 1 : current + (e.key === 'ArrowRight' ? 1 : -1), false);
    });
    function sync() { controls.hidden = !small.matches; update(); }
    small.addEventListener('change', sync);
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(stage);
    sync();
  }
  setupSplit();
  setupCases();
})();
