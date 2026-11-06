const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const {createHash} = require('node:crypto');
const {PNG} = require('pngjs');
const jsQR = require('jsqr');
const {chromium} = require('playwright');
const {AxeBuilder} = require('@axe-core/playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'test-results/card');
const report = {checks: [], errors: [], axe: []};
const pass = name => {report.checks.push(name);console.log('PASS',name);};
const sha = data => createHash('sha256').update(data).digest('hex');
let browser, server;
(async () => {
  await fs.mkdir(output, {recursive:true});
  const profile = JSON.parse(await fs.readFile(path.join(root,'site-profile.json'),'utf8'));
  const qr = PNG.sync.read(await fs.readFile(path.join(root,'assets/qr-dirk-herrmann.png')));
  assert.equal(jsQR(new Uint8ClampedArray(qr.data),qr.width,qr.height)?.data,profile.website);
  assert.ok(qr.width >= 900 && qr.width === qr.height);
  report.qr={url:profile.website,width:qr.width,height:qr.height};
  pass('QR-PNG independently decoded to the exact confirmed website URL');

  const bytes = await fs.readFile(path.join(root,'assets/dirk-herrmann.vcf'));
  const raw = bytes.toString('utf8');
  assert.ok(raw.endsWith('\r\n') && !raw.replaceAll('\r\n','').includes('\n'));
  assert.ok(raw.split('\r\n').every(line=>Buffer.byteLength(line)<=75));
  const lines = raw.replace(/\r\n[ \t]/g,'').trim().split('\r\n');
  assert.deepEqual(lines,[
    'BEGIN:VCARD','VERSION:3.0',`N:${profile.lastName};${profile.firstName};;;`,
    `FN:${profile.firstName} ${profile.lastName}`,`EMAIL;TYPE=INTERNET:${profile.email}`,
    `URL:${profile.website}`,`X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}`,'END:VCARD'
  ]);
  assert.equal(/^(?:TEL|ADR|BDAY|ORG|TITLE|PHOTO)[;:]/mi.test(raw),false);
  report.vcard={sha256:sha(bytes),bytes:bytes.length,phone:false,fields:['name','email','website','linkedin']};
  pass('vCard contains only the four approved contact fields, no phone/private address, and valid CRLF/folding');
  const preview = PNG.sync.read(await fs.readFile(path.join(root,'assets/dirk-herrmann-vorschau.png')));
  assert.deepEqual([preview.width,preview.height],[1200,630]);
  pass('Share image is a standard 1200×630 PNG');

  const config=JSON.parse(await fs.readFile(path.join(root,'vercel.json'),'utf8'));
  const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.vcf':'text/vcard; charset=utf-8'};
  server=http.createServer(async(req,res)=>{
    try{
      const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const file=path.resolve(root,'dist','.'+(pathname==='/'?'/index.html':pathname));
      if(!file.startsWith(path.join(root,'dist')+path.sep)){res.writeHead(403).end();return;}
      const body=await fs.readFile(file);
      for(const header of config.headers[0].headers)res.setHeader(header.key,header.value);
      res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
      for(const rule of config.headers.filter(rule=>rule.source===pathname))for(const header of rule.headers)res.setHeader(header.key,header.value);
      res.end(body);
    }catch{res.writeHead(404).end();}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  async function downloaded(page){
    const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Kontakt speichern',exact:true}).click()]);
    assert.equal(await download.failure(),null);
    assert.equal(download.suggestedFilename(),'Dirk-Herrmann.vcf');
    assert.equal(sha(await fs.readFile(await download.path())),sha(bytes));
  }
  for(const width of [320,390,1440]){
    const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===390,isMobile:width===390});
    const page=await context.newPage();
    page.on('pageerror',error=>report.errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());});
    page.on('response',response=>{if(response.status()>=400)report.errors.push(`${response.status()} ${response.url()}`);});
    await page.goto(base);await page.evaluate(()=>document.fonts.ready);
    const url=new URL('assets/dirk-herrmann-vorschau.png',profile.website).href;
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),profile.website);
    for(const [key,value] of [['og:url',profile.website],['og:type','website'],['og:image',url],['og:image:width','1200'],['og:image:height','630']]){
      assert.equal(await page.locator(`meta[property="${key}"]`).getAttribute('content'),value);
    }
    assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'),'summary_large_image');
    const image=await page.request.get(base+'/assets/dirk-herrmann-vorschau.png');
    assert.equal(image.status(),200);assert.match(image.headers()['content-type'],/^image\/png/);
    const response=await page.request.get(base+'/assets/dirk-herrmann.vcf');
    assert.match(response.headers()['content-type'],/^text\/vcard/);
    assert.equal(response.headers()['content-disposition'],'inline; filename="Dirk-Herrmann.vcf"');
    const link=page.getByRole('link',{name:'Kontakt speichern',exact:true});
    assert.equal(await link.getAttribute('download'),null,'Hosted vCard allows the native iOS preview');
    await link.scrollIntoViewIfNeeded();
    assert.ok((await link.boundingBox()).height>=44);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await downloaded(page);
    if(width===390||width===1440){
      const scan=await new AxeBuilder({page}).include('#kontakt').withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();
      report.axe.push({width,violations:scan.violations});assert.deepEqual(scan.violations,[]);
      await page.screenshot({path:path.join(output,`contact-${width}.png`)});
    }
    pass(`${width}px: absolute share metadata, reachable PNG, native vCard download, touch target and contact layout`);
    if(width===390){
      for(const file of ['qr-dirk-herrmann.png','qr-dirk-herrmann.svg']){
        const sourceUrl=base+'/assets/'+file;
        const pixels=await page.evaluate(async src=>{
          const image=new Image();image.src=src;await image.decode();
          const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
          const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,256,256);ctx.imageSmoothingEnabled=false;ctx.drawImage(image,0,0,256,256);
          return [...ctx.getImageData(0,0,256,256).data];
        },sourceUrl);
        assert.equal(jsQR(new Uint8ClampedArray(pixels),256,256)?.data,profile.website);
      }
      pass('Both PNG and SVG QR files decode correctly at a reduced 256px screen size');
    }
    await context.close();
  }
  for(const standalone of [false,true]){
    const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
    const page=await context.newPage();
    if(standalone)await page.setContent(await fs.readFile(path.join(root,'vorschau/Dirk_Herrmann_V6A_Vorschau.html'),'utf8'));
    else await page.goto(base);
    await downloaded(page);
    pass(`${standalone?'Offline single file':'Hosted site'}: exact vCard download without JavaScript`);
    await context.close();
  }
  assert.deepEqual(report.errors,[]);
  await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(`\n${report.checks.length} digital business card checks passed.`);
})().catch(async error=>{
  console.error(error);report.failure=String(error.stack||error);process.exitCode=1;
  await fs.mkdir(output,{recursive:true});await fs.writeFile(path.join(output,'failure.json'),JSON.stringify(report,null,2)+'\n');
}).finally(async()=>{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));});
