// ===============================
// MENU HAMBURGER
// ===============================

// helper function used by onclick attributes in HTML
function toggleMenu() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  // Calcola dinamicamente l'offset per il header fisso e lo applica alla variabile CSS
  const setHeaderOffset = () => {
    const headerEl = document.querySelector('header');
    if (!headerEl) return;
    const h = headerEl.offsetHeight;
    document.documentElement.style.setProperty('--header-offset', `${h}px`);
  };
  // Chiama subito e di nuovo su load/resize (font o immagini possono cambiare l'altezza)
  setHeaderOffset();
  window.addEventListener('resize', () => setHeaderOffset());
  window.addEventListener('load', () => setHeaderOffset());

  // ===============================
  // SLIDESHOW HOMEPAGE DA STRAPI
  // ===============================
    // ===============================
    // FORM CONTATTI (chi-siamo.html)
    // ===============================
  const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = '';

    const payload = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      oggetto: document.getElementById('oggetto').value,
      messaggio: document.getElementById('messaggio').value
    };

    try {
      const response = await fetch('http://localhost:1337/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: payload
        })
      });

      const result = await response.json();

      if (response.ok) {
        formMessage.style.color = 'green';
        formMessage.textContent = 'Messaggio inviato con successo!';
        contactForm.reset();
      } else {
        formMessage.style.color = 'red';
        formMessage.textContent =
          result.error?.message || 'Errore durante invio';
      }
    } catch (error) {
      formMessage.style.color = 'red';
      formMessage.textContent = 'Errore di rete';
      console.error(error);
    }
  });
}

  const slideshow = document.getElementById('slideshow');
  if (slideshow) {
    console.log('Slideshow container found');
    const SLIDES_API_URL = 'http://localhost:1337/api/slides?populate=*';
    fetch(SLIDES_API_URL)
      .then(res => res.json())
      .then(json => {
        console.log('Slideshow response', json);
        const slides = json.data;
        console.log('numero slide:', slides?.length);
        slides.forEach((slide, idx) => {
          console.log('slide', idx, slide);
          console.log('keys', Object.keys(slide));
        });
        if (!slides || slides.length === 0) {
          console.warn('Nessuna slide restituita dal server');
          slideshow.textContent = 'Nessuna slide da mostrare';
          return;
        }
        let immaginiTrovate = false;
        slides.forEach((slide, idx) => {
          // inspect possible image field names
          let imgData = slide.immagine || slide.image || slide.img || slide.url || null;
          console.log('imgData for slide', idx, imgData);
          if (imgData && imgData.url) {
            immaginiTrovate = true;
            const imgUrl = imgData.url.startsWith('http') ? imgData.url : `http://localhost:1337${imgData.url}`;
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = `Slide ${idx+1}`;
            img.className = 'slide-img';
            img.style.opacity = (idx === 0) ? '1' : '0';
            img.style.zIndex = (idx === 0) ? '2' : '1';
            img.style.transition = 'opacity 1.2s cubic-bezier(.4,0,.2,1)';
            slideshow.appendChild(img);
          }
        });
        if (!immaginiTrovate) {
          console.warn('Slides presenti ma senza URL');
          slideshow.textContent = 'Slides esistono ma nessuna immagine';
          return;
        }
        // Slideshow automatico con fade
        let current = 0;
        const images = slideshow.querySelectorAll('.slide-img');
        if (images.length > 1) {
          setInterval(() => {
            images[current].style.opacity = '0';
            images[current].style.zIndex = '1';
            current = (current + 1) % images.length;
            images[current].style.opacity = '1';
            images[current].style.zIndex = '2';
          }, 3500);
        }
      })
      .catch(err => {
        console.error('Errore slideshow:', err);
        // fallback placeholder if slide load fails
        slideshow.innerHTML = '<div class="slide-placeholder">Nessuna immagine disponibile</div>';
      });
  }
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const closeBtn = document.querySelector('.close-btn');

  if (hamburger && nav && closeBtn) {
    hamburger.addEventListener('click', () => {
      nav.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
      nav.classList.remove('open');
    });

    // Chiudi il menu cliccando su un link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });
  } 

  // ===============================
  // TIMELINE PROGETTI DAL CMS (solo se presente #timeline)
  // ===============================
  const timeline = document.getElementById("timeline");
  if (timeline) {
    // Scegli l'endpoint in base alla pagina
    let API_URL = 'http://localhost:1337/api/pietro-albinis?populate=*';
    if (window.location.pathname.includes('personali.html')) {
      API_URL = 'http://localhost:1337/api/progetti-personalis?populate=*';
    }
    if (window.location.pathname.includes('design.html')) {
      API_URL = 'http://localhost:1337/api/progetti-personalis?populate=*';
    }
    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        const projectsData = json.data;
        if (!projectsData || projectsData.length === 0) {
          timeline.innerHTML = '<p>Nessun progetto disponibile.</p>';
          return;
        }
        projectsData
          .slice()
          .sort((a, b) => new Date(b.Data) - new Date(a.Data))
          .forEach(proj => {
            if (!proj || !proj.Nome) return;
            // Descrizione: mostra solo se stringa, oppure estrai testo da possibili strutture rich text
            let descrizione = '';
            if (typeof proj.Descrizione === 'string') {
              descrizione = proj.Descrizione;
            } else if (proj.Descrizione && Array.isArray(proj.Descrizione)) {
              descrizione = proj.Descrizione.map(par =>
                Array.isArray(par.children)
                  ? par.children.map(child => child.text || '').join('')
                  : ''
              ).join('<br>');
            } else if (proj.Descrizione && Array.isArray(proj.Descrizione.blocks) && proj.Descrizione.blocks.length > 0) {
              descrizione = proj.Descrizione.blocks.map(par =>
                Array.isArray(par.children)
                  ? par.children.map(child => child.text || '').join('')
                  : ''
              ).join('<br>');
            }
            // Data: mostra solo se presente, formattata (dd/mm/yyyy)
            let data = '';
            if (proj.Data) {
              const d = proj.Data.split('T')[0];
              const [year, month, day] = d.split('-');
              data = `${day}/${month}/${year}`;
            }
            // Copertina: mostra solo se url presente
            let imgUrl = '';
            if (proj.Copertina && proj.Copertina.url) {
              imgUrl = proj.Copertina.url;
            }
            // ID progetto per link (dinamico da Strapi)
            const projectId = proj.documentId; // usa documentId, non id
            console.log('Document ID usato per link:', projectId, proj.Nome);
            // Determina se siamo su personali.html
            const isPersonali = window.location.pathname.includes('design.html');
            const projectLink = isPersonali
              ? `progetto.html?id=${projectId}&tipo=personale`
              : `progetto.html?id=${projectId}`;
            const item = document.createElement("div");
            item.className = "timeline-item";
            item.innerHTML = `
              <div class="timeline-left" style="max-width: 350px; word-break: break-word; z-index: 2; background: #fff; position: relative;">
                <h3><a href="${projectLink}" class="timeline-title-link">${proj.Nome}</a></h3>
                <div class="timeline-label">${data}</div>
                <div class="timeline-side-text">${descrizione}</div>
              </div>
              <div class="timeline-center"></div>
              <div class="timeline-content">
                ${imgUrl ? `<a href="${projectLink}"><img src="http://localhost:1337${imgUrl}" alt="Copertina progetto" class="timeline-image"></a>` : ''}
              </div>
            `;
            timeline.appendChild(item);
          });
      })
      .catch(err => {
        timeline.innerHTML = '<p>Errore nel caricamento dei progetti.</p>';
        console.error('Errore nel recupero dei progetti dal CMS:', err);
      });
  }

  // ===============================
  // TIMELINE ANIMATA
  // ===============================
  const initTimelineAnimation = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const revealTimeline = () => {
      const triggerBottom = window.innerHeight * 0.85;

      timelineItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;

        if (itemTop < triggerBottom) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', revealTimeline);
    revealTimeline(); // iniziale
  };
  // avvia animazione timeline (se presente)
  initTimelineAnimation();

  // ===============================
  // SLIDESHOW COPERTINE PROGETTI (per .project-image)
  // ===============================
  const projectImageContainer = document.querySelector('.project-image');
  if (projectImageContainer) {
    // usa lo stesso endpoint dei progetti usato per la timeline
    let API_URL_PROJECTS = 'http://localhost:1337/api/pietro-albinis?populate=*';
    if (window.location.pathname.includes('personali.html')) {
      API_URL_PROJECTS = 'http://localhost:1337/api/progetti-personalis?populate=*';
    }

    fetch(API_URL_PROJECTS)
      .then(res => res.json())
      .then(json => {
        const projects = json.data || [];
        const images = [];
        projects.forEach(proj => {
          if (proj && proj.Copertina && proj.Copertina.url) {
            const url = proj.Copertina.url.startsWith('http') ? proj.Copertina.url : `http://localhost:1337${proj.Copertina.url}`;
            images.push(url);
          }
        });

        if (images.length === 0) {
          // nessuna immagine dal CMS: non fare nulla (rimane sfondo statico)
          return;
        }

        // crea immagini e inseriscile nel container
        images.forEach((src, idx) => {
          const img = document.createElement('img');
          img.src = src;
          img.alt = `Copertina progetto ${idx+1}`;
          img.className = 'project-slide';
          img.style.opacity = (idx === 0) ? '1' : '0';
          img.style.zIndex = (idx === 0) ? '2' : '1';
          img.style.transition = 'opacity 1s ease';
          projectImageContainer.appendChild(img);
        });

        // slideshow automatico
        let current = 0;
        const imgs = projectImageContainer.querySelectorAll('.project-slide');
        if (imgs.length > 1) {
          setInterval(() => {
            imgs[current].style.opacity = '0';
            imgs[current].style.zIndex = '1';
            current = (current + 1) % imgs.length;
            imgs[current].style.opacity = '1';
            imgs[current].style.zIndex = '2';
          }, 3500);
        }
      })
      .catch(err => {
        console.error('Errore nel recupero delle copertine dei progetti:', err);
      });
  }

  // Aggiungi classe .scrolled all'header quando si scrolla per mostrare ombra/sfondo
  const headerEl = document.querySelector('header');
  if (headerEl) {
    const onScroll = () => {
      if (window.scrollY > 10) headerEl.classList.add('scrolled');
      else headerEl.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // chiamata iniziale
    onScroll();
  }
});
