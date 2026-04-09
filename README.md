# Classroom Crossword

Real-time classroom crossword app:
- frontend (Vite + React)
- backend (Node WebSocket server in `server.js`)

## Local development

1. Install dependencies:
   - `npm install`
2. Run frontend:
   - `npm run dev`
3. Run backend (separate terminal):
   - `npm run server`

Frontend defaults to `ws://<current-host>:3001` unless `VITE_WS_URL` is set.

## Environment variables

Copy `.env.example` to your own env files as needed.

- `VITE_WS_URL`: full websocket URL used by frontend (example: `wss://my-backend.onrender.com`)
- `PORT`: backend websocket port (host providers usually inject this automatically)
- `CROSSWORD_VARIANT`: `A` or `B` on the backend

## Deploy frontend to Vercel

1. Push repo to GitHub.
2. In Vercel, import the GitHub repository.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. In Vercel project settings, add env var:
   - `VITE_WS_URL = wss://<your-backend-domain>`
7. Redeploy.

## Deploy backend (WebSocket) to Render

Vercel serverless functions are not a good fit for long-lived WebSocket servers, so host `server.js` on a Node host such as Render/Railway/Fly.io.

### Render quick setup

1. Create a new `Web Service` from this repo.
2. Runtime: `Node`.
3. Build command: `npm install`.
4. Start command: `npm run server`.
5. Environment variable (optional):
   - `CROSSWORD_VARIANT = A` (or `B`)
6. Deploy and copy your service URL.
7. Set `VITE_WS_URL` in Vercel to that `wss://...` URL and redeploy frontend.

## Deploy backend (alternative: Railway)

1. New project from GitHub repo.
2. Start command: `npm run server`.
3. Railway injects `PORT` automatically.
4. Copy public URL and set `VITE_WS_URL` in Vercel.
