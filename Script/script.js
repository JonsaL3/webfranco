  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.15});
  revealEls.forEach(el=>io.observe(el));

  // Language bars
  const langFills = document.querySelectorAll('.lang-fill');
  const langIo = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.style.width = e.target.dataset.width + '%';
        langIo.unobserve(e.target);
      }
    });
  },{threshold:0.4});
  langFills.forEach(el=>langIo.observe(el));

  // Cursor glow (desktop only)
  const glow = document.getElementById('cursorGlow');
  const isTouch = matchMedia('(pointer: coarse)').matches;
  if(!isTouch){
    window.addEventListener('mousemove', (e)=>{
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
  } else {
    glow.style.display = 'none';
  }

  // Parallax blobs on mouse move
  const blobs = document.querySelectorAll('.blob');
  if(!isTouch){
    window.addEventListener('mousemove', (e)=>{
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      blobs.forEach((b,i)=>{
        const depth = (i+1)*10;
        b.style.marginLeft = (x*depth)+'px';
        b.style.marginTop = (y*depth)+'px';
      });
    });
  }

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  navToggle.addEventListener('click', ()=>{
    navMobile.classList.toggle('open');
  });
  navMobile.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> navMobile.classList.remove('open'));
  });

  // Carousels: drag to scroll + arrow buttons
  function setupCarousel(trackEl){
    let isDown = false, startX, scrollLeft;
    trackEl.addEventListener('mousedown', (e)=>{
      isDown = true;
      trackEl.classList.add('dragging');
      startX = e.pageX - trackEl.offsetLeft;
      scrollLeft = trackEl.scrollLeft;
    });
    ['mouseleave','mouseup'].forEach(ev=>{
      trackEl.addEventListener(ev, ()=>{ isDown=false; trackEl.classList.remove('dragging'); });
    });
    trackEl.addEventListener('mousemove', (e)=>{
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - trackEl.offsetLeft;
      const walk = (x - startX) * 1.2;
      trackEl.scrollLeft = scrollLeft - walk;
    });
  }
  const expTrack = document.getElementById('expTrack');
  const skillTrack = document.getElementById('skillTrack');
  setupCarousel(expTrack);
  setupCarousel(skillTrack);

  document.querySelectorAll('.arrow-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = btn.dataset.target === 'exp' ? expTrack : skillTrack;
      const card = target.querySelector(':scope > *');
      const step = card ? card.getBoundingClientRect().width + 20 : 300;
      target.scrollBy({left: step * parseInt(btn.dataset.dir), behavior:'smooth'});
    });
  });

  // Copy to clipboard
  document.querySelectorAll('[data-copy]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      try{
        await navigator.clipboard.writeText(btn.dataset.copy);
        const original = btn.textContent;
        btn.textContent = 'Copiado';
        setTimeout(()=> btn.textContent = original, 1600);
      }catch(err){
        btn.textContent = 'Error';
      }
    });
  });
