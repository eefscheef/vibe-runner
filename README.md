# Lava Labyrinth Parkour (TF2 Edition) — multiplayer

Only **one person (the host)** runs anything. Everyone else just opens a link in their browser.

## Easiest: host it online (Render)
Push this folder to a GitHub repository, then on render.com choose **New → Blueprint** and pick the repository
(`render.yaml` sets everything up). Share the `https://….onrender.com` link. The free tier sleeps after
~15 minutes without visitors; the first visit after that takes up to a minute.

## Or host it on your own PC (one-time setup)
1. Install **Node.js LTS** from https://nodejs.org
2. Unzip this folder and double-click **`start-server.bat`** (Windows) or run `./start-server.sh` (Mac/Linux).
   The first run downloads dependencies (needs internet, takes a minute).
3. If Windows asks whether Node.js may use the network, click **Allow** (private networks).
4. The window prints links like:
   ```
   You:            http://localhost:8080
   Friends (LAN):  http://192.168.1.45:8080
   ```
   Keep the window open while you play.

## Everyone
1. Open the link (host: `localhost`, friends: the `Friends (LAN)` link).
2. Click **WiFi / Co-op Lobby** → **Option 1: Host's Server**.
3. Use the same **Room Code** (default `WIFI-1`), then launch the run.
4. Rockets hit other pilots too: a hit sends them back to the start. New spawns get 2 seconds of protection.

## Troubleshooting
- **Friend's browser can't open the link:** you must be on the same WiFi/network, and the host's
  firewall must allow Node.js. If several `Friends` links are printed, try each one.
- **Don't run the server inside WSL** — WSL has its own internal network address that friends can't reach.
  Run `start-server.bat` from Windows itself.
- **Friend is in another house:** the LAN link won't work over the internet. Either forward port 8080
  on the host's router and share `http://<your-public-IP>:8080`, or use a tunnel such as
  `cloudflared tunnel --url http://localhost:8080` and share the https link it prints.
  Multiplayer connects automatically through either.
- **Different port:** set `PORT`, e.g. `set PORT=3000` before `npm start`.

## For developers
- `npm start` — build and run the server (game + multiplayer on one port)
- `npm run dev` — hot-reload dev server; for multiplayer also run `npm run build` once, then `npm run serve` alongside it
- `src/App.jsx` — the whole game; `server.js` — static file server + room relay on `/ws`
