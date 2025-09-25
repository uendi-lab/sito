// ===============================
// MENU HAMBURGER
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // SLIDESHOW HOMEPAGE DA STRAPI
  // ===============================
  const slideshow = document.getElementById('slideshow');
  if (slideshow) {
    const SLIDES_API_URL = 'http://localhost:1337/api/slides?populate=*';
    fetch(SLIDES_API_URL)
      .then(res => res.json())
      .then(json => {
        console.log('Risposta Strapi slideshow:', json);
        const slides = json.data;
        if (!slides || slides.length === 0) {
          slideshow.innerHTML = '<p>Nessuna immagine disponibile.<br><pre>' + JSON.stringify(json, null, 2) + '</pre></p>';
          return;
        }
        let immaginiTrovate = false;
        slides.forEach((slide, idx) => {
          console.log('Slide', idx, slide);
          let imgData = slide.immagine;
          if (imgData && imgData.url) {
            immaginiTrovate = true;
            const imgUrl = imgData.url.startsWith('http') ? imgData.url : `http://localhost:1337${imgData.url}`;
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = `Slide ${idx+1}`;
            img.className = 'slide-img';
            if (idx !== 0) img.style.display = 'none';
            slideshow.appendChild(img);
          }
        });
        if (!immaginiTrovate) {
          slideshow.innerHTML = '<p>Nessuna immagine trovata nei dati.<br><pre>' + JSON.stringify(slides, null, 2) + '</pre></p>';
          return;
        }
        // Semplice slideshow automatico
        let current = 0;
        const images = slideshow.querySelectorAll('.slide-img');
        if (images.length > 1) {
          setInterval(() => {
            images[current].style.display = 'none';
            current = (current + 1) % images.length;
            images[current].style.display = 'block';
          }, 3000);
        }
      })
      .catch(err => {
        slideshow.innerHTML = '<p>Errore nel caricamento delle immagini.<br>' + err + '</p>';
        console.error('Errore slideshow:', err);
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
  const API_URL = 'http://localhost:1337/api/pietro-albinis?populate=*';
    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        const projectsData = json.data;
        console.log('projectsData:', projectsData);
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
          console.log('Descrizione:', proj.Descrizione);
          let descrizione = '';
          if (typeof proj.Descrizione === 'string') {
            descrizione = proj.Descrizione;
          } else if (proj.Descrizione && Array.isArray(proj.Descrizione)) {
            // Concatena tutti i testi dei children di tutti i paragrafi
            descrizione = proj.Descrizione.map(par =>
              Array.isArray(par.children)
                ? par.children.map(child => child.text || '').join('')
                : ''
            ).join('<br>');
          } else if (proj.Descrizione && Array.isArray(proj.Descrizione.blocks) && proj.Descrizione.blocks.length > 0) {
            // Caso: oggetto con blocks
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
          const item = document.createElement("div");
          item.className = "timeline-item";
          item.innerHTML = `
            <div class="timeline-left" style="max-width: 350px; word-break: break-word; z-index: 2; background: #fff; position: relative;">
              <h3>${proj.Nome}</h3>
              <div class="timeline-label">${data}</div>
              <div class="timeline-side-text">${descrizione}</div>
            </div>
            <div class="timeline-center"></div>
            <div class="timeline-content">
              ${imgUrl ? `<img src="http://localhost:1337${imgUrl}" alt="Copertina progetto" class="timeline-image">` : ''}
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
});


