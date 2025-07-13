const projects = [
  {
    date: "2010-2013",
    description: "Ristrutturazione edilizia centro parolare Mons. E. Motta, via Cavour 25 Seregno (MB)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Febbraio 2014",
    description: "Ristrutturazione edilizia Cusano Milanino (MI)",
    image: "img/progetto2.jpg"
  },
  {
    date: "Febbraio 2015 - Giugno 2015",
    description: "Ristrutturazione edilizia Villa Bosisio Parini (LC)",
    image: "img/progetto3.jpg"
  },
  {
    date: "Aprile 2015 - Ottobre 2017",
    description: "Realizzazione nuovi loft Carate Urio (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Gennaio 2016",
    description: "Realizzazione spogliatoi S. Fedele Intelvi (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Settembre 2016 - 2019",
    description: "Restauro conservatorio ex Pastificio Castelli Como (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Gennaio 2017 - 2018",
    description: "Realizzazione nuovi loft Argegno (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Febbraio 2019 - Agosto 2019",
    description: "Progettazione, direzione lavori, cambio destinazione d’uso uffici in n.2 alloggi Como Viale Lecco (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Agosto 2018 - Settembre 2020",
    description: "Ristrutturazione edilizia Cooperativa Villa Nova Moltrasio (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Giugno 2018 - 2019",
    description: "Progettazione e direzione lavori ristrutturazione edilizia Villa Ello (LC)",
    image: "img/progetto1.jpg"  
  },
  {
    date: "Febbraio 2019 - Novembre 2020",
    description: "Direzione lavori ristrutturazione e realizzazione 4 unità abitative S. Fermo (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Giugno 2019",
    description: "Progettazione e realizzazione serra bioclimatica Tenuta Motazeglio Invorio (NO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Novembre 2019 - Marzo 2020",
    description: "Supporto tecnico impresa AM per strutture in cartongesso Hotel Milano C.so Venezia (MI)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Gennaio 2020 - in completamento",
    description: "Progetto e direzione lavori ristrutturazione Villa Bosisio Parini (LC)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Febbraio 2020 - Febbraio 2021",
    description: "Realizzazione nuovi loft Carate Urio (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Aprile 2020 - Agosto 2020",
    description: "Direzione lavori ristrutturazione edilizia B&B S. Fermo della Battaglia (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Giugno 2020 - Novembre 2020",
    description: "Direzione lavori ristrutturazione area industriale Turate (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Giugno 2020",
    description: "Progetto nuovo complesso residenziale Montano Lucino (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Luglio 2020 - in completamento",
    description: "Progetto e direzione lavori recupero area industriale e formazione loft Lomazzo (CO)",
    image: "img/progetto1.jpg"
  },
  {
    date: "Novembre 2020 - in completamento",
    description: "Progetto e direzione lavori ristrutturazione edilizia B&GB Invorio (NO) pratica 110%",
    image: "img/progetto1.jpg"
  },
  {
    date: "Gennaio 2021 - in corso",
    description: "Progettazione industriale recupero area industriale Lomazzo (CO)",
    image: "img/progetto1.jpg"
  }
];

const timeline = document.getElementById("timeline");

projects.forEach(proj => {
  const item = document.createElement("div");
  item.className = "timeline-item";

  const date = document.createElement("div");
  date.className = "timeline-date";
  date.textContent = proj.date;

  const content = document.createElement("div");
  content.className = "timeline-content";

  const img = document.createElement("img");
  img.src = proj.image;
  img.alt = "Immagine progetto";
  img.className = "timeline-image";

  const desc = document.createElement("div");
  desc.className = "timeline-description";
  desc.textContent = proj.description;

  content.appendChild(img);
  content.appendChild(desc);

  item.appendChild(date);
  item.appendChild(content);
  timeline.appendChild(item);
});
