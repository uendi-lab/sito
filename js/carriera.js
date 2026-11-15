// STRAPI_URL è definita in main.js (caricato prima di questo script)

async function loadCarriera() {

  const leftCol = document.getElementById("timeline-left");
  const rightCol = document.getElementById("timeline-right");

  const [personaliRes, collabRes] = await Promise.all([
    fetch(`${STRAPI_URL}/api/progetti-personalis?populate=*`),
    fetch(`${STRAPI_URL}/api/pietro-albinis?populate=*`)
  ]);

  const personali = (await personaliRes.json()).data || [];
  const collaborazioni = (await collabRes.json()).data || [];

  personali.sort((a,b)=>new Date(b.Data)-new Date(a.Data));
  collaborazioni.sort((a,b)=>new Date(b.Data)-new Date(a.Data));


  personali.forEach(p => {
    leftCol.innerHTML += createItem(p, 'left', true);
  });

  collaborazioni.forEach(c => {
    rightCol.innerHTML += createItem(c, 'right', false);
  });

  // 👉 Calcola linea dopo il render iniziale
  setTimeout(adjustTimelineLines, 50);
  setTimeout(adjustTimelineLines, 300);

  // Ricalcola con precisione ogni volta che un'immagine termina il caricamento
  const allImages = document.querySelectorAll('.timeline-column img');
  allImages.forEach(img => {
    if (!img.complete) {
      img.addEventListener('load', adjustTimelineLines);
    }
  });
}

function createItem(proj, side, isPersonale){

  let imgUrl = '';
  if (proj.Copertina?.url) {
    imgUrl = proj.Copertina.url.startsWith('http')
      ? proj.Copertina.url
      : `${STRAPI_URL}${proj.Copertina.url}`;
  }

  let data = '';
  if (proj.Data) {
    const [y,m,d] = proj.Data.split('T')[0].split('-');
    data = `${d}/${m}/${y}`;
  }

  let descrizione = '';
  if (typeof proj.Descrizione === 'string') {
    descrizione = proj.Descrizione;
  } else if (proj.Descrizione && Array.isArray(proj.Descrizione)) {
    descrizione = proj.Descrizione.map(par =>
      Array.isArray(par.children)
        ? par.children.map(child => child.text || '').join('')
        : ''
    ).join('<br>');
  }

  // Costruisci link al dettaglio progetto
  const projectId = proj.documentId;
  const projectLink = isPersonale
    ? `progetto.html?id=${projectId}&tipo=personale`
    : `progetto.html?id=${projectId}`;

  return `
    <div class="timeline-item ${side}">
      <div class="timeline-dot"></div>

      ${side === 'left' ? `
        <div class="timeline-text left-text">
          <h3><a href="${projectLink}" class="timeline-title-link">${proj.Nome}</a></h3>
          <div class="date">${data}</div>
          <div class="desc">${descrizione}</div>
        </div>

        <div class="timeline-image">
          ${imgUrl ? `<a href="${projectLink}"><img src="${imgUrl}" /></a>` : ""}
        </div>
      ` : `
        <div class="timeline-image">
          ${imgUrl ? `<a href="${projectLink}"><img src="${imgUrl}" /></a>` : ""}
        </div>

        <div class="timeline-text right-text">
          <h3><a href="${projectLink}" class="timeline-title-link">${proj.Nome}</a></h3>
          <div class="date">${data}</div>
          <div class="desc">${descrizione}</div>
        </div>
      `}
    </div>
  `;
}

/* 🔥 FUNZIONE CHIAVE */
function adjustTimelineLines() {
  const columns = document.querySelectorAll('.timeline-column');

  columns.forEach(col => {
    const dots = col.querySelectorAll('.timeline-dot');
    if (dots.length < 2) return;

    const colRect = col.getBoundingClientRect();

    const firstRect = dots[0].getBoundingClientRect();
    const lastRect = dots[dots.length - 1].getBoundingClientRect();

    const top = firstRect.top - colRect.top;
    const height = lastRect.top - firstRect.top;

    col.style.setProperty('--line-top', `${top}px`);
    col.style.setProperty('--line-height', `${height}px`);
  });
}

window.addEventListener('load', adjustTimelineLines);
window.addEventListener('resize', adjustTimelineLines);

loadCarriera();