# Spiegazione del Progetto: Sito Web per Studio di Architettura

Questo è un **sito web per uno studio di architettura** (Studio Albini) che mostra i progetti realizzati. Ecco come funziona in modo semplice:

## 🏗️ Struttura del Sito

Il sito è composto da **4 pagine principali**:

1. **Homepage** (`homepage.html`) - La pagina di arrivo con uno slideshow di immagini
2. **Chi siamo** (`chi-siamo.html`) - Presenta lo studio e l'architetto
3. **Realizzazioni** (`progetti2.html`) - Mostra i progetti professionali in una timeline
4. **Personali** (`personali.html`) - Mostra i progetti personali in una timeline

## 🎨 Come Appare il Sito

### Header (intestazione)
- **Logo** dello studio in alto a sinistra
- **Menu di navigazione** in alto a destra con i link alle varie sezioni
- Su **smartphone** il menu diventa un "hamburger" (quelle 3 lineette) che apre un menu laterale

### Homepage
- **Slideshow automatico**: le immagini di sfondo cambiano ogni 3,5 secondi con un effetto dissolvenza
- **Titolo centrale**: "Pietro Albini Geometra" con sottotitolo
- **Sfondo scuro** per dare risalto al testo bianco

### Pagine Progetti (Timeline)
- I progetti sono mostrati in una **linea del tempo verticale**
- Ogni progetto mostra:
  - **Nome del progetto** (cliccabile)
  - **Data** di realizzazione
  - **Descrizione breve**
  - **Immagine di copertina**
- La linea nera centrale collega tutti i progetti cronologicamente

### Pagina Chi Siamo
- **Sfondo chiaro** (diverso dalla homepage)
- **Testo di presentazione** dello studio
- **Sezione progetti in evidenza** con immagine e descrizione
- **Sezione contatti** con telefono, email e indirizzo

## ⚙️ Come Funziona Tecnicamente

### 1. I File CSS (stile grafico)
Il file `style.css` contiene tutte le istruzioni per l'aspetto visivo:
- **Colori**: nero per il testo, bianco per gli sfondi, grigio per elementi secondari
- **Dimensioni**: quanto deve essere grande il logo, il testo, le immagini
- **Posizionamento**: dove mettere gli elementi sulla pagina
- **Animazioni**: come far apparire gli elementi quando si scrolla
- **Responsive**: come adattare il sito su smartphone (menu hamburger, immagini più piccole)

### 2. Il File JavaScript Principale (`main.js`)
Questo file rende il sito "vivo" e interattivo:

#### a) **Menu Hamburger**
```javascript
hamburger.addEventListener('click', () => {
  nav.classList.add('open');
});
```
Quando clicchi sulle 3 lineette su smartphone, il menu si apre da destra.

#### b) **Slideshow Homepage**
```javascript
fetch('http://localhost:1337/api/slides?populate=*')
```
- Si collega a **Strapi** (un sistema per gestire contenuti)
- Scarica le immagini dello slideshow
- Le mostra una alla volta con dissolvenza
- Cambia immagine automaticamente ogni 3,5 secondi

#### c) **Timeline dei Progetti**
```javascript
fetch(API_URL)
  .then(res => res.json())
  .then(json => {
    const projectsData = json.data;
```
- Si collega a Strapi per prendere l'elenco dei progetti
- Li ordina per data (dal più recente)
- Crea per ogni progetto un "blocco" HTML con:
  - Titolo e link
  - Data formattata (es. 15/03/2024)
  - Descrizione
  - Immagine

#### d) **Animazione Scroll**
```javascript
if (itemTop < triggerBottom) {
  item.classList.add('active');
}
```
Quando scorri la pagina, i progetti della timeline "appaiono" gradualmente.

#### e) **Header che Cambia**
```javascript
if (window.scrollY > 10) headerEl.classList.add('scrolled');
```
Quando scorri la pagina, l'header diventa leggermente più scuro e ottiene un'ombra.

### 3. Il File JavaScript per Progetto Singolo (`project.js`)
Quando clicchi su un progetto dalla timeline:
- Legge l'**ID del progetto** dall'URL (es. `progetto.html?id=abc123`)
- Scarica da Strapi tutti i dettagli di quel progetto
- Mostra:
  - Titolo e data
  - Descrizione completa
  - Immagine di copertina
  - Galleria di tutte le immagini del progetto

## 🔄 Collegamento con Strapi (CMS)

**Strapi** è come un "database intelligente" dove l'architetto può:
- Caricare nuovi progetti
- Aggiungere foto
- Scrivere descrizioni
- Modificare tutto senza toccare il codice

Il sito **si aggiorna automaticamente** ogni volta che si ricarica la pagina, prendendo i dati più recenti da Strapi.

## 📱 Responsive Design

Il sito si adatta automaticamente a:
- **Desktop**: menu orizzontale, timeline a due colonne
- **Tablet**: layout intermedio
- **Smartphone**: 
  - Menu hamburger
  - Timeline verticale semplificata
  - Immagini adattate alla larghezza dello schermo

