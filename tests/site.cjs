const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

const root = path.resolve(__dirname, '..');
const results = path.join(root, 'test-results');
const report = { checks: [], browsers: [], violations: [], metrics: {} };
let browser, server;
function passed(name) { report.checks.push(name); console.log('PASS', name); }
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  await fs.rm(results, { recursive: true, force: true });
  await fs.mkdir(results, { recursive: true });
  const config = JSON.parse(await fs.readFile(path.join(root, 'vercel.json'), 'utf8'));
  // Test the packaged site with the real deployment CSP, not just permissive localhost.
  server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(root, 'dist', '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(path.join(root, 'dist') + path.sep)) { res.writeHead(403).end(); return; }
      const body = await fs.readFile(file);
      for (const h of config.headers[0].headers) res.setHeader(h.key, h.value);
      const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff':'font/woff', '.woff2':'font/woff2' };
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      res.writeHead(200).end(body);
    } catch { res.writeHead(404).end('Not found'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true,
    args: ['--no-sandbox', '--enable-unsafe-swiftshader']
  });
  report.browsers.push(await browser.version());
  const failures = [], external = [];
  async function open(options = {}, init, beforeLoad) {
    const context = await browser.newContext(options);
    context.setDefaultTimeout(10000);
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.qaMetrics={cls:0,lcp:0,heroFrames:0};
      new PerformanceObserver(list=>list.getEntries().forEach(e=>{
        if(!e.hadRecentInput)window.qaMetrics.cls+=e.value;
      })).observe({type:'layout-shift',buffered:true});
      new PerformanceObserver(list=>list.getEntries().forEach(e=>{
        window.qaMetrics.lcp=e.startTime;
      })).observe({type:'largest-contentful-paint',buffered:true});
      const draw=CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage=function(...args){
        if(this.canvas.id==='fluid')window.qaMetrics.heroFrames++;
        return draw.apply(this,args);
      };
    });
    page.on('pageerror', e => failures.push(e.message));
    page.on('console', m => { if (m.type() === 'error') failures.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });
    page.on('request', r => { if (!r.url().startsWith(base)) external.push(r.url()); });
    if (init) await page.addInitScript(init);
    if (beforeLoad) await beforeLoad(page);
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    return { page, context };
  }
  async function instantScroll(page, selector, offset = 90) {
    await page.locator(selector).evaluate((el, offset) => scrollTo({ top: scrollY + el.getBoundingClientRect().top - offset, behavior: 'instant' }), offset);
    await page.waitForTimeout(1000);
  }
  async function noOverflow(page) {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  async function audit(page, label) {
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();
    const violations = scan.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, failureSummary: n.failureSummary })) }));
    report.violations.push({ label, violations });
    assert.deepEqual(violations, [], label);
    passed(`${label}: axe WCAG A/AA, keine automatischen Verstöße`);
  }

  for (const width of [390,768,1440,320]) {
    const { page, context } = await open({ viewport:{width,height:900}, hasTouch:width===390, isMobile:width===390 });
    report.metrics[width]=await page.evaluate(()=>({...window.qaMetrics,resources:performance.getEntriesByType('resource').length}));
    await noOverflow(page);
    assert.equal(await page.getByRole('heading', { level:1, name:'Klar denken. Weiter machen.', exact:true }).count(), 1);
    const photoSources = await page.locator('img[src$=".webp"]').evaluateAll(images => images.map(i => i.getAttribute('src')));
    assert.deepEqual(photoSources, ['assets/hero-dirk.webp','assets/about-dirk.webp']);
    assert.equal(await page.evaluate(() => document.fonts.check('800 16px "DM Sans"') && document.fonts.check('italic 16px "DM Serif Display"')), true);
    await page.screenshot({path:path.join(results,`hero-${width}.png`)});
    if (width===390) {
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('.skip-link').evaluate(el => el===document.activeElement), true);
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('main').evaluate(el => el===document.activeElement), true);
    }
    if (width<=780) {
      const button = page.locator('#menu-btn');
      await button.focus(); await page.keyboard.press('Enter');
      assert.equal(await button.getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Tab');
      assert.equal(await page.getByRole('navigation').getByRole('link',{name:'Über mich'}).evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Escape');
      assert.equal(await button.getAttribute('aria-expanded'),'false');
      assert.equal(await button.getAttribute('aria-label'),'Menü öffnen');
      assert.equal(await button.evaluate(el=>el===document.activeElement),true);
      await button.click();
      await page.getByRole('navigation').getByRole('link',{name:'Kontakt'}).click();
      assert.equal(await button.getAttribute('aria-expanded'),'false');
      assert.equal(await page.locator('#kontakt').evaluate(el=>el===document.activeElement),true);
      passed(`${width}px: mobiles Menü, Tastatur, Escape und Kontaktanker`);
    }
    await instantScroll(page,'#start',76);
    await page.getByRole('button',{name:'Lebenslauf-PDF · folgt'}).click();
    assert.equal(await page.locator('#cv-note').isVisible(),true);
    assert.equal(await page.locator('#cv-info').getAttribute('aria-expanded'),'true');
    await page.locator('#cv-info').click();
    assert.equal(await page.locator('#cv-note').isVisible(),false);
    await page.getByRole('link',{name:'Mehr über mich'}).click();
    await page.waitForTimeout(1200);
    assert.equal(await page.evaluate(()=>location.hash),'#ueber-mich');
    for (const id of ['ueber-mich','kompetenzen','erfahrung','arbeitsweise','kontakt']) {
      await instantScroll(page,'#'+id);
      await noOverflow(page);
      if (width!==320) await page.screenshot({path:path.join(results,`${id}-${width}.png`)});
    }
    for (let step=0; step<4; step++) {
      const button=page.locator(`[data-step="${step}"]`);
      await button.focus(); await page.keyboard.press('Enter');
      assert.equal(await button.getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('[data-step][aria-pressed="true"]').count(),1);
      assert.equal(await page.locator('#process-name').textContent(),['01 / VERSTEHEN','02 / HINTERFRAGEN','03 / ENTWICKELN','04 / UMSETZEN'][step]);
    }
    if (width<=780) {
      await instantScroll(page,'#erfahrung');
      await page.locator('.cases-stage').focus();
      for(let i=0;i<8;i++) await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(300);
      assert.equal(await page.locator('.cases-stage').evaluate(el=>el.scrollLeft>0),true);
      assert.equal(await page.locator('.case-card').evaluateAll(cards=>cards.every(c=>c.scrollHeight<=c.clientHeight+1)),true);
      await page.locator('.cases-stage').evaluate(el=>{el.scrollLeft=el.scrollWidth;});
      await page.waitForTimeout(500);
      await page.screenshot({path:path.join(results,`cases-last-${width}.png`)});
    }
    await page.waitForFunction(()=>[...document.images].every(i=>i.complete && i.naturalWidth>0));
    if (width===1440) {
      const pause=page.locator('.hero-motion-toggle');
      await instantScroll(page,'#start',76);
      await pause.click(); assert.equal(await pause.getAttribute('aria-pressed'),'true');
      await page.getByRole('button',{name:'Hintergrundanimation fortsetzen'}).click();
      assert.equal(await pause.getAttribute('aria-pressed'),'false');
      // WebGL ripples on both photos, followed by full return to the untouched image.
      for (const selector of ['.hero-portrait','.intro-picture']) {
        await instantScroll(page,selector,150);
        const box=await page.locator(selector).boundingBox();
        await page.mouse.move(box.x+box.width*.45,box.y+box.height*.45);
        await page.mouse.move(box.x+box.width*.60,box.y+box.height*.55,{steps:12});
        await page.waitForTimeout(100);
        assert.equal(await page.locator(`${selector} .portrait-ripple`).evaluate(c=>c.classList.contains('ready')),true);
        assert.equal(await page.locator(`${selector} .portrait-ripple`).evaluate(c=>c.getContext('webgl').getError()),0);
        await page.screenshot({path:path.join(results,selector.includes('hero')?'ripple-hero.png':'ripple-about.png')});
        await page.mouse.move(10,100); await page.waitForTimeout(1900);
        assert.equal(await page.locator(`${selector} .portrait-ripple`).evaluate(c=>c.classList.contains('ready')),false);
      }
      passed('Beide Fotos: WebGL-Ripple reagiert, rendert fehlerfrei und stoppt im Ruhezustand');
      // Sample scroll positions while the stages are actually pinned.
      async function progress(selector, p) {
        await page.locator(selector).evaluate((el,p)=>{
          const r=el.getBoundingClientRect();
          scrollTo({top:scrollY+r.top-76+p*(r.height-(innerHeight-76)),behavior:'instant'});
        },p);
        await page.waitForTimeout(200);
      }
      await progress('.split-scroll',0);
      const start=await page.locator('.split-panel').first().evaluate(el=>getComputedStyle(el).transform);
      await progress('.split-scroll',1);
      const finish=await page.locator('.split-panel').first().evaluate(el=>getComputedStyle(el).transform);
      assert.notEqual(start,finish);
      assert.equal(await page.locator('.meter>span').evaluate(el=>el.style.width),'100%');
      await page.screenshot({path:path.join(results,'split-complete-1440.png')});
      for (const [p,index] of [[0,1],[.48,2],[.95,3]]) {
        await progress('.cases-scroll',p);
        assert.equal(await page.locator('.cases-counter>span').textContent(),`0${index} / 03`);
        assert.equal(await page.locator('.case-card').nth(index-1).evaluate(el=>Number(getComputedStyle(el).opacity)),1);
        await page.screenshot({path:path.join(results,`case-${index}-1440.png`)});
      }
      assert.equal(await page.locator('.case-card[aria-hidden="true"]').count(),0);
      passed('Desktop: Split-Flip endet lesbar, Flip Stack erreicht alle drei Erfahrungsfelder');
      await instantScroll(page,'#kontakt');
      const before=await page.evaluate(()=>window.qaMetrics.heroFrames);
      await page.waitForTimeout(350);
      assert.equal(await page.evaluate(()=>window.qaMetrics.heroFrames),before);
      passed('Hero zeichnet außerhalb des Sichtfelds keine weiteren Frames');
      await audit(page,'Desktop normale Bewegung');
      await page.emulateMedia({reducedMotion:'reduce'}); await page.waitForTimeout(100);
      assert.equal(await page.locator('.portrait-ripple').first().isVisible(),false);
      assert.equal(await page.locator('.case-card').evaluateAll(cards=>cards.every(c=>getComputedStyle(c).opacity==='1' && getComputedStyle(c).position==='relative')),true);
      assert.equal(await page.locator('.cascade-letter').evaluateAll(letters=>letters.every(l=>getComputedStyle(l).opacity==='1')),true);
      await audit(page,'Desktop reduzierte Bewegung');
      passed('Nachträgliches prefers-reduced-motion: statische, vollständig lesbare Inhalte');
    }
    if (width===390) {
      await audit(page,'Smartphone normale Bewegung');
      await page.emulateMedia({reducedMotion:'reduce'});
      await audit(page,'Smartphone reduzierte Bewegung');
    }
    passed(`${width}px: kein horizontaler Überlauf, Bilder, Überschriften, CTAs, vier Arbeitsweise-Schritte`);
    await context.close();
  }

  for (const mode of ['data-url','plain-link']) {
    const {page,context}=await open({viewport:{width:1440,height:900}},undefined,async page=>{
      await page.route(base+'/',async route=>{
        const response=await route.fetch();
        let body=await response.text();
        if(mode==='data-url') body=body.replace('data-cv-url=""','data-cv-url="assets/lebenslauf-dirk-herrmann.pdf"');
        else body=body.replace(/<button class="hero-cv"[^>]*>.*?<\/button>/,'<a class="hero-cv" href="assets/lebenslauf-dirk-herrmann.pdf" download>Lebenslauf herunterladen ↓</a>');
        await route.fulfill({response,body});
      });
    });
    const link=page.getByRole('link',{name:'Lebenslauf herunterladen'});
    assert.equal(await link.getAttribute('href'),'assets/lebenslauf-dirk-herrmann.pdf');
    assert.notEqual(await link.getAttribute('download'),null);
    assert.equal(await page.locator('.scroll-enhanced').count(),1);
    passed(`Spätere PDF-Verknüpfung (${mode}): echter Download-Link ohne erfundene PDF`);
    await context.close();
  }
  for(const mode of ['initial-reduced','no-observer','no-canvas']) {
    const init=mode==='no-observer'?()=>{delete window.IntersectionObserver;}:mode==='no-canvas'?()=>{HTMLCanvasElement.prototype.getContext=()=>null;}:undefined;
    const {page,context}=await open({viewport:{width:1440,height:900},reducedMotion:mode==='initial-reduced'?'reduce':'no-preference'},init);
    if(mode!=='no-canvas') {
      assert.equal(await page.locator('.cascade-letter').evaluateAll(letters=>letters.every(l=>getComputedStyle(l).opacity==='1')),true);
      assert.equal(await page.locator('[data-reveal]').evaluateAll(els=>els.every(el=>getComputedStyle(el).opacity==='1')),true);
    }
    assert.equal(await page.locator('.hero-portrait img').isVisible(),true);
    passed(`Fallback ${mode}: Bild sichtbar, keine Skriptfehler`);
    await context.close();
  }

  // No WebGL: test the visible 2D fallback on both originals.
  {
    const {page,context}=await open({viewport:{width:1440,height:900}},()=>{
      const original=HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:original.call(this,type,...args);};
    });
    for(const selector of ['.hero-portrait','.intro-picture']){
      await instantScroll(page,selector,150);
      const box=await page.locator(selector).boundingBox();
      await page.mouse.move(box.x+box.width*.4,box.y+box.height*.5);
      await page.mouse.move(box.x+box.width*.6,box.y+box.height*.6,{steps:8});
      await page.waitForTimeout(100);
      assert.equal(await page.locator(`${selector} .portrait-ripple.ready`).count(),0);
      assert.equal(await page.locator(`${selector} .ripple-fallback`).evaluate(c=>{
        const pixels=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
        return pixels.some((v,i)=>i%4===3 && v>0);
      }),true);
    }
    passed('WebGL deaktiviert: 2D-Ripple auf beiden Fotos, Originalbilder bleiben sichtbar');
    await context.close();
  }
  // Context loss must expose the HTML photo immediately, without a blank canvas.
  {
    const {page,context}=await open({viewport:{width:1440,height:900}});
    await page.locator('.hero-portrait').hover(); await page.waitForTimeout(150);
    const supported=await page.locator('.hero-portrait canvas').first().evaluate(c=>{
      const ext=c.getContext('webgl').getExtension('WEBGL_lose_context');
      if(ext){ext.loseContext();return true;}return false;
    });
    assert.equal(supported,true);
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.hero-portrait .portrait-ripple.ready').count(),0);
    assert.equal(await page.locator('.hero-portrait img').isVisible(),true);
    passed('WebGL-Kontextverlust: Originalfoto bleibt sichtbar');
    await context.close();
  }
  for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
    const {page,context}=await open({viewport,javaScriptEnabled:false});
    await noOverflow(page);
    assert.equal(await page.locator('[data-reveal]').evaluateAll(els=>els.every(el=>getComputedStyle(el).opacity==='1')),true);
    assert.equal(await page.locator('.split-back').evaluateAll(els=>els.every(el=>getComputedStyle(el).position==='relative')),true);
    assert.equal(await page.getByRole('navigation').getByRole('link',{name:'Über mich'}).isVisible(),true);
    assert.equal(await page.locator('.case-card').evaluateAll(els=>els.every(el=>getComputedStyle(el).position==='relative')),true);
    passed(`${viewport.width}px ohne JavaScript: Navigation, Überschriften, Kompetenzen, drei Erfahrungsfelder lesbar`);
    await context.close();
  }
  for(const viewport of [{width:844,height:390},{width:720,height:450}]){
    const {page,context}=await open({viewport});
    await noOverflow(page);
    assert.equal(await page.locator('.split-sticky').evaluate(el=>getComputedStyle(el).position),'static');
    passed(`${viewport.width}×${viewport.height}: Querformat / schmaler Zoom-Viewport ohne abgeschnittene Pin-Stufen`);
    await context.close();
  }
  assert.deepEqual(failures,[],'Browser errors / CSP violations / HTTP failures');
  assert.deepEqual(external,[],'Unexpected external requests');
  passed('Keine JavaScript-/Konsolenfehler, HTTP-Fehler, CSP-Verstöße oder externen Ressourcenanfragen');
  await fs.writeFile(path.join(results,'report.json'),JSON.stringify(report,null,2));
  console.log(`\n${report.checks.length} Prüfgruppen bestanden. Screenshots und Bericht: test-results/`);
})().catch(async error=>{
  console.error(error);
  await fs.writeFile(path.join(results,'failure.txt'),String(error.stack)).catch(()=>{});
  process.exitCode=1;
}).finally(async()=>{
  if(browser)await browser.close();
  if(server)await new Promise(resolve=>server.close(resolve));
});
