const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { createHash } = require('node:crypto');
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

const root = path.resolve(__dirname, '..');
const results = path.join(root, 'test-results');
const report = { checks: [], browsers: [], violations: [], metrics: {} };
let browser, server;
function passed(name) { report.checks.push(name); console.log('PASS', name); }
const pdfName = 'Lebenslauf-Dirk-Herrmann.pdf';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

(async () => {
  await fs.rm(results, { recursive: true, force: true });
  await fs.mkdir(results, { recursive: true });
  const config = JSON.parse(await fs.readFile(path.join(root, 'vercel.json'), 'utf8'));
  const pdfBytes=await fs.readFile(path.join(root,'assets/lebenslauf-dirk-herrmann.pdf'));
  const pdfHash=digest(pdfBytes);
  const redaction=JSON.parse(await fs.readFile(path.join(root,'docs/qa/cv-download/redaction.json'),'utf8'));
  assert.equal(pdfHash,redaction.sha256,'PDF must match the reviewed phone-free version');
  assert.equal(redaction.phone_absent_in_extracted_text,true);
  report.pdf={filename:pdfName,bytes:pdfBytes.length,sha256:pdfHash};
  // Test the packaged site with the real deployment CSP, not just permissive localhost.
  server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(root, 'dist', '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(path.join(root, 'dist') + path.sep)) { res.writeHead(403).end(); return; }
      const body = await fs.readFile(file);
      for (const h of config.headers[0].headers) res.setHeader(h.key, h.value);
      const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff':'font/woff', '.woff2':'font/woff2', '.pdf':'application/pdf' };
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      for(const rule of config.headers.filter(rule=>rule.source===pathname)){
        for(const h of rule.headers)res.setHeader(h.key,h.value);
      }
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
  async function verifyPDFDownload(page,label) {
    const link=page.getByRole('link',{name:'Lebenslauf herunterladen',exact:true});
    assert.equal(await link.isVisible(),true);
    assert.equal(await link.getAttribute('download'),pdfName);
    const href=await link.getAttribute('href');
    if(href.startsWith('data:'))assert.equal(href.startsWith('data:application/pdf;base64,'),true);
    else {
      assert.equal(href,'assets/lebenslauf-dirk-herrmann.pdf');
      const response=await page.request.get(new URL(href,base).href);
      assert.equal(response.status(),200);
      assert.match(response.headers()['content-type'],/^application\/pdf/);
      assert.equal(response.headers()['content-disposition'],`attachment; filename="${pdfName}"`);
      assert.equal(digest(await response.body()),pdfHash);
    }
    const [download]=await Promise.all([page.waitForEvent('download'),link.click()]);
    assert.equal(await download.failure(),null);
    assert.equal(download.suggestedFilename(),pdfName);
    const downloaded=await fs.readFile(await download.path());
    assert.equal(downloaded.subarray(0,5).toString(),'%PDF-');
    assert.equal(digest(downloaded),pdfHash);
    passed(`${label}: echter PDF-Download mit korrektem Dateinamen und SHA-256`);
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
    assert.deepEqual(await page.locator('.hero-portrait img').evaluate(i=>[i.naturalWidth,i.naturalHeight]),[1000,667]);
    assert.equal(await page.locator('main').innerText().then(text=>/Studium|Marketing Management|Fachlicher Einstieg/.test(text)),false);
    assert.deepEqual(await page.locator('.career-line h3').allTextContents(),['Recruiting Guru','EKS Montage GmbH']);
    assert.equal(await page.locator('.hero-deck').textContent(),'Strategisch im Kopf. Kreativ in der Umsetzung. Ich verbinde Marketing, digitale Ideen und Projektarbeit – mit dem Anspruch, Dinge wirklich voranzubringen.');
    const generalText=await page.locator('#ueber-mich, #erfahrung').allTextContents();
    assert.equal(/Recruiting Guru|EKS Montage|10[–-]15/.test(generalText.join(' ')),false);
    assert.equal((await page.locator('.intro-photo-note').textContent()).includes('YES'),false);
    const illustrationSelector='.case-illustration, .process-trigger .work-illustration';
    await page.waitForFunction(selector=>[...document.querySelectorAll(selector)].length===7 && [...document.querySelectorAll(selector)].every(svg=>svg.getBBox().width>0),illustrationSelector);
    const illustrationSources=await page.locator(illustrationSelector).evaluateAll(els=>els.map(svg=>svg.querySelector('use').getAttribute('href')));
    assert.equal(new Set(illustrationSources).size,7);

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
    const pdfLink=page.getByRole('link',{name:'Lebenslauf herunterladen',exact:true});
    assert.equal(await pdfLink.getAttribute('href'),'assets/lebenslauf-dirk-herrmann.pdf');
    assert.equal(await page.locator('#cv-note,#cv-info').count(),0);
    if(width===390||width===1440)await verifyPDFDownload(page,`${width}px Website`);
    await page.getByRole('link',{name:'Mehr über mich'}).click();
    await page.waitForTimeout(1200);
    assert.equal(await page.evaluate(()=>location.hash),'#ueber-mich');
    for (const id of ['ueber-mich','kompetenzen','erfahrung','arbeitsweise','kontakt']) {
      await instantScroll(page,'#'+id);
      await noOverflow(page);
      if (width!==320) await page.screenshot({path:path.join(results,`${id}-${width}.png`)});
    }
    const stepNames=['01 / VERSTEHEN','02 / HINTERFRAGEN','03 / ENTWICKELN','04 / UMSETZEN'];
    const dialog=page.getByRole('dialog');
    for (let step=0; step<4; step++) {
      const button=page.locator(`[data-step="${step}"]`);
      await button.focus(); await page.keyboard.press('Enter');
      await dialog.waitFor({state:'visible'});
      assert.equal(await button.getAttribute('aria-expanded'),'true');
      assert.equal(await page.locator('[data-step][aria-expanded="true"]').count(),1);
      assert.equal(await page.locator('#process-name').textContent(),stepNames[step]);
      assert.equal(await page.locator('#process-description').textContent(),await page.locator(`#work-description-${step}`).textContent());
      assert.equal(await page.evaluate(()=>document.activeElement.closest('dialog')?.open),true);
      assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
      if(step===0){
        await page.waitForTimeout(450);
        if(width!==320)await page.screenshot({path:path.join(results,`work-card-${width}.png`)});
        for(let i=0;i<6;i++){
          await page.keyboard.press(i===0?'Shift+Tab':'Tab');
          assert.equal(await page.evaluate(()=>document.activeElement.closest('dialog')?.open),true);
        }
        if(width===390||width===1440)await audit(page,`${width}px geöffnete Arbeitsweise-Karte`);
      }
      if(step===3){
        await page.getByRole('button',{name:'Nächster Schritt',exact:true}).click();
        assert.equal(await page.locator('#process-name').textContent(),stepNames[0]);
        await page.getByRole('button',{name:'Vorheriger Schritt',exact:true}).click();
        assert.equal(await page.locator('#process-name').textContent(),stepNames[3]);
      }
      if(step===1)await page.getByRole('button',{name:'Details schließen',exact:true}).click();
      else if(step===2)await page.mouse.click(2,80);
      else await page.keyboard.press('Escape');
      await page.locator('#work-step-dialog').waitFor({state:'hidden'});
      assert.equal(await page.locator('[data-step][aria-expanded="true"]').count(),0);
      assert.equal(await button.evaluate(el=>el===document.activeElement),true);
      assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');
    }
    passed(`${width}px: vier Expandable Cards, Fokusbegrenzung/-rückgabe, Escape, Schließen, Hintergrundklick und Schrittwechsel`);
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

  for(const mode of ['initial-reduced','no-observer','no-canvas','no-dialog']) {
    const init=mode==='no-observer'?()=>{delete window.IntersectionObserver;}:mode==='no-canvas'?()=>{HTMLCanvasElement.prototype.getContext=()=>null;}:mode==='no-dialog'?()=>{HTMLDialogElement.prototype.showModal=undefined;}:undefined;
    const {page,context}=await open({viewport:{width:1440,height:900},reducedMotion:mode==='initial-reduced'?'reduce':'no-preference'},init);
    if(mode==='initial-reduced'||mode==='no-observer') {
      assert.equal(await page.locator('.cascade-letter').evaluateAll(letters=>letters.every(l=>getComputedStyle(l).opacity==='1')),true);
      assert.equal(await page.locator('[data-reveal]').evaluateAll(els=>els.every(el=>getComputedStyle(el).opacity==='1')),true);
    }
    assert.equal(await page.locator('.hero-portrait img').isVisible(),true);
    if(mode==='no-dialog')assert.equal(await page.locator('.process-step-description').evaluateAll(els=>els.every(el=>!el.hidden)),true);
    if(mode==='initial-reduced'){
      await page.locator('[data-step="0"]').click();
      assert.equal(await page.getByRole('dialog').isVisible(),true);
      assert.equal(await page.locator('#work-step-dialog').evaluate(el=>el.getAnimations().length),0);
      await page.keyboard.press('Escape');
      await page.locator('#work-step-dialog').waitFor({state:'hidden'});
    }
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
    assert.equal(await page.locator('.process-step-description').evaluateAll(els=>els.length===4 && els.every(el=>!el.hidden)),true);
    await verifyPDFDownload(page,`${viewport.width}px Website ohne JavaScript`);
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
  for(const width of [390,1440]){
    const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();
    page.on('pageerror',e=>failures.push(e.message));
    page.on('console',m=>{if(m.type()==='error')failures.push(m.text());});
    page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
    await page.setContent(await fs.readFile(path.join(root,'vorschau/Dirk_Herrmann_V6A_Vorschau.html'),'utf8'),{waitUntil:'load'});
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('main').innerText().then(text=>/Studium|Marketing Management/.test(text)),false);
    assert.equal(await page.locator('.case-illustration, .process-trigger .work-illustration').evaluateAll(els=>els.length===7 && els.every(svg=>svg.getBBox().width>0)),true);
    assert.deepEqual(await page.locator('.hero-portrait img').evaluate(i=>[i.naturalWidth,i.naturalHeight]),[1000,667]);
    await page.locator('[data-step="2"]').click();
    assert.equal(await page.getByRole('dialog').isVisible(),true);
    assert.equal(await page.locator('#process-name').textContent(),'03 / ENTWICKELN');
    await page.keyboard.press('Escape');
    await page.locator('#work-step-dialog').waitFor({state:'hidden'});
    await verifyPDFDownload(page,`${width}px Einzeldatei`);
    passed(`${width}px: aktuelle Einzeldatei enthält das freigegebene Hero-Foto und funktionsfähige Arbeitsweise-Karten, ohne Netzwerkanfragen`);
    await context.close();
  }
  {
    const context=await browser.newContext({viewport:{width:390,height:900},javaScriptEnabled:false}),page=await context.newPage();
    await page.setContent(await fs.readFile(path.join(root,'vorschau/Dirk_Herrmann_V6A_Vorschau.html'),'utf8'),{waitUntil:'load'});
    await verifyPDFDownload(page,'Einzeldatei ohne JavaScript');
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
