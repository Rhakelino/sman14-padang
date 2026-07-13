/* SMAN 14 Padang — Interactivity */
(function(){

  /* Nav: scroll -> solid */
  const nav = document.querySelector('nav');
  if(nav){
    const scrolled = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', scrolled, {passive:true});
    scrolled();
  }

  /* Mobile hamburger */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if(hamburger && navLinks){
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    /* Close on link click */
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(id && id.length > 1){
        const target = document.querySelector(id);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
        }
      }
    });
  });

  /* Contact form handler */
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = {
        nama:     form.nama?.value?.trim()   || '',
        email:    form.email?.value?.trim()  || '',
        pesan:    form.pesan?.value?.trim()  || ''
      };
      console.log('[Kontak SMAN 14] Form submitted:', data);
      /* Simpan ke cookie/localStorage untuk demo */
      try{localStorage.setItem('sman14_kontak_latest', JSON.stringify(data))}catch(_){}
      form.querySelector('button[type="submit"]').textContent = 'Pesan terkirim! ✓';
      form.querySelector('button[type="submit"]').style.background = '#2e7d32';
      setTimeout(() => {
        form.querySelector('button[type="submit"]').textContent = 'Kirim Pesan';
        form.querySelector('button[type="submit"]').style.background = '';
      }, 2500);
    });
  }

  /* PPDB year counter */
  const yearSpan = document.getElementById('ppdbYear');
  if(yearSpan) yearSpan.textContent = new Date().getFullYear();

})();
