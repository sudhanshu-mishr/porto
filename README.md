# PresetFolio MVP

Single-service web app for Render deployment.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000

## Deploy on Render

1. Push this repo to GitHub.
2. In Render, create a new **Web Service** from the repo.
3. Render auto-detects `render.yaml` and uses:
   - Build: `npm install`
   - Start: `npm start`
