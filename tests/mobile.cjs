const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const {createHash} = require('node:crypto');
const {chromium} = require('playwright');
const {AxeBuilder} = require('@axe-core/playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'test-results/mobile');
const report = {engine: 'Chromium with synthesized touch; not physical iOS/Safari', checks: [], errors: [], axeScans: []};
let server, browser;
const pass = name => { report.checks.push(name); console.log('PASS', name); };
const sha = value => createHash('sha256').update(value).digest('hex');
async function at(page, selector) {
  await page.locator(selector).first().evaluate(el => scrollTo({top: scrollY + el.getBoundingClientRect().top - 100, behavior: 'instant'}));
  await page.waitForTimeout(350);
}
async function swipe(page, from, to) {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: from.x, y: from.y}]});
  for (let i = 1; i <= 12; i++) {
    await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: from.x + (to.x - from.x) * i / 12, y: from.y + (to.y - from.y) * i / 12}]});
    await page.waitForTimeout(22);
  }
  await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
  await session.detach();
  await page.waitForTimeout(650);
}
const hasInk = canvas => canvas.evaluate(c => {
  const pixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  return pixels.some((value, i) => i % 4 === 3 && value > 0);
});

(async () => {
  await fs.mkdir(output, {recursive: true});
  const config = JSON.parse(await fs.readFile(path.join(root, 'vercel.json'), 'utf8'));
  server = http.createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      const file = path.resolve(root, 'dist', '.' + (pathname === '/' ? '/index.html' : decodeURIComponent(pathname)));
      if (!file.startsWith(path.join(root, 'dist') + path.sep)) {res.writeHead(403).end(); return;}
      const types = {'.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff'};
      for (const header of config.headers[0].headers) res.setHeader(header.key, header.value);
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      res.end(await fs.readFile(file));
    } catch {res.writeHead(404).end();}
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox', '--enable-unsafe-swiftshader']});
  const base = `http://127.0.0.1:${server.address().port}`;
  report.browserVersion = browser.version();
  async function open(width, extra = {}) {
    const context = await browser.newContext({viewport: {width, height: 844}, hasTouch: true, isMobile: true, deviceScaleFactor: 2, ...extra});
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    page.on('console', m => {if (m.type() === 'error') report.errors.push(m.text());});
    page.on('response', r => {if (r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`);});
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    return {context, page};
  }
  for (const width of [320, 375, 390, 430]) {
    const {context, page} = await open(width);
    assert.equal(await page.locator('use[href^="assets/"]').count(), 0);
    const art = page.locator('.case-illustration, .process-trigger .work-illustration');
    assert.equal(await art.count(), 7);
    assert.ok(await art.evaluateAll(items => items.every(svg => svg.querySelector('path,rect,circle,ellipse,polygon') && svg.getBBox().width > 0)));
    assert.ok(await page.locator('.hero-actions a, #menu-btn').evaluateAll(items => items.every(el => el.getBoundingClientRect().height >= 44)));
    assert.ok(await page.locator('.intro-copy .sub, .case-middle p, .career-line p').evaluateAll(items => items.every(el => parseFloat(getComputedStyle(el).fontSize) >= 16)));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    pass(`${width}px: seven inline motifs, readable body copy, 44px controls and no horizontal overflow`);

    for (let i = 0; i < 3; i++) {
      const panel = page.locator('.split-panel').nth(i);
      const openButton = panel.locator('.split-open');
      await openButton.scrollIntoViewIfNeeded();
      assert.equal(await panel.locator('.split-front').evaluate(el => getComputedStyle(el).display), 'block');
      await openButton.tap();
      await page.waitForTimeout(300);
      assert.equal(await openButton.getAttribute('aria-expanded'), 'true');
      assert.equal(await panel.locator('.split-back').evaluate(el => el.inert), false);
      assert.equal(await panel.locator('h3').evaluate(el => el === document.activeElement), true);
      if (width === 390) {
        const scan = await new AxeBuilder({page}).include('.split-panel.is-open').withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();
        report.axeScans.push({label: `Open competency ${i + 1}`, violations: scan.violations});
        assert.deepEqual(scan.violations, [], `Open competency ${i + 1}: accessible text and controls`);
      }
      if (width === 390 && i === 0) await panel.screenshot({path: path.join(output, 'competency-open.png')});
      await panel.locator('.split-close').tap();
      await page.waitForTimeout(300);
      assert.equal(await openButton.getAttribute('aria-expanded'), 'false');
      assert.equal(await openButton.evaluate(el => el === document.activeElement), true);
    }
    pass(`${width}px: all three competency cards flip on touch and return focus correctly`);

    await at(page, '.cases-stage');
    const dots = page.locator('.case-pagination button');
    await dots.nth(0).tap();
    await page.waitForTimeout(500);
    assert.equal(await page.locator('.case-prev').isDisabled(), true);
    await page.locator('.case-next').tap();
    await page.waitForFunction(() => document.querySelectorAll('.case-pagination button')[1].getAttribute('aria-current') === 'true');
    await dots.nth(2).tap();
    await page.waitForFunction(() => document.querySelectorAll('.case-pagination button')[2].getAttribute('aria-current') === 'true');
    assert.equal(await page.locator('.case-next').isDisabled(), true);
    assert.ok(await page.locator('.case-card').evaluateAll(items => items.every(el => el.scrollHeight <= el.clientHeight + 1)));
    assert.ok(await page.locator('.process-label strong').evaluateAll(items => items.every(el => el.scrollWidth <= el.clientWidth + 1)));
    pass(`${width}px: all experience cards reachable, navigation reflects position, no clipped copy or workflow titles`);

    if (width === 390) {
      // A painted-vs-hidden comparison catches empty image boxes, not just SVG layout.
      for (let i = 0; i < 7; i++) {
        const svg = art.nth(i);
        await svg.scrollIntoViewIfNeeded();
        const box = await svg.boundingBox();
        const painted = await page.screenshot({clip: box});
        await svg.evaluate(el => {el.style.visibility = 'hidden';});
        const empty = await page.screenshot({clip: box});
        await svg.evaluate(el => {el.style.removeProperty('visibility');});
        assert.notEqual(sha(painted), sha(empty), `Illustration ${i + 1} must paint visible pixels`);
      }
      pass('390px: all seven illustrations paint visible pixels rather than empty SVG boxes');
      await at(page, '.cases-stage');
      await dots.nth(0).tap(); await page.waitForTimeout(500);
      await swipe(page, {x: width - 60, y: 190}, {x: 60, y: 190});
      assert.ok(await page.locator('.cases-stage').evaluate(el => el.scrollLeft > 100));
      const beforeY = await page.evaluate(() => scrollY);
      await swipe(page, {x: 190, y: 350}, {x: 190, y: 180});
      assert.ok(await page.evaluate(() => scrollY) > beforeY + 50, 'A vertical swipe across the carousel must scroll the page');
      pass('390px: synthesized horizontal swipe changes cards; vertical swipe across the same surface scrolls the page');

      await at(page, '.split-open');
      const splitY = await page.evaluate(() => scrollY);
      await swipe(page, {x: 190, y: 300}, {x: 190, y: 170});
      assert.ok(await page.evaluate(() => scrollY) > splitY + 40);
      assert.equal(await page.locator('.split-panel.is-open').count(), 0);
      pass('390px: vertical swipe across a competency card scrolls without accidentally opening it');

      for (const selector of ['.hero-portrait', '.intro-picture']) {
        await at(page, selector);
        const canvas = page.locator(`${selector} .ripple-fallback`);
        await page.locator(selector).tap();
        await page.waitForTimeout(100);
        assert.equal(await hasInk(canvas), true);
        assert.equal(await page.locator(`${selector} .portrait-ripple.ready`).count(), 0);
        await page.waitForTimeout(1900);
        assert.equal(await hasInk(canvas), false);
        await at(page, selector);
        const y = await page.evaluate(() => scrollY);
        await swipe(page, {x: 190, y: 280}, {x: 190, y: 150});
        assert.ok(await page.evaluate(() => scrollY) > y + 40);
        assert.equal(await hasInk(canvas), false, 'A scroll gesture must not trigger a portrait ripple');
      }
      pass('390px: tap ripples on both portraits, no WebGL startup on touch, no ripple or scroll blocking during swipes');

      for (let i = 0; i < 4; i++) {
        const trigger = page.locator('.process-trigger').nth(i);
        await trigger.scrollIntoViewIfNeeded();
        const y = await page.evaluate(() => scrollY);
        await trigger.tap(); await page.waitForTimeout(300);
        assert.equal(await page.locator('.work-dialog').isVisible(), true);
        assert.ok(await page.locator('.work-dialog-visual svg').evaluate(el => el.getBBox().width > 0 && el.querySelector('path') !== null));
        if (i === 0) await page.screenshot({path: path.join(output, 'workflow-dialog.png')});
        await page.locator('.work-dialog-close').tap();
        await page.waitForFunction(() => document.body.style.overflow !== 'hidden');
        assert.ok(Math.abs(await page.evaluate(() => scrollY) - y) < 2);
        assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
      }
      pass('390px: four workflow dialogs open by tap with visible art, restore focus and preserve page position');

      await at(page, '.split-open'); await page.locator('.split-open').first().tap();
      await page.setViewportSize({width: 844, height: 390});
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('split-touch')), false);
      assert.equal(await page.locator('.split-back[aria-hidden="true"]').count(), 0);
      await page.setViewportSize({width: 390, height: 844});
      assert.equal(await page.locator('.split-open').first().getAttribute('aria-expanded'), 'false');
      pass('390px: portrait/landscape changes restore readable faces and reset touch controls safely');

      for (const [name, selector] of [['competencies', '#kompetenzen'], ['experience', '.cases-stage'], ['workflow', '#arbeitsweise'], ['hero', '#start']]) {
        await at(page, selector);
        await page.screenshot({path: path.join(output, `${name}-390.png`)});
      }
    }
    await context.close();
  }
  {
    const {context, page} = await open(390, {reducedMotion: 'reduce'});
    assert.equal(await page.locator('html').evaluate(el => el.classList.contains('split-touch')), false);
    assert.ok(await page.locator('.split-back').evaluateAll(items => items.every(el => !el.inert && el.getAttribute('aria-hidden') !== 'true')));
    await at(page, '.hero-portrait'); await page.locator('.hero-portrait').tap();
    assert.equal(await hasInk(page.locator('.hero-portrait .ripple-fallback')), false);
    await at(page, '.cases-stage'); await page.locator('.case-pagination button').nth(2).tap();
    assert.ok(await page.locator('.cases-stage').evaluate(el => el.scrollLeft > 100));
    pass('Reduced motion: competencies remain open, tap ripples rest, carousel controls still work');
    await context.close();
  }
  assert.deepEqual(report.errors, []);
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`\n${report.checks.length} mobile/touch checks passed.`);
})().catch(async error => {
  console.error(error);
  report.failure = String(error.stack || error);
  await fs.mkdir(output, {recursive: true});
  await fs.writeFile(path.join(output, 'failure.json'), JSON.stringify(report, null, 2) + '\n');
  process.exitCode = 1;
}).finally(async () => {await browser?.close(); if (server) await new Promise(resolve => server.close(resolve));});
