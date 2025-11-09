# Deploy rapido: Strapi su Render + frontend su Netlify

Questa guida ti porta passo-passo a mettere online il progetto usando:
- Strapi (cartella `cms-architetto`) su Render (Web Service) — community Strapi gratuita.
- Frontend (file HTML/CSS/JS nella root) su Netlify (sito statico).

Prerequisiti
- un account GitHub (o Git provider supportato da Render/Netlify)
- account su Render (https://render.com) e Netlify (https://netlify.com)
- dominio (lo hai già). Avrai bisogno di poter modificare i record DNS presso il provider del dominio.

Panoramica dei passaggi
1. Metti il codice su GitHub (se non già presente).
2. Preparare Strapi localmente: test build e `.env` (usa `.env.example` come base).
3. Connetti il repo a Render e crea il Web Service per Strapi; configura env vars e Postgres.
4. Connetti il repo a Netlify per il frontend o carica la cartella statica; associa dominio.
5. Modifica i record DNS: punta `api.tuodominio.com` a Render e `www.tuodominio.com` a Netlify.

Dettagli step-by-step

1) Mettere il repo su GitHub

- Se il progetto non è su GitHub, inizializza e push:

```powershell
cd "c:\Users\prift\Desktop\sito pietro albini"
git init
git add .
git commit -m "Initial commit"
# crea il repo su GitHub e poi
git remote add origin https://github.com/<tuo-utente>/<tuo-repo>.git
git branch -M main
git push -u origin main
```

2) Preparazione locale Strapi (test prima di deploy)

- Vai nella cartella Strapi, installa dipendenze, crea `.env` da `.env.example`, build e testa.

```powershell
cd cms-architetto
npm ci
copy .env.example .env
# Modifica .env con valori reali (almeno APP_KEYS, JWT_SECRET). Per test locale puoi lasciare DATABASE_CLIENT=sqlite
npm run build
npm run start
```

- Visita `http://localhost:1337/admin` per verificare che l'admin si apra.

3) Deploy Strapi su Render

- Sul sito di Render:
  - New -> Web Service -> Connect to GitHub -> scegli il repo e la cartella `cms-architetto`.
  - Build Command: `npm ci && npm run build`
  - Start Command: `npm run start`
  - Environment: seleziona `Docker` se preferisci usare Dockerfile, o `Node` (Render esegue npm install/build) — consigliato: usare il repo (build command come sopra).

- Aggiungi env vars su Render (Settings -> Environment). Imposta almeno:
  - `HOST` = `0.0.0.0`
  - `PORT` = `1337` (Render fornisce `PORT` dinamico, ma va bene impostarlo)
  - `APP_KEYS` = (valore sicuro, es. generane 2-4 con random)
  - `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT` = valori segreti
  - DB: per Postgres crea un Render Managed Database o usa Supabase; poi imposta `DATABASE_CLIENT=postgres` e i dettagli:
    - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
  - Oppure imposta `DATABASE_URL=postgres://user:pass@host:5432/dbname`

- Se vuoi partire subito senza DB esterno (solo per test) puoi lasciare `DATABASE_CLIENT=sqlite` (default) ma ricorda: su Render lo storage del container non è persistente a lungo — non usare per produzione.

4) Aggiungere Postgres (consigliato)

- Su Render: Create -> Database -> Postgres
  - Scegli piano (free o starter se disponibile)
  - Dopo creazione, copia la connection string e incolla su Web Service env come `DATABASE_URL` o le singole variabili.

5) Domini e DNS per Strapi

- Su Render, nella pagina del servizio -> Custom Domains, aggiungi `api.tuodominio.com`.
- Render fornirà un CNAME tipo `your-service.onrender.com` o istruzioni A record; nel pannello DNS del tuo registrar crea:
  - `api` CNAME -> `<your-service>.onrender.com` (o A record indicato da Render)
- Attendi la propagazione e abilita HTTPS (Render abilita Let's Encrypt automaticamente).

6) Deploy frontend su Netlify (sito statico)

- Option A (consigliata): collega repo a Netlify
  - Netlify -> New site -> Import from Git -> scegli repo
  - Build settings: se non usi generator, puoi pubblicare la cartella root. Se non c'è build step, imposta "Build command" vuoto e "Publish directory" come `/` (o la cartella dove sono gli HTML)
  - Deploy site. Netlify ti darà `<sitename>.netlify.app`.

- Option B: drag&drop dei file nella UI di Netlify se preferisci.

7) DNS per il frontend

- Su Netlify, dalla sezione Domain settings aggiungi `www.tuodominio.com` come Custom domain.
- Netlify indicherà i record DNS da aggiungere; tipicamente:
  - `www` CNAME -> `<sitename>.netlify.app`
  - Per il dominio apex (tuodominio.com) usa un ALIAS/ANAME o i record A che Netlify fornisce, oppure instrada l'apex a Netlify DNS.
- Dopo verifica, Netlify fornisce certificato SSL automatico.

8) Test finali

- Visita `https://www.tuodominio.com` (frontend) e `https://api.tuodominio.com/admin` (Strapi admin).
- Se il frontend chiama API, assicurati di usare l'URL `https://api.tuodominio.com` nelle chiamate fetch/CORS.

Consigli di sicurezza e produzione
- Non usare SQLite in produzione.
- Mantieni segreti in Environment variables; non committarli.
- Configura backup per Postgres (Render offre snapshot) e storage per upload (S3/Spaces).
- Proteggi l'admin: usa password forte e considera IP allowlist o 2FA.

Informazioni utili / comandi rapidi

- Build e test locale Strapi:

```powershell
cd cms-architetto
npm ci
copy .env.example .env
# edit .env for secrets
npm run build
npm run start
```

- Se preferisci usare Docker (utile per Render Docker o Fly):

```powershell
cd cms-architetto
docker build -t cms-architetto:latest .
docker run -p 1337:1337 --env-file .env cms-architetto:latest
```

---
Se vuoi, nella fase successiva posso:
- Generare un `.github/workflows/deploy.yml` per far fare a Netlify/Render deploy automatico al push su `main`.
- Preparare la configurazione Nginx + systemd se preferisci usare una VPS invece di Render.
- Aiutarti a creare le secret env values (APP_KEYS, JWT) generati in modo sicuro.

Dimmi se vuoi che proceda generando il workflow GitHub Actions e i segreti (posso produrre i file pronti da inserire nel repo).
