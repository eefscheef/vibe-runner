// One server for everything: serves the built game (dist/) and relays multiplayer on /ws.
// Friends only need a browser and the link printed below.
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT) || 8080;
const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('No build found. Run "npm start" (it builds first) instead of "npm run serve".');
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.normalize(path.join(DIST, urlPath));
  if (!file.startsWith(DIST)) {
    res.writeHead(403).end();
    return;
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html');
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

// Session leaderboards: kept in memory per room, so they reset when the server restarts.
const runsByRoom = new Map(); // room -> [{ name, time, score }]
const MAX_RUNS_PER_ROOM = 500;

// Each pilot's best run per category, top 10
function bestPerPilot(runs, better) {
  const best = new Map();
  for (const run of runs) {
    const cur = best.get(run.name);
    if (!cur || better(run, cur) < 0) best.set(run.name, run);
  }
  return [...best.values()].sort(better).slice(0, 10);
}

function leaderboardMessage(room) {
  const runs = runsByRoom.get(room) || [];
  return JSON.stringify({
    type: 'LEADERBOARD',
    room,
    fastest: bestPerPilot(runs, (a, b) => a.time - b.time),
    score: bestPerPilot(runs, (a, b) => b.score - a.score || a.time - b.time),
  });
}

function recordRun(room, msg) {
  const time = Number(msg.time);
  const score = Math.round(Number(msg.score));
  if (!Number.isFinite(time) || time <= 0 || time > 3600) return false;
  if (!Number.isFinite(score) || score < 0 || score > 10_000_000) return false;
  const name = String(msg.name || 'PILOT').slice(0, 14);
  const runs = runsByRoom.get(room) || [];
  runs.push({ name, time: Math.round(time * 100) / 100, score });
  if (runs.length > MAX_RUNS_PER_ROOM) runs.shift();
  runsByRoom.set(room, runs);
  return true;
}

// Relay: forward each player's updates to everyone else in the same room.
const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }
    if (msg.id) ws.peerId = String(msg.id);
    if (msg.room) {
      const room = String(msg.room).toUpperCase();
      if (room !== ws.room) {
        ws.room = room;
        ws.send(leaderboardMessage(room)); // show the room's board as soon as you join
      }
    }
    if (msg.type === 'RUN_FINISHED') {
      if (ws.room && recordRun(ws.room, msg)) {
        const board = leaderboardMessage(ws.room);
        for (const client of wss.clients) {
          if (client.readyState === 1 && client.room === ws.room) client.send(board);
        }
      }
      return;
    }
    const out = JSON.stringify(msg);
    for (const client of wss.clients) {
      if (client !== ws && client.readyState === 1 && client.room === ws.room) client.send(out);
    }
  });
  ws.on('close', () => {
    if (!ws.peerId) return;
    const out = JSON.stringify({ type: 'LEAVE', id: ws.peerId });
    for (const client of wss.clients) {
      if (client.readyState === 1 && client.room === ws.room) client.send(out);
    }
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') console.error(`Port ${PORT} is already in use. Close the other server or set PORT=xxxx.`);
  else console.error(err);
  process.exit(1);
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const iface of list || []) {
      if (iface.family === 'IPv4' && !iface.internal) ips.push(iface.address);
    }
  }
  console.log('====================================================');
  console.log(' LAVA LABYRINTH PARKOUR - GAME SERVER RUNNING');
  console.log('====================================================');
  console.log(` You:            http://localhost:${PORT}`);
  for (const ip of ips) console.log(` Friends (LAN):  http://${ip}:${PORT}`);
  console.log('');
  console.log(' Everyone: open the game, click "WiFi / Co-op Lobby",');
  console.log(' pick Option 1 and use the same Room Code.');
  console.log(' Keep this window open while playing. Ctrl+C to stop.');
  console.log('====================================================');
});
