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
  const easing = getComputedStyle(dialog).getPropertyValue('--ease').trim();
  let current = 0, invoker = null, animation = null, closing = false, savedStyles = null, animateSession = false;

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
  function open(index, button, pointerAction) {
    if (dialog.open) return;
    invoker = button;
    closing = false;
    animateSession = pointerAction;
    dialog.toggleAttribute('data-instant', !animateSession || motion.matches);
    setContent(index);
    lockScroll();
    try { dialog.showModal(); } catch { restoreScroll(); return; }
    if (animateSession && !motion.matches && typeof dialog.animate === 'function') {
      animation = dialog.animate([
        { transform: cardTransform(), opacity: .4 },
        { transform: 'translate(0,0) scale(1,1)', opacity: 1 }
      ], { duration: 260, easing });
    }
  }
  function close(pointerAction = true) {
    if (!dialog.open || closing) return;
    closing = true;
    // Capture the visible frame before cancelling: a quick close must not jump
    // to the fully expanded card before it returns to its trigger.
    const style = getComputedStyle(dialog);
    const from = { transform: style.transform, opacity: style.opacity };
    stopAnimation();
    if (!pointerAction || !animateSession || motion.matches || document.hidden || typeof dialog.animate !== 'function') {
      dialog.close(); return;
    }
    animation = dialog.animate([
      from,
      { transform: cardTransform(), opacity: 0 }
    ], { duration: 160, easing, fill: 'forwards' });
    const leaving = animation;
    leaving.finished.then(() => { if (animation === leaving && dialog.open) dialog.close(); }).catch(() => {});
  }
  dialog.addEventListener('close', () => {
    stopAnimation();
    closing = false;
    buttons.forEach(button => button.setAttribute('aria-expanded', 'false'));
    restoreScroll();
    invoker?.focus({ preventScroll: true });
  });
  dialog.addEventListener('cancel', e => { e.preventDefault(); close(false); });
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
  closeButton.addEventListener('click', e => close(e.detail > 0));
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
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopAnimation(); if (closing && dialog.open) dialog.close(); }
  });
  addEventListener('resize', () => { stopAnimation(); if (closing && dialog.open) dialog.close(); }, { passive: true });

  buttons.forEach((button, index) => {
    button.addEventListener('click', e => open(index, button, e.detail > 0));
    button.disabled = false;
    document.getElementById(button.getAttribute('aria-describedby')).hidden = true;
  });
  document.documentElement.classList.add('work-enhanced');
})();
