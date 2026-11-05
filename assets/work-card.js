/* Expandable Profile Card, adapted from Watermelon Platform (MIT).
 * Source and adaptation notes: docs/WATERMELON.md
 * License: assets/licenses/Watermelon-MIT.txt
 * Vanilla implementation for the existing V6A site; no React runtime required.
 */
(() => {
  'use strict';
  const dialog = document.getElementById('work-step-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const buttons = [...document.querySelectorAll('.process-trigger')];
  const content = buttons.map(button => ({
    title: button.querySelector('strong').textContent,
    description: document.getElementById(button.getAttribute('aria-describedby')).textContent
  }));
  const art = dialog.querySelector('.work-dialog-art');
  const closeButton = dialog.querySelector('.work-dialog-close');
  let current = 0, invoker = null, animation = null, closing = false, savedStyles = null;

  function setContent(index) {
    current = (index + content.length) % content.length;
    const number = `0${current + 1}`;
    const item = content[current];
    document.getElementById('process-name').textContent = `${number} / ${item.title.toLocaleUpperCase('de-DE')}`;
    document.getElementById('work-dialog-title').textContent = item.title;
    document.getElementById('process-description').textContent = item.description;
    dialog.querySelector('.work-dialog-count').textContent = `${number} / 04`;
    art.className = `work-dialog-art work-art-${current}`;
    art.querySelector('.work-dialog-visual').replaceChildren(buttons[current].querySelector('.work-illustration').cloneNode(true));
    art.querySelector('.work-dialog-number').textContent = number;
    buttons.forEach((button, i) => button.setAttribute('aria-expanded', String(i === current)));
  }
  function lockScroll() {
    const body = document.body;
    savedStyles = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    const gutter = innerWidth - document.documentElement.clientWidth;
    if (gutter > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + gutter}px`;
    body.style.overflow = 'hidden';
  }
  function restoreScroll() {
    if (savedStyles) Object.assign(document.body.style, savedStyles);
    savedStyles = null;
  }
  function cardTransform() {
    const from = invoker.getBoundingClientRect(), to = dialog.getBoundingClientRect();
    return `translate(${from.left - to.left}px,${from.top - to.top}px) scale(${from.width / to.width},${from.height / to.height})`;
  }
  function stopAnimation() {
    animation?.cancel();
    animation = null;
  }
  function open(index, button) {
    if (dialog.open) return;
    invoker = button;
    closing = false;
    setContent(index);
    lockScroll();
    try { dialog.showModal(); } catch { restoreScroll(); return; }
    if (!motion.matches && typeof dialog.animate === 'function') {
      animation = dialog.animate([
        { transform: cardTransform(), opacity: .4, borderRadius: '18px' },
        { transform: 'translate(0,0) scale(1,1)', opacity: 1, borderRadius: '26px' }
      ], { duration: 400, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }
  function close() {
    if (!dialog.open || closing) return;
    closing = true;
    stopAnimation();
    if (motion.matches || document.hidden || typeof dialog.animate !== 'function') {
      dialog.close(); return;
    }
    animation = dialog.animate([
      { transform: 'translate(0,0) scale(1,1)', opacity: 1 },
      { transform: cardTransform(), opacity: 0 }
    ], { duration: 200, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
    animation.finished.then(() => { if (dialog.open) dialog.close(); }).catch(() => {});
  }
  dialog.addEventListener('close', () => {
    stopAnimation();
    closing = false;
    buttons.forEach(button => button.setAttribute('aria-expanded', 'false'));
    restoreScroll();
    invoker?.focus({ preventScroll: true });
  });
  dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });
  dialog.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')]
      .filter(el => el.getClientRects().length > 0);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      e.preventDefault(); last?.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      e.preventDefault(); first?.focus();
    }
  });
  closeButton.addEventListener('click', close);
  let pointerStartedOutside = false;
  function outside(e) {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  }
  dialog.addEventListener('pointerdown', e => { pointerStartedOutside = outside(e); });
  dialog.addEventListener('click', e => {
    if (e.target === dialog && pointerStartedOutside && outside(e)) close();
  });
  dialog.querySelector('.work-dialog-prev').addEventListener('click', () => { if (!closing) setContent(current - 1); });
  dialog.querySelector('.work-dialog-next').addEventListener('click', () => { if (!closing) setContent(current + 1); });
  motion.addEventListener('change', () => {
    if (motion.matches) { stopAnimation(); if (closing && dialog.open) dialog.close(); }
  });
  addEventListener('resize', () => { stopAnimation(); if (closing && dialog.open) dialog.close(); }, { passive: true });

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => open(index, button));
    button.disabled = false;
    document.getElementById(button.getAttribute('aria-describedby')).hidden = true;
  });
  document.documentElement.classList.add('work-enhanced');
})();
