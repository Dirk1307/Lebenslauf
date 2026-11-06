/* V6A: progressive enhancement; the original HTML remains the content source. */
(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 781px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = v => Math.max(0, Math.min(1, v));
  const smooth = v => { v = clamp(v); return v * v * (3 - 2 * v); };

  // Navigation: a disclosure, not a modal; normal document tab order is retained.
  const menu = document.getElementById('nav-main');
  const toggle = document.getElementById('menu-btn');
  function setMenu(open, returnFocus = false) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    toggle.textContent = open ? '×' : '☰';
    if (returnFocus) toggle.focus();
  }
  document.documentElement.classList.add('nav-enhanced');
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false, true);
  });
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest('.nav')) setMenu(false);
  });
  document.querySelector('.site-header').addEventListener('focusout', e => {
    if (!e.currentTarget.contains(e.relatedTarget)) setMenu(false);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    setMenu(false);
    const destination = document.querySelector(a.hash);
    if (destination) {
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll: true });
    }
  }));
  desktop.addEventListener('change', () => setMenu(false));

  // Hide content only after its observer is installed. No JS / no observer = readable.
  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }), { threshold: 0.07 });
    document.querySelectorAll('[data-reveal]').forEach(el => {
      observer.observe(el);
      el.classList.add('reveal-pending');
    });
  }

  // Letter Cascade: keep word wrapping, real whitespace and one complete accessible name.
  function setupCascade() {
    const targets = [...document.querySelectorAll('.cascade-target')];
    const observer = 'IntersectionObserver' in window && !motion.matches
      ? new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('cascade-ready');
        observer.unobserve(entry.target);
      }), { threshold: 0.15 }) : null;
    for (const target of targets) {
      const label = target.cloneNode(true);
      label.querySelectorAll('br').forEach(br => br.replaceWith(' '));
      target.setAttribute('aria-label', label.textContent.replace(/\s+/g, ' ').trim());
      let letterIndex = 0;
      function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment();
          for (const part of node.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) { fragment.append(part); continue; }
            const word = document.createElement('span');
            word.className = 'cascade-word';
            word.setAttribute('aria-hidden', 'true');
            for (const char of part) {
              const letter = document.createElement('span');
              letter.className = 'cascade-letter';
              letter.textContent = char;
              letter.style.transitionDelay = `${Math.min(letterIndex++ * 14, 350)}ms`;
              word.append(letter);
            }
            fragment.append(word);
          }
          node.replaceWith(fragment);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
          [...node.childNodes].forEach(walk);
        }
      }
      [...target.childNodes].forEach(walk);
      if (observer) {
        observer.observe(target);
        target.classList.add('cascade-enhanced');
      } else target.classList.add('cascade-ready');
    }
    motion.addEventListener('change', () => {
      if (motion.matches) targets.forEach(t => t.classList.add('cascade-ready'));
    });
  }

  // Original geometric colour field, paused outside the hero / in background tabs.
  function setupHero() {
    const canvas = document.getElementById('fluid');
    const ctx = canvas.getContext('2d', { alpha: true });
    const off = document.createElement('canvas');
    const oc = off.getContext('2d');
    if (!ctx || !oc) return; // The existing CSS gradient is the fallback.
    const W = 135, H = 90;
    off.width = W; off.height = H;
    const im = oc.createImageData(W, H), pixels = im.data;
    const blobs = [
      { x: .69, y: .42, w: .3, h: .4, r: [89,116,236] },
      { x: .91, y: .3, w: .32, h: .43, r: [170,193,252] },
      { x: .84, y: .77, w: .32, h: .44, r: [237,167,196] },
      { x: .6, y: .79, w: .25, h: .44, r: [182,190,248] },
      { x: .98, y: .68, w: .21, h: .22, r: [111,133,236] }
    ];
    let width = 1, height = 1, frame = null, last = 0, visible = true, paused = false;
    const button = document.querySelector('.hero-motion-toggle');
    function paint(t) {
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const px = x/W, py = y/H;
        let sum = 0, cr = 0, cg = 0, cb = 0;
        for (let i = 0; i < blobs.length; i++) {
          const b = blobs[i];
          const dx = (px-b.x-Math.sin(t*.21+i*1.43)*.045)/b.w;
          const dy = (py-b.y-Math.cos(t*.19+i*.97)*.062)/b.h;
          const warp = Math.sin(px*8.3+py*5.7+t*.32+i*1.4)*.17 + Math.cos(px*11.5-py*6.5-t*.23+i*2)*.10;
          const weight = Math.exp(-2.45*Math.max(.01, dx*dx+dy*dy+warp));
          sum += weight; cr += weight*b.r[0]; cg += weight*b.r[1]; cb += weight*b.r[2];
        }
        const alpha = Math.min(.86, sum*.70), k = (y*W+x)*4;
        pixels[k] = 243*(1-alpha)+(cr/(sum||1))*alpha;
        pixels[k+1] = 242*(1-alpha)+(cg/(sum||1))*alpha;
        pixels[k+2] = 237*(1-alpha)+(cb/(sum||1))*alpha;
        pixels[k+3] = 255;
      }
      oc.putImageData(im,0,0);
      ctx.clearRect(0,0,width,height);
      ctx.drawImage(off,0,0,width,height);
    }
    function tick(time) {
      if (time-last >= 50) { paint(time*.001); last = time; }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      button.hidden = motion.matches;
      if (!motion.matches && !paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function resize() {
      width = Math.max(1, canvas.clientWidth); height = Math.max(1, canvas.clientHeight);
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      if (!motion.matches) paint(last*.001);
    }
    button.addEventListener('click', () => {
      paused = !paused;
      button.setAttribute('aria-pressed', String(paused));
      button.textContent = paused ? 'Hintergrundanimation fortsetzen' : 'Hintergrundanimation pausieren';
      sync();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(canvas);
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
    else addEventListener('resize', resize, { passive: true });
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    resize(); sync();
  }

  // Each portrait has its own lazy WebGL context and a real 2D fallback.
  // Nothing draws at rest; only mouse/pen waves schedule frames.
  function setupRipple(parent) {
    const photo = parent.querySelector('img');
    const canvas = parent.querySelector('.portrait-ripple');
    const fallback = parent.querySelector('.ripple-fallback');
    const ctx = fallback.getContext('2d');
    const waves = [], data = new Float32Array(32);
    let gl = null, program, texture, locations, ready = false, attempted = false;
    let frame = null, lastPoint = null, visible = true, touchStart = null;
    const allowed = () => !motion.matches && visible && !document.hidden;
    function stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      waves.length = 0;
      lastPoint = null;
      touchStart = null;
      canvas.classList.remove('ready');
      ctx?.clearRect(0,0,fallback.width,fallback.height);
    }
    function initGL() {
      if (attempted || !finePointer.matches || !photo.complete || !photo.naturalWidth || !allowed()) return;
      attempted = true;
      try {
        gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false });
        if (!gl) return;
        const vertex = 'attribute vec2 aPos; varying vec2 vUv; void main(){vUv=aPos*.5+.5; gl_Position=vec4(aPos,0.,1.);}';
        const fragment = `precision mediump float;
          varying vec2 vUv; uniform sampler2D uImage; uniform float uAspect;
          uniform vec2 uCrop; uniform vec2 uCenter; uniform float uTime; uniform vec4 uWaves[8];
          void main(){
            vec2 uv=vUv; vec2 delta=vec2(0.);
            for(int i=0;i<8;i++){
              vec4 w=uWaves[i]; float age=uTime-w.z;
              if(age>0. && age<1.75 && w.w>0.){
                vec2 d=(uv-w.xy)*vec2(uAspect,1.); float dist=length(d);
                float ring=sin((dist-age*.38)*100.)*exp(-abs(dist-age*.38)*31.)*exp(-age*1.05);
                delta+=normalize(d+vec2(.00001))/vec2(uAspect,1.)*ring*.009*w.w;
              }
            }
            uv=uCenter+(uv+delta-.5)*uCrop;
            gl_FragColor=texture2D(uImage,clamp(uv,.001,.999));
          }`;
        function shader(type, source) {
          const s = gl.createShader(type);
          gl.shaderSource(s, source); gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error('Ripple shader compilation failed');
          return s;
        }
        program = gl.createProgram();
        const vert = shader(gl.VERTEX_SHADER, vertex), frag = shader(gl.FRAGMENT_SHADER, fragment);
        gl.attachShader(program,vert); gl.attachShader(program,frag); gl.linkProgram(program);
        gl.deleteShader(vert); gl.deleteShader(frag);
        if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw Error('Ripple linking failed');
        gl.useProgram(program);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
        const attribute = gl.getAttribLocation(program,'aPos');
        gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
        texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,photo);
        locations = Object.fromEntries(['uAspect','uCrop','uCenter','uTime','uWaves[0]'].map(key => [key,gl.getUniformLocation(program,key)]));
        ready = true;
      } catch {
        ready = false; // Keep the original <img> and use 2D rings, without a console error.
      }
    }
    function paint(now) {
      frame = null;
      if (!allowed()) { stop(); return; }
      while (waves.length && now-waves[0].time > 1760) waves.shift();
      // clientWidth excludes the about-photo's decorative rotation.
      const width = parent.clientWidth, height = parent.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 1.6);
      if (ready) {
        const w = Math.max(1,Math.round(width*dpr)), h = Math.max(1,Math.round(height*dpr));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h);
        }
        // Reproduce the original CSS object-fit, object-position and scale exactly.
        const style = getComputedStyle(photo);
        const position = style.objectPosition.split(' ').map(n => parseFloat(n)/100);
        const scale = Math.max(width/photo.naturalWidth,height/photo.naturalHeight);
        const cropX = width/(photo.naturalWidth*scale), cropY = height/(photo.naturalHeight*scale);
        const transform = style.transform === 'none' ? null : new DOMMatrixReadOnly(style.transform);
        const zoom = transform ? Math.hypot(transform.a,transform.b) : 1;
        gl.uniform1f(locations.uAspect,width/height);
        gl.uniform2f(locations.uCrop,cropX/zoom,cropY/zoom);
        gl.uniform2f(locations.uCenter,position[0]+(.5-position[0])*cropX,1-position[1]-(.5-position[1])*cropY);
        data.fill(0);
        waves.slice(-8).forEach((wave,i) => data.set([wave.x,1-wave.y,wave.time*.001,1],i*4));
        gl.uniform1f(locations.uTime,now*.001); gl.uniform4fv(locations['uWaves[0]'],data);
        gl.drawArrays(gl.TRIANGLES,0,6);
        canvas.classList.toggle('ready',waves.length > 0);
      } else if (ctx) {
        const w=Math.max(1,Math.round(width*dpr)), h=Math.max(1,Math.round(height*dpr));
        if (fallback.width!==w || fallback.height!==h) { fallback.width=w; fallback.height=h; }
        ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,width,height);
        for (const wave of waves) {
          const age=(now-wave.time)/1760, radius=10+94*age;
          ctx.beginPath(); ctx.arc(wave.x*width,wave.y*height,radius,0,Math.PI*2);
          ctx.strokeStyle=`rgba(238,246,255,${.64*(1-age)})`; ctx.lineWidth=2*(1-age)+.3; ctx.stroke();
          ctx.beginPath(); ctx.arc(wave.x*width,wave.y*height,Math.max(0,radius-13),0,Math.PI*2);
          ctx.strokeStyle=`rgba(132,181,255,${.37*(1-age)})`; ctx.lineWidth=1; ctx.stroke();
        }
      }
      if (waves.length) frame=requestAnimationFrame(paint);
    }
    function schedule() { if (frame===null && allowed()) frame=requestAnimationFrame(paint); }
    parent.addEventListener('pointerenter',initGL,{ passive: true });
    function addWave(e) {
      // Map viewport pointers back through the about-photo's small CSS rotation.
      const rect=parent.getBoundingClientRect();
      const angle = parent.closest('.intro-photo-side') ? 2*Math.PI/180 : 0;
      const dx=e.clientX-(rect.left+rect.width/2), dy=e.clientY-(rect.top+rect.height/2);
      const x=clamp(.5+(dx*Math.cos(angle)+dy*Math.sin(angle))/parent.clientWidth);
      const y=clamp(.5+(-dx*Math.sin(angle)+dy*Math.cos(angle))/parent.clientHeight);
      if (lastPoint && Math.hypot((x-lastPoint.x)*parent.clientWidth,(y-lastPoint.y)*parent.clientHeight)<9) return;
      lastPoint={x,y}; waves.push({x,y,time:performance.now()});
      if (waves.length>8) waves.shift();
      schedule();
    }
    parent.addEventListener('pointermove',e => {
      if (e.pointerType==='touch' || !finePointer.matches || !allowed()) return;
      initGL();
      addWave(e);
    },{ passive: true });
    // A short stationary tap gets a light 2D ripple. A page swipe never starts it.
    parent.addEventListener('pointerdown',e => {
      if (e.pointerType==='touch' && e.isPrimary && allowed()) touchStart={id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now()};
    },{passive:true});
    parent.addEventListener('pointerup',e => {
      const start=touchStart; touchStart=null;
      if (!start || start.id!==e.pointerId || !allowed()) return;
      if (performance.now()-start.time<450 && Math.hypot(e.clientX-start.x,e.clientY-start.y)<10) addWave(e);
    },{passive:true});
    parent.addEventListener('pointercancel',()=>{touchStart=null;},{passive:true});
    parent.addEventListener('pointerleave',()=>{lastPoint=null;});
    canvas.addEventListener('webglcontextlost',e=>{
      e.preventDefault(); ready=false; stop();
    });
    canvas.addEventListener('webglcontextrestored',()=>{attempted=false; initGL();});
    if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting;
      if (!visible) stop();
    }).observe(parent);
    motion.addEventListener('change',stop);
    finePointer.addEventListener('change',stop);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    addEventListener('resize',stop,{ passive: true });
  }

  // Scroll reads are batched before writes; offscreen sections do not animate.
  function setupScroll() {
    const split=document.querySelector('.split-scroll');
    const cases=document.querySelector('.cases-scroll');
    const stage=document.querySelector('.split-canvas');
    const panels=[...document.querySelectorAll('.split-panel')];
    const cards=[...document.querySelectorAll('.case-card')];
    const meter=document.querySelector('.meter>span');
    const counter=document.querySelector('.cases-counter>span');
    let pending=false;
    function update() {
      pending=false;
      if (!desktop.matches || motion.matches) {
        panels.forEach(p=>p.style.removeProperty('transform'));
        cards.forEach(c=>{c.style.removeProperty('transform');c.style.removeProperty('opacity');});
        return;
      }
      const vh=innerHeight, sr=split.getBoundingClientRect(), cr=cases.getBoundingClientRect();
      if (sr.bottom>0 && sr.top<vh) {
        const p=clamp((76-sr.top)/Math.max(1,sr.height-(vh-76)));
        // Leave a readable hold at both ends of the flip.
        const t=smooth((p-.06)/.72);
        stage.style.setProperty('--split-gap',`${Math.round(t*20)}px`);
        panels.forEach((panel,i)=>{
          panel.style.transform=`translate3d(${[-17,0,17][i]*t}px,${[-5,3,5][i]*t}px,0) rotateY(${-180*t}deg) rotateZ(${[-1.4,.5,1.4][i]*t}deg)`;
        });
        meter.style.width=`${Math.round(t*100)}%`;
      }
      if (cr.bottom>0 && cr.top<vh) {
        const p=clamp((76-cr.top)/Math.max(1,cr.height-(vh-76)));
        cards.forEach((card,i)=>{
          const fold=i===2?0:smooth((p-(i===0?.09:.53))/.31);
          card.style.transform=`perspective(1500px) translateY(${-18*fold}px) rotateX(${-86*fold}deg)`;
          card.style.opacity=String(1-smooth((fold-.88)/.12));
        });
        // Keep all three articles in the accessibility tree in source order.
        counter.textContent=`0${p<.40?1:p<.84?2:3} / 03`;
      }
    }
    const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update);}};
    // Apply before enabling desktop pinning: a failed script leaves static cards.
    document.documentElement.classList.add('scroll-enhanced');
    addEventListener('scroll',schedule,{passive:true});
    addEventListener('resize',schedule,{passive:true});
    motion.addEventListener('change',schedule);
    desktop.addEventListener('change',schedule);
    update();
  }

  setupCascade();
  setupScroll();
  setupHero();
  document.querySelectorAll('[data-component="image-ripple-effect"]').forEach(setupRipple);
})();