## 🎯 Punti di Forza del Progetto

1. **Gestione facile**: l'architetto può aggiornare i progetti senza saper programmare
2. **Design pulito**: stile minimalista professionale
3. **Animazioni fluide**: slideshow e apparizioni graduali
4. **Mobile-friendly**: funziona perfettamente su tutti i dispositivi
5. **Performance**: carica velocemente le immagini necessarie

In sintesi, è un **portfolio online dinamico** che presenta i lavori dello studio in modo elegante e professionale, con contenuti facilmente aggiornabili tramite un pannello di controllo separato (Strapi).

--- 

## ✅ SOLUZIONE 100% Gratuita

### Stack Gratuito Completo:

1. **Frontend** → **Netlify** (gratuito per sempre)
2. **Strapi Backend** → **Render.com** (piano gratuito)
3. **Database** → **PostgreSQL su Render** (gratuito)
4. **Immagini** → **Cloudinary** (gratuito fino a 25GB)

## 🚀 Guida Passo-Passo

### PARTE 1: Preparazione Strapi per il Deploy Gratuito

#### 1️⃣ Configura Cloudinary per le Immagini

Le immagini su Render gratuito si **cancellano** ad ogni riavvio. Serve un servizio esterno.

**Installa il plugin Cloudinary:**
```bash
cd [cartella-strapi]
npm install @strapi/provider-upload-cloudinary
```

**Registrati su Cloudinary:**
1. Vai su https://cloudinary.com
2. Registrati (piano gratuito: 25GB gratis)
3. Annota: `Cloud Name`, `API Key`, `API Secret`

**Configura Strapi** - Crea/modifica `config/plugins.js`:
```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
```

**Crea/modifica il file `.env`:**
```
CLOUDINARY_NAME=tuo-cloud-name
CLOUDINARY_KEY=tua-api-key
CLOUDINARY_SECRET=tuo-api-secret
```

### PARTE 2: Deploy Strapi su Render (Gratuito)

#### 1️⃣ Prepara il Progetto Strapi

**Modifica `config/database.js`** (per usare PostgreSQL in produzione):
```javascript
const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  const connections = {
    postgres: {
      connection: {
        connectionString: env('DATABASE_URL'),
        ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
        },
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          '..',
          env('DATABASE_FILENAME', '.tmp/data.db')
        ),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
```

**Modifica `config/server.js`:**
```javascript
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
```

**Installa PostgreSQL adapter:**
```bash
npm install pg
```

#### 2️⃣ Carica su GitHub

```bash
# Inizializza git (se non l'hai già fatto)
git init
git add .
git commit -m "Prepare for deployment"

# Crea repository su GitHub e carica
git remote add origin https://github.com/tuo-username/tuo-repo.git
git branch -M main
git push -u origin main
```

#### 3️⃣ Deploy su Render

1. Vai su **https://render.com** e registrati (con GitHub)
2. Clicca **"New +" → "Web Service"**
3. Connetti il tuo repository GitHub
4. Configura:
   - **Name**: `studio-albini-backend` (o come vuoi)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Seleziona **FREE**

5. Clicca **"Advanced"** e aggiungi le **Environment Variables**:

```
NODE_VERSION=18
DATABASE_CLIENT=postgres
DATABASE_URL=[lo copia Render automaticamente quando crei il database]
APP_KEYS=genera-una-stringa-casuale-lunga
API_TOKEN_SALT=genera-altra-stringa-casuale
ADMIN_JWT_SECRET=genera-altra-stringa-casuale
JWT_SECRET=genera-altra-stringa-casuale
PUBLIC_URL=https://tuo-servizio.onrender.com
CLOUDINARY_NAME=tuo-cloud-name
CLOUDINARY_KEY=tua-key
CLOUDINARY_SECRET=tuo-secret
```

**Per generare le chiavi casuali**, usa questo comando locale:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

6. Clicca **"Create Web Service"**

#### 4️⃣ Crea Database PostgreSQL Gratuito

1. Su Render, clicca **"New +" → "PostgreSQL"**
2. Configura:
   - **Name**: `studio-albini-db`
   - **Database**: `strapi`
   - **User**: `strapi`
   - **Plan**: **FREE**
3. Clicca **"Create Database"**
4. Copia l'**Internal Database URL**
5. Torna al tuo Web Service → **Environment** → Modifica `DATABASE_URL` con l'URL copiato

### PARTE 3: Deploy Frontend su Netlify

#### 1️⃣ Prepara i File Frontend

**Crea una cartella separata:**
```bash
mkdir frontend
cp homepage.html chi-siamo.html progetti2.html personali.html progetto.html frontend/
cp -r css js img frontend/
```

