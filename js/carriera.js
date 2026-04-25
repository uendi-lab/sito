async function loadCarriera() {

  const leftCol = document.getElementById("timeline-left");
  const rightCol = document.getElementById("timeline-right");

  const [personaliRes, collabRes] = await Promise.all([
    fetch('http://localhost:1337/api/progetti-personalis?populate=*'),
    fetch('http://localhost:1337/api/pietro-albinis?populate=*')
  ]);

  const personali = (await personaliRes.json()).data || [];
  const collaborazioni = (await collabRes.json()).data || [];

  personali.sort((a,b)=>new Date(b.Data)-new Date(a.Data));
  collaborazioni.sort((a,b)=>new Date(b.Data)-new Date(a.Data));

  personali.forEach(p => {
    leftCol.innerHTML += createItem(p, 'left');
  });

  collaborazioni.forEach(c => {
    rightCol.innerHTML += createItem(c, 'right');
  });

  // 👉 CALCOLA LINEA DOPO IL RENDER
  setTimeout(adjustTimelineLines, 50);
}

function createItem(proj, side){

  let imgUrl = '';
  if (proj.Copertina?.url) {
    imgUrl = proj.Copertina.url.startsWith('http')
      ? proj.Copertina.url
      : `http://localhost:1337${proj.Copertina.url}`;
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

  return `
    <div class="timeline-item ${side}">
      <div class="timeline-dot"></div>

      ${side === 'left' ? `
        <div class="timeline-text left-text">
          <h3>${proj.Nome}</h3>
          <div class="date">${data}</div>
          <div class="desc">${descrizione}</div>
        </div>

        <div class="timeline-image">
          ${imgUrl ? `<img src="${imgUrl}" />` : ""}
        </div>
      ` : `
        <div class="timeline-image">
          ${imgUrl ? `<img src="${imgUrl}" />` : ""}
        </div>

        <div class="timeline-text right-text">
          <h3>${proj.Nome}</h3>
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