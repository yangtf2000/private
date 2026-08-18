(function(){
  const $ = id => document.getElementById(id);
  const cover=$('cover'), toc=$('toc'), reader=$('reader');
  const tocList=$('tocList');
  const deck=$('deck'), dotsEl=$('dots'), idxEl=$('idx'), topTitle=$('topTitle');
  const annBtn=$('annBtn'), noteBtn=$('noteBtn'), voiceBtn=$('voiceBtn'), penbar=$('penbar');
  const playBtn=$('playBtn');
  const notes=$('notes'), noteArea=$('noteArea'), noteClose=$('noteClose');
  const backBtn=$('back'), prevBtn=$('prev'), nextBtn=$('next'), clearBtn=$('clearBtn');
  const enterBtn=$('enterBtn'), backToCover=$('backToCover'), scrollHint=$('scrollHint');
  const annoCanvas=$('annoCanvas');

  let MANIFEST=[], BOOK=null, docKey='', slides=[], cur=0;
  let annotating=false, autoplay=true, playing=false, penColor='#ffd34d';
  let drawing=false, lastX=0, lastY=0, curAudio=null, curCtx=null;
  const cache={};

  /* ---------- 目录渲染 ---------- */
  function loadManifest(){
    if(Array.isArray(window.MANIFEST) && window.MANIFEST.length){ MANIFEST=window.MANIFEST; }
    else { MANIFEST=[]; }
    renderToc();
  }

  function renderToc(){
    tocList.innerHTML='';
    if(!MANIFEST.length){
      tocList.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#888;padding:40px">目录加载中…</div>';
      return;
    }
    MANIFEST.forEach((m,i)=>{
      const item=document.createElement('div');
      item.className='toc-item';
      item.style.animationDelay=(i*0.04)+'s';
      item.innerHTML=`
        <div class="toc-thumb">
          <span class="num">${m.no}</span>
          <div class="fallback">${m.no}</div>
        </div>
        <div class="toc-info">
          <div class="toc-title2">${m.body_title||'第'+m.no+'篇'}</div>
          <div class="toc-author">${m.author||''}</div>
          <span class="toc-badge">${m.body_count} 页</span>
        </div>`;
      item.onclick=()=>loadBook(m.dir);
      tocList.appendChild(item);
      const thumb=item.querySelector('.toc-thumb');
      const img=new Image();
      img.onload=()=>{ thumb.style.backgroundImage=`url('${m.dir}/bg.png?v=6')`; thumb.classList.add('has-img'); };
      img.onerror=()=>{};
      img.src=m.dir+'/bg.png?v=6';
    });
  }

  /* ---------- 页面切换（统一用内联 style 控制显示，优先级最高，避免被 display:none 覆盖） ---------- */
  function showCover(){ cover.style.display='flex'; toc.style.display='none'; reader.style.display='none'; reader.classList.remove('open'); }
  function showToc(){ cover.style.display='none'; toc.style.display='block'; reader.style.display='none'; reader.classList.remove('open'); }
  function showReader(){ cover.style.display='none'; toc.style.display='none'; reader.style.display='block'; reader.classList.add('open'); }

  enterBtn.onclick=showToc;
  scrollHint.onclick=showToc;
  // 点封面空白处也可进入目录（卡片内按钮已单独绑定）
  cover.addEventListener('click', e=>{ if(e.target.closest('.cover-card')) return; showToc(); });
  backToCover.onclick=showCover;
  backBtn.onclick=showToc;

  /* ---------- 构建阅读器 ---------- */
  // type: 'cover' | 'body' | 'appr'
  function makeSlide(type, text, data, idx){
    const el=document.createElement('div');
    el.className='slide'+(type==='cover'?' cover':'');
    el.style.backgroundImage="url('"+BOOK.dir+"/bg.png?v=6')";
    const veil=document.createElement('div'); veil.className='veil';
    const body=document.createElement('div'); body.className='body';
    const appr=document.createElement('div'); appr.className='appr';

    if(type==='cover'){
      body.innerHTML='<div style="font-size:13px;color:#8a7c63;font-weight:600;margin-bottom:10px;">'+BOOK.doc_title+'</div>'
        +'<div style="font-size:27px;font-weight:800;color:#3a2a17;">'+BOOK.bodyTitle+'</div>'
        +'<div style="font-size:15px;color:#8a7c63;margin-top:14px;font-weight:600;">文 / '+BOOK.author+'</div>';
    } else if(type==='body'){
      body.textContent=text;
    } else if(type==='appr'){
      body.innerHTML='<div style="font-size:22px;font-weight:800;color:#3a2a17;text-align:center;margin:auto;">赏 析</div>';
    }

    if(type==='appr'){
      appr.innerHTML='<b>赏 析</b>'+data.map(p=>'<div style="margin-top:9px">'+p+'</div>').join('');
      appr.style.fontSize='12.5px';          // 赏析页字体小一点
      appr.style.maxHeight='40%';
    } else if(type==='body'){
      appr.style.display='none';
    }

    const dot=document.createElement('div'); dot.className='note-dot';
    el.append(veil, body, appr, dot);
    deck.appendChild(el);
    const d=document.createElement('div'); d.className='dot'; dotsEl.appendChild(d);
    return {
      el,
      audio:(type==='body')?BOOK.dir+'/audio/p'+String(idx+1).padStart(2,'0')+'.mp3?v=6':null,
      isAppr:type==='appr',
      cover:type==='cover',
      noteKey:'fb_note_'+docKey+'_'+idx,
      annKey:'fb_ann_'+docKey+'_'+idx,
      dot
    };
  }

  function build(){
    deck.innerHTML=''; dotsEl.innerHTML=''; slides=[]; cur=0;
    slides.push(makeSlide('cover', '', BOOK.author, 'cover'));
    BOOK.body.forEach((para,i)=> slides.push(makeSlide('body', para, null, i)) );
    slides.push(makeSlide('appr', '', BOOK.appreciation, 'appr'));  // 赏析放最后单独一页
    sizeCanvas();
    show(0);
  }

  function sizeCanvas(){
    const r=deck.getBoundingClientRect();
    if(!r.width) return;
    annoCanvas.width=r.width; annoCanvas.height=r.height;
    curCtx=annoCanvas.getContext('2d');
    curCtx.lineCap='round'; curCtx.lineJoin='round';
    restoreAnn();
  }

  function show(n){
    if(!slides.length) return;
    cur=Math.max(0,Math.min(slides.length-1,n));
    slides.forEach((s,i)=>{ s.el.style.transform='translateX('+((i-cur)*100)+'%)'; });
    [...dotsEl.children].forEach((d,i)=>d.classList.toggle('on',i===cur));
    idxEl.textContent=(cur+1)+'/'+slides.length;
    topTitle.textContent=BOOK.bodyTitle||BOOK.doc_title;
    restoreNote(slides[cur]);
    stopAudio();
    if(autoplay) playAudio(slides[cur]);   // 进入页面自动播放（正文页有配音，封面/赏析页无）
  }

  /* ---------- 语音：预生成 mp3 优先，否则浏览器 TTS 兜底 ---------- */
  function stopAudio(){
    if(curAudio){ curAudio.pause(); curAudio.currentTime=0; curAudio=null; }
    window.speechSynthesis && window.speechSynthesis.cancel();
    playing=false; updatePlayBtn();
  }
  function playAudio(s){
    stopAudio();
    if(!s || s.cover || s.isAppr) return;   // 封面页与赏析页不配音
    const text=slideText(s);
    fetch(s.audio,{method:'HEAD'}).then(r=>{
      if(r.ok){
        curAudio=new Audio(s.audio);
        curAudio.play().then(()=>{ playing=true; updatePlayBtn(); }).catch(()=>ttsFallback(text));
        curAudio.onended=()=>{ playing=false; updatePlayBtn(); };
      } else { ttsFallback(text); }
    }).catch(()=>ttsFallback(text));
  }
  function ttsFallback(text){
    if(!window.speechSynthesis) return;
    const u=new SpeechSynthesisUtterance(text);
    u.lang='zh-CN'; u.rate=0.9;
    u.onstart=()=>{ playing=true; updatePlayBtn(); };
    u.onend=()=>{ playing=false; updatePlayBtn(); };
    window.speechSynthesis.speak(u);
  }
  function slideText(s){ return s.el.querySelector('.body').textContent; }
  function updatePlayBtn(){ playBtn.textContent = playing ? '⏸' : '▶'; }

  /* ---------- 备注 / 标注 ---------- */
  function restoreNote(s){ const v=localStorage.getItem(s.noteKey); s.dot.style.display=(v&&v.trim())?'block':'none'; }
  function restoreAnn(){
    if(!curCtx) return;
    curCtx.clearRect(0,0,annoCanvas.width,annoCanvas.height);
    const d=localStorage.getItem(slides[cur].annKey);
    if(!d) return;
    const img=new Image(); img.onload=()=>curCtx.drawImage(img,0,0,annoCanvas.width,annoCanvas.height); img.src=d;
  }
  function saveAnn(){ if(curCtx) localStorage.setItem(slides[cur].annKey, annoCanvas.toDataURL('image/png')); }

  function pos(e){ const r=annoCanvas.getBoundingClientRect(); const p=e.touches?e.touches[0]:e; return {x:p.clientX-r.left,y:p.clientY-r.top}; }
  function startDraw(e){ if(!annotating) return; drawing=true; const p=pos(e); lastX=p.x; lastY=p.y; e.preventDefault(); }
  function moveDraw(e){
    if(!annotating||!drawing) return;
    const p=pos(e); if(!curCtx) return;
    curCtx.strokeStyle=penColor; curCtx.globalAlpha=(penColor==='#ffd34d')?0.45:1; curCtx.lineWidth=(penColor==='#ffd34d')?16:5;
    curCtx.beginPath(); curCtx.moveTo(lastX,lastY); curCtx.lineTo(p.x,p.y); curCtx.stroke(); lastX=p.x; lastY=p.y; e.preventDefault();
  }
  function endDraw(){ if(drawing){ drawing=false; saveAnn(); } }

  annoCanvas.addEventListener('pointerdown', startDraw);
  annoCanvas.addEventListener('pointermove', moveDraw);
  window.addEventListener('pointerup', endDraw);

  let sx=0, sy=0;
  deck.addEventListener('touchstart', e=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; }, {passive:true});
  deck.addEventListener('touchend', e=>{
    if(annotating) return;
    const dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)) show(cur + (dx<0?1:-1));
  }, {passive:true});

  prevBtn.onclick=()=>show(cur-1);
  nextBtn.onclick=()=>show(cur+1);
  playBtn.onclick=()=>{
    const s=slides[cur];
    if(!s || s.cover || s.isAppr) return;   // 无配音页不响应
    if(playing) stopAudio(); else playAudio(s);
  };
  document.addEventListener('keydown', e=>{
    if(!reader.classList.contains('open')) return;
    if(e.key==='ArrowRight') show(cur+1);
    if(e.key==='ArrowLeft') show(cur-1);
    if(e.key==='Escape') showToc();
  });

  annBtn.onclick=()=>{
    annotating=!annotating; annBtn.classList.toggle('on',annotating);
    reader.classList.toggle('annotating',annotating); penbar.classList.toggle('show',annotating);
  };
  noteBtn.onclick=()=>{ notes.classList.add('open'); noteArea.value=localStorage.getItem(slides[cur].noteKey)||''; noteArea.focus(); };
  noteClose.onclick=()=>{ notes.classList.remove('open'); localStorage.setItem(slides[cur].noteKey, noteArea.value); restoreNote(slides[cur]); };
  noteArea.addEventListener('input', ()=>localStorage.setItem(slides[cur].noteKey, noteArea.value));
  clearBtn.onclick=()=>{ if(curCtx){ curCtx.clearRect(0,0,annoCanvas.width,annoCanvas.height); saveAnn(); } };

  // 声音开关：切换"翻页自动播放"；开启即播当前页，关闭即停
  voiceBtn.onclick=()=>{
    autoplay=!autoplay;
    voiceBtn.classList.toggle('on',autoplay);
    if(autoplay) playAudio(slides[cur]); else stopAudio();
  };
  // 默认开启自动播放，并把开关标记为点亮
  voiceBtn.classList.add('on');

  document.querySelectorAll('.swatch').forEach(sw=>{
    sw.onclick=()=>{ penColor=sw.dataset.color; document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('sel')); sw.classList.add('sel'); };
  });

  /* ---------- 加载单篇 ---------- */
  function openBook(b){ BOOK=b; docKey=b.doc_title||b.bodyTitle; showReader(); requestAnimationFrame(build); }
  function loadBook(dir){
    if(cache[dir]) return openBook(cache[dir]);
    const s=document.createElement('script');
    s.src=dir+'/data.js?v=6';
    s.onload=()=>{ const b=window.BOOK; b.dir=dir; cache[dir]=b; openBook(b); };
    s.onerror=()=>alert('这一篇还在制作中，稍后再来看看吧～');
    document.head.appendChild(s);
  }

  window.addEventListener('resize', ()=>{ if(reader.classList.contains('open')) sizeCanvas(); });
  loadManifest();
})();