**Modifica `js/main.js` e `js/project.js`** - Sostituisci TUTTI i `http://localhost:1337` con:
```javascript
// All'inizio del file aggiungi:
const API_BASE = 'https://tuo-servizio.onrender.com'; // il tuo URL Render

// Poi usa così:
fetch(`${API_BASE}/api/slides?populate=*`)
fetch(`${API_BASE}/api/pietro-albinis?populate=*`)
// ecc...
```

#### 2️⃣ Deploy su Netlify

**Opzione A - Deploy Manuale (più semplice):**
1. Vai su **https://netlify.com** e registrati
2. Clicca **"Add new site" → "Deploy manually"**
3. Trascina la cartella `frontend`
4. Fatto! Ti dà un URL tipo `random-name.netlify.app`

**Opzione B - Deploy da GitHub (automatico):**
1. Carica la cartella frontend su GitHub
2. Su Netlify: **"New site from Git"**
3. Connetti il repository
4. Publish directory: `/` (se tutto è nella root) o `/frontend`
5. Deploy!

#### 3️⃣ Collega il Tuo Dominio

1. Su Netlify → **Domain settings**
2. **"Add custom domain"**
3. Inserisci `www.tuodominio.it`
4. Netlify ti dirà di configurare DNS

**Nel tuo provider di dominio** (Aruba, GoDaddy, etc):
1. Vai alla gestione DNS
2. Aggiungi record **CNAME**:
   ```
   Nome: www
   Valore: [tuo-sito].netlify.app
   TTL: 3600
   ```
3. Per il dominio nudo (`tuodominio.it`), Netlify ti darà istruzioni specifiche

 

### PARTE 4: Configurazione CORS in Strapi

Affinché il frontend possa comunicare con Strapi, devi configurare CORS.

**File `config/middlewares.js` in Strapi:**
```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com', // Per Cloudinary
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://www.tuodominio.it',
        'https://tuodominio.it',
        'https://tuo-sito.netlify.app', // URL Netlify temporaneo
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

**Commit e push** le modifiche:
```bash
git add .
git commit -m "Configure CORS and production settings"
git push
```

Render farà il deploy automaticamente!

 

## ⚠️ Limitazioni Piano Gratuito Render

**Importante da sapere:**

1. **Sleep dopo 15 minuti di inattività** 
   - Il primo accesso dopo inattività sarà lento (~30 secondi)
   - Soluzione: usa un servizio tipo **UptimeRobot** (gratuito) per "svegliare" il sito ogni 10 minuti

2. **750 ore/mese gratuite**
   - Più che sufficienti se è l'unico progetto
   - Se il sito "dorme", non consuma ore

3. **Riavvio ogni 90 giorni circa**
   - Le immagini su disco si cancellano (per questo usi Cloudinary!)

 

## 🎯 UptimeRobot (Evitare lo Sleep)

Per mantenere Strapi sempre sveglio:

1. Vai su **https://uptimerobot.com** (gratuito)
2. Registrati
3. **"Add New Monitor"**
4. Configura:
   - Type: `HTTP(s)`
   - URL: `https://tuo-servizio.onrender.com/api/slides`
   - Interval: `5 minutes`
5. Salva

Ora UptimeRobot "pingherà" Strapi ogni 5 minuti, mantenendolo sveglio!

 

## 📊 Riepilogo Costi

| Servizio | Piano | Costo |
|----------|-------|-------|
| **Netlify** (Frontend) | Free | €0 |
| **Render** (Strapi) | Free | €0 |
| **PostgreSQL** (Database) | Free | €0 |
| **Cloudinary** (Immagini) | Free | €0 |
| **UptimeRobot** (Keep alive) | Free | €0 |
| **Dominio** | Già tuo | €0* |
| **TOTALE** | | **€0/mese** |

*Escluso rinnovo annuale dominio che già possiedi


## ✅ Checklist Deployment

- [ ] Cloudinary configurato in Strapi
- [ ] PostgreSQL adapter installato (`npm install pg`)
- [ ] Database e CORS configurati
- [ ] Progetto Strapi su GitHub
- [ ] Web Service creato su Render
- [ ] Database PostgreSQL creato su Render
- [ ] Environment variables configurate
- [ ] URL API aggiornati nel frontend
- [ ] Frontend deployato su Netlify
- [ ] Dominio collegato
- [ ] UptimeRobot configurato
- [ ] Test completo del sito

 

## 🆘 Risoluzione Problemi Comuni

**"Render dice: Application failed to respond"**
- Controlla i logs su Render
- Verifica che `PORT` sia impostato correttamente (Render usa variabile ambiente)

**"Immagini non si vedono"**
- Verifica configurazione Cloudinary
- Ri-carica le immagini tramite pannello Strapi (verranno salvate su Cloudinary)

**"CORS error"**
- Controlla `config/middlewares.js`
- Aggiungi il dominio Netlify agli origin permessi

**"Sito lento al primo caricamento"**
- Normale con piano free Render (sleep mode)
- Configura UptimeRobot
