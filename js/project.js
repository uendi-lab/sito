// js/project.js
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}


const projectId = getQueryParam('id');
const tipo = getQueryParam('tipo');

if (projectId) {
  console.log('Project ID:', projectId);
  // Scegli endpoint in base al tipo
  let endpoint = `http://localhost:1337/api/pietro-albinis/${projectId}?populate=*`;
  if (tipo === 'personale') {
    endpoint = `http://localhost:1337/api/progetti-personalis/${projectId}?populate=*`;
  }
  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      console.log('Risposta completa:', data);
      const progetto = data.data;
      console.log('Dati progetto ricevuti:', progetto);

      if (!progetto || !progetto.Nome) {
        document.getElementById('project-title').textContent = 'Progetto non trovato.';
        return;
      }

      const attrs = progetto;

      document.getElementById('project-title').textContent = attrs.Nome || 'Senza nome';

      // Data
      let dataFormattata = '';
      if (attrs.Data) {
        const [year, month, day] = attrs.Data.split('T')[0].split('-');
        dataFormattata = `${day}/${month}/${year}`;
      }
      document.getElementById('project-date').textContent = dataFormattata;

      // Descrizione
      const desc = Array.isArray(attrs.Descrizione)
        ? attrs.Descrizione[0]?.children?.[0]?.text || ''
        : attrs.Descrizione;
      document.getElementById('project-description').textContent = desc || 'Nessuna descrizione disponibile.';

      // Copertina
      const coverDiv = document.getElementById('project-cover');
      coverDiv.innerHTML = '';
      if (attrs.Copertina?.url) {
        const coverUrl = attrs.Copertina.url.startsWith('http')
          ? attrs.Copertina.url
          : `http://localhost:1337${attrs.Copertina.url}`;
        const img = document.createElement('img');
        img.src = coverUrl;
        img.alt = 'Copertina progetto';
        img.className = 'project-cover-img';
        coverDiv.appendChild(img);
        console.log('Copertina URL:', coverUrl);
      }

      // Galleria immagini
      const imagesGrid = document.getElementById('project-images');
      imagesGrid.innerHTML = '';

      if (Array.isArray(attrs.Immagini) && attrs.Immagini.length > 0) {
        console.log('Numero immagini:', attrs.Immagini.length);

        attrs.Immagini.forEach(imgObj => {
          const attr = imgObj; // già l’oggetto corretto
          let imgUrl = attr.formats?.small?.url || attr.url;
          if (!imgUrl) return;
          if (!imgUrl.startsWith('http')) {
            imgUrl = `http://localhost:1337${imgUrl}`;
          }
          console.log('Final img URL:', imgUrl);

          const img = document.createElement('img');
          img.src = imgUrl;
          img.alt = attrs.Nome || 'Progetto';
          img.className = 'project-img';
          imagesGrid.appendChild(img);
        });
      } else {
        imagesGrid.textContent = 'Nessuna immagine disponibile.';
      }
    })
    .catch(err => {
      document.getElementById('project-title').textContent = 'Errore nel caricamento del progetto.';
      console.error('Errore fetch progetto:', err);
    });
}
