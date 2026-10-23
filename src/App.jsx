import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Play, RotateCcw, Download, Flame, Zap, Compass, ShieldAlert, 
  Award, Volume2, VolumeX, Terminal, ChevronRight, HelpCircle, Crosshair, Skull, Target,
  Users, Wifi, Radio, Copy, Check
} from 'lucide-react';

// ==========================================
// PROCEDURAL WEB AUDIO SYNTHESIZER
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playJump(isWallJump = false) {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isWallJump ? 'triangle' : 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(isWallJump ? 240 : 160, now);
    osc.frequency.exponentialRampToValueAtTime(isWallJump ? 620 : 420, now + 0.16);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playSlideBoost() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.25);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playWallAttach() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.09);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playPlatformErupt() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.35);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.38);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  playLavaBurn() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.55);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.55);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  }

  playBazookaFire() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(195, now);
    osc.frequency.exponentialRampToValueAtTime(44, now + 0.28);
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  playExplosion(isKill = false, streak = 1) {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(22, now + 0.48);
    gain.gain.setValueAtTime(0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.008, now + 0.48);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.48);

    // Arcade kill chime that pitches up with streak
    if (isKill) {
      const pitchShift = Math.min(1.6, 1 + (streak - 1) * 0.1);
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.055;
        const kOsc = this.ctx.createOscillator();
        const kGain = this.ctx.createGain();
        kOsc.type = 'square';
        kOsc.frequency.setValueAtTime(freq * pitchShift, t);
        kGain.gain.setValueAtTime(0.16, t);
        kGain.gain.exponentialRampToValueAtTime(0.008, t + 0.22);
        kOsc.connect(kGain);
        kGain.connect(this.ctx.destination);
        kOsc.start(t);
        kOsc.stop(t + 0.22);
      });
    }
  }
}

const sfx = new SoundFX();

// ==========================================
// 3D WALL-CLINGING CYBORG ENEMY BUILDER
// (White Hoodie + Black Pants + White Sneakers + Cyber Visor)
// ==========================================
function createWallCyborgMesh() {
  const group = new THREE.Group();

  const whiteHoodieMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.38,
    metalness: 0.12,
  });
  const blackPantsMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.65,
    metalness: 0.15,
  });
  const titaniumChassisMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.3,
    metalness: 0.85,
  });
  const visorMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
  });
  const coreGlowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
  });
  const whiteSneakerMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.1,
  });
  const sneakerSoleMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
  });

  // White Hoodie Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.22, 1.5, 0.72), whiteHoodieMat);
  torso.position.set(0, 0.25, 0);
  group.add(torso);

  // Front Kangaroo Hoodie Pocket & Drawstrings
  const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.48, 0.78), whiteHoodieMat);
  pouch.position.set(0, -0.14, 0.02);
  group.add(pouch);

  // Glowing Cyborg Chest Emblem
  const chestCore = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.79), coreGlowMat);
  chestCore.position.set(0, 0.52, 0.02);
  group.add(chestCore);

  // Sculpted White Hoodie Hood (Up over the cyborg head)
  const hoodOuter = new THREE.Mesh(new THREE.BoxGeometry(1.06, 1.06, 0.96), whiteHoodieMat);
  hoodOuter.position.set(0, 1.32, -0.02);
  group.add(hoodOuter);

  const hoodTop = new THREE.Mesh(new THREE.SphereGeometry(0.56, 12, 12), whiteHoodieMat);
  hoodTop.position.set(0, 1.68, -0.05);
  group.add(hoodTop);

  // Cyborg Head Chassis Inside the White Hood
  const cyberHead = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.78, 0.76), titaniumChassisMat);
  cyberHead.position.set(0, 1.3, 0.08);
  group.add(cyberHead);

  // Glowing LED Cybernetic Nerd-Frame Visor
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.24, 0.16), visorMat);
  visor.position.set(0, 1.34, 0.44);
  group.add(visor);

  // Cybernetic Twin Antennae
  const leftAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 8), titaniumChassisMat);
  leftAntenna.position.set(-0.38, 1.92, -0.05);
  leftAntenna.rotation.z = 0.2;
  group.add(leftAntenna);

  const rightAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 8), titaniumChassisMat);
  rightAntenna.position.set(0.38, 1.92, -0.05);
  rightAntenna.rotation.z = -0.2;
  group.add(rightAntenna);

  // White Hoodie Arms Clinging Outward to the Wall
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.2, 0.36), whiteHoodieMat);
  leftArm.position.set(-0.86, 0.45, -0.15);
  leftArm.rotation.z = 0.48;
  leftArm.rotation.x = -0.35;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.2, 0.36), whiteHoodieMat);
  rightArm.position.set(0.86, 0.45, -0.15);
  rightArm.rotation.z = -0.48;
  rightArm.rotation.x = -0.35;
  group.add(rightArm);

  // Magnetic Wall-Clinging Claws
  const leftClaw = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), coreGlowMat);
  leftClaw.position.set(-1.14, 0.9, -0.35);
  group.add(leftClaw);

  const rightClaw = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), coreGlowMat);
  rightClaw.position.set(1.14, 0.9, -0.35);
  group.add(rightClaw);

  // Black Pants Pelvis & Legs (Wall-clinging parkour stance)
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.44, 0.66), blackPantsMat);
  pelvis.position.set(0, -0.64, 0);
  group.add(pelvis);

  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.28, 0.44), blackPantsMat);
  leftLeg.position.set(-0.44, -1.34, -0.08);
  leftLeg.rotation.z = 0.22;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.28, 0.44), blackPantsMat);
  rightLeg.position.set(0.44, -1.34, -0.08);
  rightLeg.rotation.z = -0.22;
  group.add(rightLeg);

  // Crisp White Sneakers with Cyan Trim
  const leftSneaker = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.68), whiteSneakerMat);
  leftSneaker.position.set(-0.58, -1.94, 0.08);
  group.add(leftSneaker);

  const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.7), sneakerSoleMat);
  leftSole.position.set(-0.58, -2.08, 0.08);
  group.add(leftSole);

  const rightSneaker = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.68), whiteSneakerMat);
  rightSneaker.position.set(0.58, -1.94, 0.08);
  group.add(rightSneaker);

  const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.7), sneakerSoleMat);
  rightSole.position.set(0.58, -2.08, 0.08);
  group.add(rightSole);

  return group;
}

// ==========================================
// 3D REMOTE PILOT AVATAR BUILDER (CO-OP / WIFI RIVAL)
// ==========================================
function createRemotePilotMesh(colorHex = 0x00f0ff) {
  const group = new THREE.Group();

  const suitMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.6,
  });
  const neonMat = new THREE.MeshBasicMaterial({
    color: colorHex,
  });
  const visorMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
  });

  // Pilot Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.35, 0.65), suitMat);
  torso.position.set(0, -0.35, 0);
  group.add(torso);

  // Jump-Kit Thruster Pack on Back (Glows bright when wallrunning)
  const jumpKit = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.65, 0.35), neonMat);
  jumpKit.position.set(0, -0.35, 0.45);
  group.add(jumpKit);

  // Pilot Tactical Helmet
  const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.72, 0.76), suitMat);
  helmet.position.set(0, 0.7, 0);
  group.add(helmet);

  // Glowing Titanfall Pilot Visor
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.24, 0.12), visorMat);
  visor.position.set(0, 0.72, -0.36);
  group.add(visor);

  // Shoulder & Leg Armor
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 0.4), suitMat);
  leftLeg.position.set(-0.32, -1.5, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 0.4), suitMat);
  rightLeg.position.set(0.32, -1.5, 0);
  group.add(rightLeg);

  // Equipped Bazooka on Right Shoulder
  const launcher = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.35, 12), neonMat);
  launcher.rotation.x = Math.PI / 2;
  launcher.position.set(0.68, 0.05, -0.2);
  group.add(launcher);

  return group;
}

// ==========================================
// FIRST-PERSON 3D BAZOOKA VIEWMODEL BUILDER
// ==========================================
function createBazookaViewModel() {
  const gunGroup = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.85,
  });
  const barrelTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.3,
    metalness: 0.6,
  });
  const neonMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
  });
  const darkMuzzleMat = new THREE.MeshBasicMaterial({
    color: 0x090d16,
  });

  // Main Launcher Tube (aligned along Z axis)
  const mainTube = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.105, 1.35, 16), bodyMat);
  mainTube.rotation.x = Math.PI / 2;
  gunGroup.add(mainTube);

  // Heavy Flared Muzzle Cone
  const frontCone = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.095, 0.22, 16), barrelTrimMat);
  frontCone.rotation.x = Math.PI / 2;
  frontCone.position.set(0, 0, -0.72);
  gunGroup.add(frontCone);

  // Muzzle Bore
  const bore = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.05, 16), darkMuzzleMat);
  bore.rotation.x = Math.PI / 2;
  bore.position.set(0, 0, -0.82);
  gunGroup.add(bore);

  // Glowing Energy Cooling Ribs
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.035, 16), neonMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0, -0.25 - i * 0.16);
    gunGroup.add(ring);
  }

  // Holographic Side Sight
  const sightFrame = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.2), bodyMat);
  sightFrame.position.set(-0.11, 0.09, -0.35);
  gunGroup.add(sightFrame);

  const sightGlass = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 0.02), neonMat);
  sightGlass.position.set(-0.11, 0.1, -0.35);
  gunGroup.add(sightGlass);

  // Position in Bottom-Right First-Person View
  gunGroup.position.set(0.42, -0.34, -0.68);
  gunGroup.rotation.y = 0.06;
  return gunGroup;
}

// ==========================================
// LABYRINTH & LEVEL GENERATOR
// ==========================================
const CELL_SIZE = 18;
const WALL_HEIGHT = 42;

// 13x13 maze (1 = wall, 0 = corridor, 2 = spawn, 3 = exit). Several loops, so there is more than one route.
// Fixed layout so every pilot in a lobby runs the same maze.
const MAZE_GRID = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// ==========================================
// ANGLED MAZE WALLS (convex prisms instead of grid-aligned boxes)
// ==========================================
const WALL_CHAMFER = 5; // cut off exposed outer corners of wall blocks
const CORNER_FILL = 6; // angled fill in the inside corners of turns

// Outward edge normals + bounds, so collision checks are cheap
function makePrism(verts, minY, maxY) {
  // Same winding for every outline (NW -> NE -> SE -> SW order), so faces point outwards
  let area = 0;
  verts.forEach((a, i) => {
    const b = verts[(i + 1) % verts.length];
    area += a.x * b.z - b.x * a.z;
  });
  if (area < 0) verts = [...verts].reverse();
  const cx = verts.reduce((s, v) => s + v.x, 0) / verts.length;
  const cz = verts.reduce((s, v) => s + v.z, 0) / verts.length;
  const edges = verts.map((a, i) => {
    const b = verts[(i + 1) % verts.length];
    let nx = b.z - a.z;
    let nz = -(b.x - a.x);
    const len = Math.hypot(nx, nz);
    nx /= len;
    nz /= len;
    if (nx * (a.x - cx) + nz * (a.z - cz) < 0) {
      nx = -nx;
      nz = -nz;
    }
    return { a, b, nx, nz, d: nx * a.x + nz * a.z };
  });
  return {
    verts,
    edges,
    minY,
    maxY,
    minX: Math.min(...verts.map((v) => v.x)),
    maxX: Math.max(...verts.map((v) => v.x)),
    minZ: Math.min(...verts.map((v) => v.z)),
    maxZ: Math.max(...verts.map((v) => v.z)),
  };
}

// Signed distance from point (px, pz) to the prism outline (negative = inside),
// plus the direction to push out along. Returns null when farther than maxDist.
function prismContact(prism, px, pz, maxDist) {
  if (
    px < prism.minX - maxDist ||
    px > prism.maxX + maxDist ||
    pz < prism.minZ - maxDist ||
    pz > prism.maxZ + maxDist
  ) {
    return null;
  }
  let best = -Infinity;
  let bestEdge = null;
  for (const e of prism.edges) {
    const s = e.nx * px + e.nz * pz - e.d;
    if (s > best) {
      best = s;
      bestEdge = e;
    }
  }
  if (best <= 0) return { dist: best, nx: bestEdge.nx, nz: bestEdge.nz };

  // Outside: nearest point on the outline
  let minD = Infinity;
  let nx = 0;
  let nz = 0;
  for (const e of prism.edges) {
    const ex = e.b.x - e.a.x;
    const ez = e.b.z - e.a.z;
    const tt = Math.max(0, Math.min(1, ((px - e.a.x) * ex + (pz - e.a.z) * ez) / (ex * ex + ez * ez)));
    const qx = e.a.x + ex * tt;
    const qz = e.a.z + ez * tt;
    const d = Math.hypot(px - qx, pz - qz);
    if (d < minD) {
      minD = d;
      if (d > 1e-6) {
        nx = (px - qx) / d;
        nz = (pz - qz) / d;
      } else {
        nx = e.nx;
        nz = e.nz;
      }
    }
  }
  if (minD > maxDist) return null;
  return { dist: minD, nx, nz };
}

// Wall blocks with chamfered outer corners, plus angled fills in inside corners
function buildMazeWallPrisms(grid, cellSize, offsetX, offsetZ, minY, maxY) {
  const isWall = (r, c) => r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === 1;
  // Corners in order NW, NE, SE, SW: [dx, dz] sign and the neighbour offsets that touch them
  const corners = [
    { sx: 0, sz: 0, a: [-1, 0], b: [0, -1], diag: [-1, -1], inX: 1, inZ: 1 },
    { sx: 1, sz: 0, a: [-1, 0], b: [0, 1], diag: [-1, 1], inX: -1, inZ: 1 },
    { sx: 1, sz: 1, a: [1, 0], b: [0, 1], diag: [1, 1], inX: -1, inZ: -1 },
    { sx: 0, sz: 1, a: [1, 0], b: [0, -1], diag: [1, -1], inX: 1, inZ: -1 },
  ];
  const prisms = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const x0 = offsetX + c * cellSize;
      const z0 = offsetZ + r * cellSize;
      if (grid[r][c] === 1) {
        const verts = [];
        corners.forEach((k, i) => {
          const x = x0 + k.sx * cellSize;
          const z = z0 + k.sz * cellSize;
          const exposed =
            !isWall(r + k.a[0], c + k.a[1]) && !isWall(r + k.b[0], c + k.b[1]) && !isWall(r + k.diag[0], c + k.diag[1]);
          if (!exposed) {
            verts.push({ x, z });
            return;
          }
          // Two points replace the corner; keep the outline going clockwise (NW -> NE -> SE -> SW)
          const alongX = { x: x + k.inX * WALL_CHAMFER, z };
          const alongZ = { x, z: z + k.inZ * WALL_CHAMFER };
          if (i % 2 === 0) verts.push(alongZ, alongX);
          else verts.push(alongX, alongZ);
        });
        prisms.push(makePrism(verts, minY, maxY));
      } else {
        // Open cell: fill each inside corner where two walls meet at a right angle
        corners.forEach((k) => {
          if (!isWall(r + k.a[0], c + k.a[1]) || !isWall(r + k.b[0], c + k.b[1])) return;
          const x = x0 + k.sx * cellSize;
          const z = z0 + k.sz * cellSize;
          prisms.push(
            makePrism(
              [
                { x, z },
                { x: x + k.inX * CORNER_FILL, z },
                { x, z: z + k.inZ * CORNER_FILL },
              ],
              minY,
              maxY
            )
          );
        });
      }
    }
  }
  return prisms;
}

// Pushes a convex outline outwards by `dist` (used for the neon trim strips)
function offsetOutline(prism, dist) {
  const n = prism.edges.length;
  return prism.verts.map((v, i) => {
    const e1 = prism.edges[(i - 1 + n) % n];
    const e2 = prism.edges[i];
    const k = dist / (1 + e1.nx * e2.nx + e1.nz * e2.nz);
    return { x: v.x + (e1.nx + e2.nx) * k, z: v.z + (e1.nz + e2.nz) * k };
  });
}

// Side walls + top cap for a vertical prism, UVs in world units so textures don't stretch
function buildPrismGeometry(verts, y0, y1, uSize, vSize) {
  const pos = [];
  const uv = [];
  let run = 0;
  for (let i = 0; i < verts.length; i++) {
    const a = verts[i];
    const b = verts[(i + 1) % verts.length];
    const len = Math.hypot(b.x - a.x, b.z - a.z);
    const u0 = run / uSize;
    const u1 = (run + len) / uSize;
    run += len;
    const v0 = y0 / vSize;
    const v1 = y1 / vSize;
    pos.push(a.x, y0, a.z, b.x, y1, b.z, b.x, y0, b.z, a.x, y0, a.z, a.x, y1, a.z, b.x, y1, b.z);
    uv.push(u0, v0, u1, v1, u1, v0, u0, v0, u0, v1, u1, v1);
  }
  for (let i = 1; i < verts.length - 1; i++) {
    const p = [verts[0], verts[i + 1], verts[i]];
    p.forEach((v) => {
      pos.push(v.x, y1, v.z);
      uv.push(v.x / uSize, v.z / uSize);
    });
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}

// Generate procedural high-tech grid textures for walls and boost pads
function createGridTexture(bg, lineColor, accentColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 256, 256);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;
  for (let i = 32; i < 256; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }

  // Subtle Titanfall-style chevrons on walls
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(112, 140);
  ctx.lineTo(128, 116);
  ctx.lineTo(144, 140);
  ctx.lineTo(136, 140);
  ctx.lineTo(128, 128);
  ctx.lineTo(120, 140);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
// ==========================================
// SESSION SPEEDRUN LEADERBOARD
// ==========================================
// Each pilot's best run per category, top 10 (same rules as server.js)
function bestPerPilot(runs, better) {
  const best = new Map();
  for (const run of runs) {
    const cur = best.get(run.name);
    if (!cur || better(run, cur) < 0) best.set(run.name, run);
  }
  return [...best.values()].sort(better).slice(0, 10);
}

function rankRuns(runs) {
  return {
    fastest: bestPerPilot(runs, (a, b) => a.time - b.time),
    score: bestPerPilot(runs, (a, b) => b.score - a.score || a.time - b.time),
  };
}

function formatRunTime(seconds) {
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  const m = Math.floor(seconds / 60);
  const s = (seconds - m * 60).toFixed(2).padStart(5, '0');
  return `${m}:${s}`;
}

function LeaderboardPanel({ board, me }) {
  const columns = [
    { key: 'score', title: 'Score + Time', note: 'Highest score, faster time breaks ties' },
    { key: 'fastest', title: 'Fastest Time', note: 'Least time to the exit beacon' },
  ];
  return (
    <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl text-left">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-yellow-300 flex items-center gap-2">
          <Award className="w-4 h-4" /> Session Leaderboard
        </h3>
        <span className="text-[10px] uppercase text-slate-500 font-bold">
          {board.shared ? `Room ${board.room || ''}` : 'This browser only'}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {columns.map((col) => (
          <div key={col.key}>
            <div className="text-xs font-bold uppercase text-cyan-300">{col.title}</div>
            <div className="text-[10px] text-slate-500 mb-1.5">{col.note}</div>
            {board[col.key].length === 0 ? (
              <div className="text-xs text-slate-500 italic py-2">No finished runs yet</div>
            ) : (
              <ol className="space-y-0.5 text-xs font-mono">
                {board[col.key].map((run, i) => (
                  <li
                    key={run.name}
                    className={`flex items-center gap-2 px-2 py-1 rounded ${
                      run.name === me ? 'bg-cyan-500/15 text-cyan-200' : 'text-slate-300'
                    }`}
                  >
                    <span className={`w-5 ${i === 0 ? 'text-yellow-300 font-black' : 'text-slate-500'}`}>{i + 1}.</span>
                    <span className="flex-1 truncate">{run.name}</span>
                    {col.key === 'score' && <span className="text-yellow-300">{run.score}</span>}
                    <span className="text-white w-16 text-right">{formatRunTime(run.time)}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const mountRef = useRef(null);

  // UI & HUD State
  const [gameState, setGameState] = useState('MENU'); // MENU, PLAYING, PAUSED, WON, LOST
  const [hud, setHud] = useState({
    speed: 0,
    maxSpeed: 0,
    altitude: 3.0,
    lavaLevel: -3.5,
    wallrunning: false,
    wallSide: null, // 'LEFT' | 'RIGHT'
    sliding: false,
    doubleJumpReady: true,
    slideBoostCooldown: 0,
    distanceToExit: 120,
    elapsedTime: 0,
    platformAlert: false,
    activePlatforms: 0,
    kills: 0,
    streak: 0,
    streakTimeLeft: 0,
    totalEnemies: 0,
    enemiesAlive: 0,
    score: 0,
  });
  const [killPopups, setKillPopups] = useState([]);
  const [deathCause, setDeathCause] = useState(null); // name of the pilot who fragged you, or null for lava
  const [muted, setMuted] = useState(false);
  const [zipGenerating, setZipGenerating] = useState(false);
  const [zipStatus, setZipStatus] = useState('');
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [showMultiplayerModal, setShowMultiplayerModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState({ fastest: [], score: [], shared: false });
  const [showBoardHotkey, setShowBoardHotkey] = useState(false); // hold Tab while playing

  // Multiplayer State (Supports Both Live Preview Room Sync & Local WiFi WebSocket LAN)
  const [user, setUser] = useState(null);
  const [pilotName, setPilotName] = useState(() => `PILOT-${Math.floor(100 + Math.random() * 899)}`);
  const [roomCode, setRoomCode] = useState('WIFI-1');
  const [mpMode, setMpMode] = useState('OFFLINE'); // 'OFFLINE' | 'CLOUD_ROOM' | 'WIFI_WS'
  const [lanUrl, setLanUrl] = useState('ws://192.168.1.100:8080/ws');
  const [mpStatus, setMpStatus] = useState('Singleplayer Mode');
  const [remotePilotsList, setRemotePilotsList] = useState([]);
  const [copiedRoom, setCopiedRoom] = useState(false);

  // Refs for physics & game engine access inside requestAnimationFrame
  const gameRef = useRef({
    state: 'MENU',
    player: {
      pos: new THREE.Vector3(0, 5, 0),
      vel: new THREE.Vector3(0, 0, 0),
      yaw: -Math.PI * 0.25,
      pitch: 0,
      roll: 0,
      height: 2.3,
      radius: 0.75,
      grounded: false,
      onSlidePad: false,
      wallrunning: false,
      wallNormal: new THREE.Vector3(),
      wallSide: null,
      wallRunTimer: 0,
      lastWallNormal: new THREE.Vector3(),
      wallCooldown: 0,
      canDoubleJump: true,
      sliding: false,
      slideTimer: 0,
      slideBoostCooldown: 0,
      maxSpeedReached: 0,
    },
    keys: {
      KeyW: false,
      KeyS: false,
      KeyA: false,
      KeyD: false,
      Space: false,
      ShiftLeft: false,
      ControlLeft: false,
      KeyC: false,
    },
    lavaY: -4.2,
    lavaBaseSpeed: 0.31, // tuned for the 13x13 maze (shortest route 20 cells)
    elapsedTime: 0,
    exitPos: new THREE.Vector3(),
    spawnPos: new THREE.Vector3(),
    staticColliders: [],
    wallPrisms: [],
    risingPlatforms: [],
    nextPlatformSpawnTimer: 1.5,
    enemies: [],
    rockets: [],
    explosions: [],
    shatterDebris: [],
    bazookaRecoil: 0,
    fireCooldown: 0,
    kills: 0,
    streak: 0,
    streakTimer: 0,
    score: 0,
    remotePlayers: {}, // { [peerId]: { data, mesh } }
    pilotKills: 0,
    localRuns: [], // finished runs in this browser session (used when offline)
    pilotName: '',
    spawnProtect: 0, // seconds of immunity to other pilots after deploying
    netSend: null, // set by the multiplayer effect while connected
    netHandlers: {}, // ROCKET / HIT / KILLED handlers, set by the game engine
    ws: null,
    localPeerId: `peer_${Math.random().toString(36).substring(2, 9)}`,
  });

  useEffect(() => {
    gameRef.current.pilotName = pilotName;
  }, [pilotName]);

  // Hold Tab to peek at the leaderboard mid-run
  useEffect(() => {
    const down = (e) => {
      if (e.code !== 'Tab' || e.target instanceof HTMLInputElement) return; // keep Tab working in text fields
      e.preventDefault();
      setShowBoardHotkey(true);
    };
    const up = (e) => {
      if (e.code === 'Tab') setShowBoardHotkey(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Multiplayer over WebSocket.
  // CLOUD_ROOM = the server that is hosting this page (auto address); WIFI_WS = a typed-in address.
  useEffect(() => {
    const g = gameRef.current;
    const removePeer = (id) => {
      const rp = g.remotePlayers[id];
      if (rp && rp.mesh && rp.mesh.parent) rp.mesh.parent.remove(rp.mesh);
      delete g.remotePlayers[id];
    };
    const refreshList = () =>
      setRemotePilotsList(Object.entries(g.remotePlayers).map(([id, rp]) => ({ id, ...rp.data })));
    const clearPeers = () => {
      Object.keys(g.remotePlayers).forEach(removePeer);
      setRemotePilotsList([]);
    };

    if (mpMode === 'OFFLINE') {
      if (g.ws) {
        g.ws.close();
        g.ws = null;
      }
      clearPeers();
      setLeaderboard({ ...rankRuns(g.localRuns), shared: false });
      return;
    }

    const room = roomCode.trim().toUpperCase() || 'WIFI-1';
    const url =
      mpMode === 'CLOUD_ROOM'
        ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
        : lanUrl.trim();

    let socket = null;
    let closedByUs = false;
    let retryTimer = null;

    const connect = () => {
      try {
        setMpStatus(`Connecting to ${url}...`);
        socket = new WebSocket(url);
      } catch (err) {
        setMpStatus('Invalid server address');
        return;
      }
      g.ws = socket;

      socket.onopen = () => setMpStatus(`Connected - room ${room}`);

      socket.onmessage = (event) => {
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch (err) {
          return;
        }
        if (msg.type === 'LEAVE' && msg.id) {
          removePeer(msg.id);
          refreshList();
          return;
        }
        if (msg.id === g.localPeerId) return;
        if ((msg.room || '').toUpperCase() !== room) return;
        if (msg.type !== 'STATE_UPDATE') {
          const handler = g.netHandlers[msg.type];
          if (handler) handler(msg);
          return;
        }
        if (!g.remotePlayers[msg.id]) {
          g.remotePlayers[msg.id] = { data: msg, mesh: null, lastSeen: Date.now() };
        } else {
          g.remotePlayers[msg.id].data = msg;
          g.remotePlayers[msg.id].lastSeen = Date.now();
        }
        refreshList();
      };

      socket.onerror = () => {
        setMpStatus(
          mpMode === 'CLOUD_ROOM'
            ? 'No game server here - open the link printed by the host\'s server window'
            : 'Server unreachable - check the address and the host\'s firewall'
        );
      };

      socket.onclose = () => {
        if (closedByUs) return;
        setMpStatus('Disconnected - retrying in 3s...');
        retryTimer = setTimeout(connect, 3000);
      };
    };
    connect();

    g.netSend = (obj) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ ...obj, id: g.localPeerId, room, name: pilotName }));
      }
    };

    const wsInterval = setInterval(() => {
      // Drop pilots we have not heard from in 5s (uses our own clock, so PC clock differences don't matter)
      const now = Date.now();
      let changed = false;
      Object.keys(g.remotePlayers).forEach((id) => {
        if (now - (g.remotePlayers[id].lastSeen || 0) > 5000) {
          removePeer(id);
          changed = true;
        }
      });
      if (changed) refreshList();

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'STATE_UPDATE',
            id: g.localPeerId,
            room,
            name: pilotName,
            x: Number(g.player.pos.x.toFixed(2)),
            y: Number(g.player.pos.y.toFixed(2)),
            z: Number(g.player.pos.z.toFixed(2)),
            yaw: Number(g.player.yaw.toFixed(2)),
            roll: Number(g.player.roll.toFixed(2)),
            wallrunning: g.player.wallrunning,
            sliding: g.player.sliding,
            score: g.score,
            kills: g.kills,
            streak: g.streak,
            pilotKills: g.pilotKills,
            alive: g.state === 'PLAYING',
            updatedAt: Date.now(),
          })
        );
      }
    }, 50); // 20 updates per second

    return () => {
      closedByUs = true;
      g.netSend = null;
      clearTimeout(retryTimer);
      clearInterval(wsInterval);
      if (socket) socket.close();
      if (g.ws === socket) g.ws = null;
      clearPeers();
    };
  }, [mpMode, lanUrl, roomCode, pilotName]);

  // Safe Pointer Lock Helper to prevent browser SecurityError unhandled rejections
  // when acquiring pointer lock right after the user exits lock with ESC
  const safeRequestPointerLock = useCallback((element) => {
    if (!element || typeof element.requestPointerLock !== 'function') return;
    try {
      const result = element.requestPointerLock();
      if (result && typeof result.catch === 'function') {
        result.catch(() => {
          // Silently ignore browser cooldown SecurityError if user just exited pointer lock
        });
      }
    } catch (err) {
      // Ignore synchronous pointer lock errors
    }
  }, []);

  const safeExitPointerLock = useCallback(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      try {
        document.exitPointerLock?.();
      } catch (err) {
        // Ignore exit errors
      }
    }
  }, []);

  // Trigger prominent "NERD KILLED" arcade popup with streak badge
  const triggerKillPopup = useCallback((streakCount, multiKillIndex = 0, opts = {}) => {
    const id = Date.now() + Math.random();
    const bonusPoints = opts.points ?? 150 * streakCount;
    setKillPopups((prev) => [
      ...prev.slice(-4),
      {
        id,
        streak: streakCount,
        points: bonusPoints,
        label: opts.label || 'NERD KILLED!',
        subtitle: opts.subtitle || `STREAK x${streakCount}`,
        offsetX: (Math.random() - 0.5) * 90,
        offsetY: multiKillIndex * -44,
      },
    ]);
    setTimeout(() => {
      setKillPopups((prev) => prev.filter((p) => p.id !== id));
    }, 1850);
  }, []);


  // Reset and start a run
  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.player.pos.copy(g.spawnPos);
    g.player.vel.set(0, 0, 0);
    g.player.yaw = -Math.PI * 0.25;
    g.player.pitch = 0;
    g.player.roll = 0;
    g.player.grounded = false;
    g.player.wallrunning = false;
    g.player.sliding = false;
    g.player.canDoubleJump = true;
    g.player.wallCooldown = 0;
    g.player.slideBoostCooldown = 0;
    g.player.maxSpeedReached = 0;
    g.lavaY = -4.2;
    g.elapsedTime = 0;
    g.nextPlatformSpawnTimer = 1.0;
    g.kills = 0;
    g.streak = 0;
    g.streakTimer = 0;
    g.score = 0;
    g.pilotKills = 0;
    g.spawnProtect = 2.0;
    g.fireCooldown = 0;
    g.bazookaRecoil = 0;
    setKillPopups([]);
    setDeathCause(null);

    // Reset dynamic rising platforms
    g.risingPlatforms.forEach((p) => {
      p.mesh.position.y = -20;
      p.state = 'IDLE';
      p.timer = 0;
    });

    // Respawn all wall-clinging cyborg enemies
    g.enemies.forEach((enemy) => {
      enemy.alive = true;
      enemy.mesh.visible = true;
      enemy.mesh.position.copy(enemy.basePos);
    });

    // Clear active rockets, explosions, and debris
    g.rockets.forEach((r) => r.mesh.parent && r.mesh.parent.remove(r.mesh));
    g.rockets = [];
    g.explosions.forEach((ex) => ex.mesh.parent && ex.mesh.parent.remove(ex.mesh));
    g.explosions = [];
    g.shatterDebris.forEach((d) => d.mesh.parent && d.mesh.parent.remove(d.mesh));
    g.shatterDebris = [];

    g.state = 'PLAYING';
    setGameState('PLAYING');

    if (mountRef.current) {
      const canvas = mountRef.current.querySelector('canvas') || mountRef.current;
      safeRequestPointerLock(canvas);
    }
  }, [safeRequestPointerLock]);

  const toggleMute = () => {
    sfx.muted = !muted;
    setMuted(!muted);
  };

  // ==========================================
  // THREE.JS SCENE & PHYSICS ENGINE
  // ==========================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090b10);
    scene.fog = new THREE.FogExp2(0x160b08, 0.0085);

    const camera = new THREE.PerspectiveCamera(
      85,
      container.clientWidth / container.clientHeight,
      0.1,
      400
    );
    camera.rotation.order = 'YXZ';

    // Attach 3D Bazooka ViewModel directly to Camera
    const bazookaModel = createBazookaViewModel();
    camera.add(bazookaModel);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x3a445e, 1.35);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xe2e8f0, 1.0);
    dirLight.position.set(60, 120, 50);
    scene.add(dirLight);

    // Warm under-glow from the lava
    const lavaLight = new THREE.PointLight(0xff4500, 3.2, 160);
    lavaLight.position.set(0, 4, 0);
    scene.add(lavaLight);

    // 3. Build Labyrinth Geometry & Wall-Clinging Cyborgs
    const g = gameRef.current;
    g.staticColliders = [];
    g.wallPrisms = [];
    g.risingPlatforms = [];
    g.enemies = [];
    g.rockets = [];
    g.explosions = [];
    g.shatterDebris = [];

    const wallTex = createGridTexture('#131824', '#26324d', '#38bdf8');
    wallTex.repeat.set(1, 1); // wall UVs are in world units (one tile = 9 x 8.4)
    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTex,
      roughness: 0.45,
      metalness: 0.3,
    });

    const trimMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9 });
    const startPlatMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.6,
    });
    const exitPlatMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    const rows = MAZE_GRID.length;
    const cols = MAZE_GRID[0].length;
    const offsetX = -(cols * CELL_SIZE) / 2;
    const offsetZ = -(rows * CELL_SIZE) / 2;

    const openCorridorCells = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = MAZE_GRID[r][c];
        const cx = offsetX + c * CELL_SIZE + CELL_SIZE / 2;
        const cz = offsetZ + r * CELL_SIZE + CELL_SIZE / 2;

        if (cell === 2) {
          // Spawn Starting Pad
          const platH = 9;
          const platMesh = new THREE.Mesh(new THREE.BoxGeometry(8, platH, 8), startPlatMat);
          platMesh.position.set(cx, platH / 2 - 6, cz);
          scene.add(platMesh);

          g.staticColliders.push({
            minX: cx - 4,
            maxX: cx + 4,
            minY: -6,
            maxY: platH - 6,
            minZ: cz - 4,
            maxZ: cz + 4,
            isSlidePad: false,
            isExit: false,
          });

          g.spawnPos.set(cx, platH - 6 + 2.6, cz);
          g.player.pos.copy(g.spawnPos);
        } else if (cell === 3) {
          // High Extraction Portal Platform
          const exitElevation = 18.5;
          const platMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 2.5, 10), exitPlatMat);
          platMesh.position.set(cx, exitElevation, cz);
          scene.add(platMesh);

          // Extraction Beacon Beam
          const beamGeo = new THREE.CylinderGeometry(2.2, 2.2, 60, 20, 1, true);
          const beamMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.28,
            side: THREE.DoubleSide,
          });
          const beam = new THREE.Mesh(beamGeo, beamMat);
          beam.position.set(cx, exitElevation + 25, cz);
          scene.add(beam);

          g.staticColliders.push({
            minX: cx - 5,
            maxX: cx + 5,
            minY: exitElevation - 1.25,
            maxY: exitElevation + 1.25,
            minZ: cz - 5,
            maxZ: cz + 5,
            isSlidePad: false,
            isExit: true,
          });

          g.exitPos.set(cx, exitElevation + 2, cz);

          // Add intermediate wall-run stepping pillar near exit
          const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(5, 14, 5), startPlatMat);
          stepMesh.position.set(cx - 12, 5, cz);
          scene.add(stepMesh);
          g.staticColliders.push({
            minX: cx - 14.5,
            maxX: cx - 9.5,
            minY: -2,
            maxY: 12,
            minZ: cz - 2.5,
            maxZ: cz + 2.5,
            isSlidePad: true,
            isExit: false,
          });
        } else if (cell === 0) {
          openCorridorCells.push({ cx, cz, r, c });
        }
      }
    }

    // Angled maze walls: chamfered blocks + inside-corner fills, with neon trim strips
    g.wallPrisms = buildMazeWallPrisms(MAZE_GRID, CELL_SIZE, offsetX, offsetZ, -6, WALL_HEIGHT - 6);
    g.wallPrisms.forEach((prism) => {
      scene.add(new THREE.Mesh(buildPrismGeometry(prism.verts, -6, WALL_HEIGHT - 6, 9, 8.4), wallMat));
      const trimOutline = offsetOutline(prism, 0.06);
      [6.5, 16.5].forEach((y) => {
        scene.add(new THREE.Mesh(buildPrismGeometry(trimOutline, y - 0.175, y + 0.175, 1, 1), trimMat));
      });
    });

    // 4. Spawn Wall-Clinging Cyborg Enemies (White Hoodies, Black Pants, White Sneakers)
    openCorridorCells.forEach((cell, idx) => {
      const dirs = [
        { dr: -1, dc: 0, nx: 0, nz: 1, rotY: 0 },
        { dr: 1, dc: 0, nx: 0, nz: -1, rotY: Math.PI },
        { dr: 0, dc: -1, nx: 1, nz: 0, rotY: Math.PI / 2 },
        { dr: 0, dc: 1, nx: -1, nz: 0, rotY: -Math.PI / 2 },
      ];
      const validWalls = dirs.filter(
        (d) => MAZE_GRID[cell.r + d.dr] && MAZE_GRID[cell.r + d.dr][cell.c + d.dc] === 1
      );

      if (validWalls.length > 0 && idx % 3 === 0) {
        const chosen = validWalls[idx % validWalls.length];
        const enemyMesh = createWallCyborgMesh();
        const wallSurfaceOffset = CELL_SIZE / 2 - 0.55;
        const ex = cell.cx - chosen.nx * wallSurfaceOffset;
        const ez = cell.cz - chosen.nz * wallSurfaceOffset;
        const ey = 7.5 + (idx % 3) * 3.8;

        enemyMesh.position.set(ex, ey, ez);
        enemyMesh.rotation.y = chosen.rotY;
        scene.add(enemyMesh);

        g.enemies.push({
          id: idx,
          mesh: enemyMesh,
          basePos: new THREE.Vector3(ex, ey, ez),
          normal: new THREE.Vector3(chosen.nx, 0, chosen.nz),
          alive: true,
          phase: idx * 0.9,
        });
      }
    });

    // 5. Create Rising Lava Floor
    const lavaCanvas = document.createElement('canvas');
    lavaCanvas.width = 256;
    lavaCanvas.height = 256;
    const lCtx = lavaCanvas.getContext('2d');
    lCtx.fillStyle = '#cf2900';
    lCtx.fillRect(0, 0, 256, 256);
    lCtx.fillStyle = '#ff8800';
    for (let i = 0; i < 40; i++) {
      lCtx.beginPath();
      lCtx.arc(Math.random() * 256, Math.random() * 256, 8 + Math.random() * 26, 0, Math.PI * 2);
      lCtx.fill();
    }
    lCtx.fillStyle = '#ffdd00';
    for (let i = 0; i < 20; i++) {
      lCtx.beginPath();
      lCtx.arc(Math.random() * 256, Math.random() * 256, 4 + Math.random() * 10, 0, Math.PI * 2);
      lCtx.fill();
    }
    const lavaTex = new THREE.CanvasTexture(lavaCanvas);
    lavaTex.wrapS = THREE.RepeatWrapping;
    lavaTex.wrapT = THREE.RepeatWrapping;
    lavaTex.repeat.set(16, 16);

    const lavaGeo = new THREE.PlaneGeometry(cols * CELL_SIZE * 1.4, rows * CELL_SIZE * 1.4, 32, 32);
    lavaGeo.rotateX(-Math.PI / 2);
    const lavaMat = new THREE.MeshBasicMaterial({ map: lavaTex });
    const lavaMesh = new THREE.Mesh(lavaGeo, lavaMat);
    lavaMesh.position.y = g.lavaY;
    scene.add(lavaMesh);

    // 6. Create Pool of Rising Lava Slide-Boost Features
    const boostTex = createGridTexture('#06283d', '#00f0ff', '#38bdf8');
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.7,
      metalness: 0.2,
    });
    const boostTopMat = new THREE.MeshStandardMaterial({
      map: boostTex,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      roughness: 0.2,
    });

    openCorridorCells.forEach((cell) => {
      const group = new THREE.Group();
      const pillarH = 18;
      const width = 6.8;

      const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(width, pillarH, width), pillarMat);
      baseMesh.position.y = -pillarH / 2;
      group.add(baseMesh);

      const padMesh = new THREE.Mesh(new THREE.BoxGeometry(width + 0.4, 0.7, width + 0.4), boostTopMat);
      padMesh.position.y = 0.2;
      group.add(padMesh);

      group.position.set(cell.cx, -25, cell.cz);
      scene.add(group);

      g.risingPlatforms.push({
        mesh: group,
        cx: cell.cx,
        cz: cell.cz,
        width: width + 0.4,
        height: pillarH,
        state: 'IDLE', // IDLE, RISING, ACTIVE, SINKING
        timer: 0,
        targetY: 0,
      });
    });

    // 7. Helper to Fire Explosive Bazooka Rockets
    const fireBazookaRocket = () => {
      if (g.state !== 'PLAYING' || g.fireCooldown > 0) return;
      g.fireCooldown = 0.36;
      g.bazookaRecoil = 1.0;
      sfx.playBazookaFire();

      const forward = new THREE.Vector3(0, 0, -1).applyEuler(
        new THREE.Euler(g.player.pitch, g.player.yaw, 0, 'YXZ')
      );
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        g.player.yaw
      );

      const spawnPos = g.player.pos
        .clone()
        .addScaledVector(forward, 1.35)
        .addScaledVector(right, 0.32);
      spawnPos.y -= 0.18;

      const vel = forward.clone().multiplyScalar(68);
      spawnRocket(spawnPos, vel, null);
      if (g.netSend) {
        g.netSend({
          type: 'ROCKET',
          px: +spawnPos.x.toFixed(2), py: +spawnPos.y.toFixed(2), pz: +spawnPos.z.toFixed(2),
          vx: +vel.x.toFixed(2), vy: +vel.y.toFixed(2), vz: +vel.z.toFixed(2),
        });
      }
    };

    // Creates a rocket. owner = null for our own rockets, or the peer id of the pilot who fired it.
    const spawnRocket = (spawnPos, vel, owner) => {
      const rocketGroup = new THREE.Group();
      const warhead = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffaa00 })
      );
      rocketGroup.add(warhead);

      const tail = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 0.75, 8),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      tail.rotation.x = Math.PI / 2;
      tail.position.z = 0.35;
      rocketGroup.add(tail);

      rocketGroup.position.copy(spawnPos);
      rocketGroup.lookAt(spawnPos.clone().add(vel));
      scene.add(rocketGroup);

      g.rockets.push({
        mesh: rocketGroup,
        pos: spawnPos,
        vel,
        life: 3.5,
        owner,
      });
    };

    // Body centre of a remote pilot (their synced position is eye height)
    const remotePilotCentre = (rp) => rp.mesh.position.clone().add(new THREE.Vector3(0, -1.0, 0));
    const isRemotePilotAlive = (rp) => rp && rp.mesh && rp.data && rp.data.alive !== false;

    const spawnShatter = (pos, accentColor) => {
      for (let i = 0; i < 12; i++) {
        const isAccent = i % 3 === 0;
        const shard = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 0.32, 0.32),
          new THREE.MeshBasicMaterial({ color: isAccent ? accentColor : 0xf8fafc })
        );
        shard.position.copy(pos);
        scene.add(shard);
        g.shatterDebris.push({
          mesh: shard,
          vel: new THREE.Vector3(
            (Math.random() - 0.5) * 24,
            Math.random() * 16 + 4,
            (Math.random() - 0.5) * 24
          ),
          life: 1.1,
        });
      }
    };

    // Multiplayer events from other pilots
    g.netHandlers = {
      // The server's leaderboard for our room
      LEADERBOARD: (msg) => {
        setLeaderboard({
          fastest: Array.isArray(msg.fastest) ? msg.fastest : [],
          score: Array.isArray(msg.score) ? msg.score : [],
          shared: true,
          room: msg.room,
        });
      },
      // Another pilot fired: show their rocket (it can push us, but only its owner decides kills)
      ROCKET: (msg) => {
        if (g.state !== 'PLAYING') return;
        spawnRocket(
          new THREE.Vector3(msg.px, msg.py, msg.pz),
          new THREE.Vector3(msg.vx, msg.vy, msg.vz),
          msg.id
        );
      },
      // Another pilot's rocket caught us
      HIT: (msg) => {
        if (msg.target !== g.localPeerId || g.state !== 'PLAYING' || g.spawnProtect > 0) return;
        g.state = 'LOST';
        setGameState('LOST');
        setDeathCause(msg.name || 'ANOTHER PILOT');
        sfx.playExplosion(true, 1);
        safeExitPointerLock();
        if (g.netSend) g.netSend({ type: 'KILLED', by: msg.id });
      },
      // A pilot died to someone's rocket (maybe ours)
      KILLED: (msg) => {
        const rp = g.remotePlayers[msg.id];
        if (rp && rp.mesh) {
          spawnShatter(remotePilotCentre(rp), 0x00f0ff);
          if (rp.data) rp.data.alive = false;
          rp.mesh.visible = false;
        }
        if (msg.by === g.localPeerId) {
          g.pilotKills += 1;
          g.streak += 1;
          g.streakTimer = 6.5;
          g.score += 500;
          triggerKillPopup(g.streak, 0, { label: 'PILOT KILLED!', subtitle: msg.name || 'PILOT', points: 500 });
          sfx.playExplosion(true, g.streak);
        }
      },
    };

    // 8. Input Listeners (Keyboard + Mouse Look + Left-Click Rocket Fire)
    const onKeyDown = (e) => {
      if (g.keys.hasOwnProperty(e.code)) {
        g.keys[e.code] = true;
      }

      if (e.code === 'Space' && g.state === 'PLAYING') {
        e.preventDefault();
        handleJumpInput();
      }

      if (
        (e.code === 'ShiftLeft' || e.code === 'ControlLeft' || e.code === 'KeyC') &&
        g.state === 'PLAYING'
      ) {
        triggerSlideInput();
      }
    };

    const onKeyUp = (e) => {
      if (g.keys.hasOwnProperty(e.code)) {
        g.keys[e.code] = false;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ControlLeft' || e.code === 'KeyC') {
        g.player.sliding = false;
      }
    };

    const onMouseMove = (e) => {
      if (document.pointerLockElement !== renderer.domElement || g.state !== 'PLAYING') return;
      const sensitivity = 0.0022;
      g.player.yaw -= e.movementX * sensitivity;
      g.player.pitch = Math.max(
        -Math.PI / 2.15,
        Math.min(Math.PI / 2.15, g.player.pitch - e.movementY * sensitivity)
      );
    };

    const onMouseDown = (e) => {
      if (g.state !== 'PLAYING') return;
      // Ignore clicks on UI buttons or overlays outside the WebGL canvas
      if (e.target !== renderer.domElement) return;

      if (document.pointerLockElement !== renderer.domElement) {
        safeRequestPointerLock(renderer.domElement);
        return;
      }
      if (e.button === 0) {
        fireBazookaRocket();
      }
    };

    const onPointerLockChange = () => {
      if (document.pointerLockElement !== renderer.domElement && g.state === 'PLAYING') {
        g.state = 'PAUSED';
        setGameState('PAUSED');
      }
    };

    const onPointerLockError = () => {
      // Browser enforces a ~1.2s security cooldown after pressing ESC before lock can be re-acquired.
      // Keep the game in PLAYING state; the next click on the canvas will lock the pointer cleanly.
    };

    // Jump & Wall-Kick Mechanics (Titanfall 2 Inspired)
    const handleJumpInput = () => {
      const p = g.player;
      const lookDir = new THREE.Vector3(-Math.sin(p.yaw), 0, -Math.cos(p.yaw)).normalize();

      if (p.wallrunning) {
        // Wall Kick: Launch away from wall + forward camera boost
        p.wallrunning = false;
        p.wallCooldown = 0.28;
        p.lastWallNormal.copy(p.wallNormal);

        p.vel.y = 14.2;
        p.vel.addScaledVector(p.wallNormal, 13.5);
        p.vel.addScaledVector(lookDir, 9.5);
        p.canDoubleJump = true;
        sfx.playJump(true);
      } else if (p.grounded) {
        // Ground Jump (Preserve slide-hop momentum!)
        p.grounded = false;
        p.vel.y = 13.5;
        if (p.sliding || p.onSlidePad) {
          p.vel.addScaledVector(lookDir, 6.5);
        }
        sfx.playJump(false);
      } else if (p.canDoubleJump) {
        // Jump-Kit Midair Double Jump
        p.canDoubleJump = false;
        p.vel.y = 13.0;
        p.vel.addScaledVector(lookDir, 5.5);
        sfx.playJump(true);
      }
    };

    // Slide & Erupting Platform Slide-Boost Mechanics
    const triggerSlideInput = () => {
      const p = g.player;
      p.sliding = true;
      p.slideTimer = 0.65;

      const lookDir = new THREE.Vector3(-Math.sin(p.yaw), 0, -Math.cos(p.yaw)).normalize();
      if (p.grounded && p.slideBoostCooldown <= 0) {
        const boostPower = p.onSlidePad ? 22.5 : 9.5;
        p.vel.addScaledVector(lookDir, boostPower);
        if (p.onSlidePad) {
          p.vel.y = Math.max(p.vel.y, 4.5);
        }
        p.slideBoostCooldown = 0.9;
        sfx.playSlideBoost();
      }
    };

    // Explode Rocket & Check Cyborg Enemy Hits + Rocket Jump Knockback
    const triggerRocketExplosion = (impactPos, owner = null) => {
      const expMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0xff6600,
          transparent: true,
          opacity: 0.88,
        })
      );
      expMesh.position.copy(impactPos);
      scene.add(expMesh);
      g.explosions.push({ mesh: expMesh, radius: 0.6, maxRadius: 7.5, life: 1.0 });

      // Check cyborg enemies within blast radius
      const blastRadius = 7.2;
      let hitCountThisShot = 0;

      // Rockets from other pilots are visual only here; their own game decides what they hit
      if (!owner) {
        Object.entries(g.remotePlayers).forEach(([peerId, rp]) => {
          if (!isRemotePilotAlive(rp)) return;
          if (remotePilotCentre(rp).distanceTo(impactPos) <= 6.0 && g.netSend) {
            g.netSend({ type: 'HIT', target: peerId });
          }
        });
      }

      g.enemies.forEach((enemy) => {
        if (owner || !enemy.alive) return;
        const dist = enemy.mesh.position.distanceTo(impactPos);
        if (dist <= blastRadius) {
          enemy.alive = false;
          enemy.mesh.visible = false;

          // Spawn shatter debris (white hoodie + cyan cyber shards)
          spawnShatter(enemy.mesh.position, 0x00f0ff);

          g.kills += 1;
          g.streak += 1;
          g.streakTimer = 6.5; // 6.5 seconds to keep kill streak alive
          g.score += 150 * g.streak;
          triggerKillPopup(g.streak, hitCountThisShot);
          hitCountThisShot += 1;
        }
      });

      // Bonus TF2/Quake style Rocket-Jump knockback if player is near explosion
      const playerDist = g.player.pos.distanceTo(impactPos);
      if (playerDist < 8.5) {
        const pushDir = g.player.pos.clone().sub(impactPos).normalize();
        const strength = (1 - playerDist / 8.5) * 18;
        g.player.vel.addScaledVector(pushDir, strength);
        g.player.vel.y += strength * 0.45;
      }

      sfx.playExplosion(hitCountThisShot > 0, g.streak);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockError);

    // 9. Main Game Loop
    let clock = new THREE.Clock();
    let hudUpdateCounter = 0;
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      if (g.state === 'PLAYING') {
        const p = g.player;
        g.elapsedTime += dt;

        // Cooldowns
        if (p.wallCooldown > 0) p.wallCooldown -= dt;
        if (p.slideBoostCooldown > 0) p.slideBoostCooldown -= dt;
        if (p.slideTimer > 0) {
          p.slideTimer -= dt;
          if (p.slideTimer <= 0 && !g.keys.ShiftLeft && !g.keys.KeyC) {
            p.sliding = false;
          }
        }
        if (g.fireCooldown > 0) g.fireCooldown -= dt;
        if (g.spawnProtect > 0) g.spawnProtect -= dt;
        if (g.bazookaRecoil > 0) g.bazookaRecoil = Math.max(0, g.bazookaRecoil - dt * 4.5);

        // Streak Decay Timer
        if (g.streak > 0) {
          g.streakTimer -= dt;
          if (g.streakTimer <= 0) {
            g.streak = 0;
            g.streakTimer = 0;
          }
        }

        // Animate Bazooka ViewModel Sway & Recoil
        const horizSpeed = Math.hypot(p.vel.x, p.vel.z);
        const bobX = Math.cos(g.elapsedTime * 8) * Math.min(0.025, horizSpeed * 0.0008);
        const bobY = Math.sin(g.elapsedTime * 16) * Math.min(0.025, horizSpeed * 0.0008);
        bazookaModel.position.set(
          0.42 + bobX,
          -0.34 + bobY + g.bazookaRecoil * 0.05,
          -0.68 + g.bazookaRecoil * 0.22
        );
        bazookaModel.rotation.x = g.bazookaRecoil * 0.18;

        // Animate Wall-Clinging Cyborg Enemies
        g.enemies.forEach((enemy) => {
          if (!enemy.alive) return;
          enemy.mesh.position.y =
            enemy.basePos.y + Math.sin(g.elapsedTime * 3.2 + enemy.phase) * 0.65;
        });

        // Update Active Rockets & Collision Detection
        for (let i = g.rockets.length - 1; i >= 0; i--) {
          const r = g.rockets[i];
          const prevPos = r.pos.clone();
          r.pos.addScaledVector(r.vel, dt);
          r.mesh.position.copy(r.pos);
          r.life -= dt;

          let hit = false;
          if (r.pos.y <= g.lavaY || r.life <= 0) {
            hit = true;
          }

          // Direct hits on pilots: our rockets vs other pilots, their rockets vs us (visual)
          if (!hit) {
            // Check the whole path flown this frame so fast rockets can't skip past a pilot
            const flown = new THREE.Line3(prevPos, r.pos);
            const pathDist = (pt) => flown.closestPointToPoint(pt, true, new THREE.Vector3()).distanceTo(pt);
            if (r.owner) {
              if (pathDist(p.pos.clone().add(new THREE.Vector3(0, -1.0, 0))) < 2.0) hit = true;
            } else {
              for (const rp of Object.values(g.remotePlayers)) {
                if (isRemotePilotAlive(rp) && pathDist(remotePilotCentre(rp)) < 2.0) {
                  hit = true;
                  break;
                }
              }
            }
          }

          // Check direct proximity to cyborg enemies
          if (!hit && !r.owner) {
            for (const enemy of g.enemies) {
              if (!enemy.alive) continue;
              if (r.pos.distanceTo(enemy.mesh.position) < 2.25) {
                hit = true;
                break;
              }
            }
          }

          // Check maze walls & platforms
          if (!hit) {
            for (const prism of g.wallPrisms) {
              if (r.pos.y < prism.minY || r.pos.y > prism.maxY) continue;
              const c = prismContact(prism, r.pos.x, r.pos.z, 0);
              if (c && c.dist <= 0) {
                hit = true;
                break;
              }
            }
          }
          if (!hit) {
            for (const box of g.staticColliders) {
              if (
                r.pos.x >= box.minX &&
                r.pos.x <= box.maxX &&
                r.pos.y >= box.minY &&
                r.pos.y <= box.maxY &&
                r.pos.z >= box.minZ &&
                r.pos.z <= box.maxZ
              ) {
                hit = true;
                break;
              }
            }
          }

          if (hit) {
            triggerRocketExplosion(r.pos.clone(), r.owner);
            scene.remove(r.mesh);
            g.rockets.splice(i, 1);
          }
        }

        // Update Expanding Explosion Shockwaves
        for (let i = g.explosions.length - 1; i >= 0; i--) {
          const ex = g.explosions[i];
          ex.life -= dt * 3.0;
          ex.radius = THREE.MathUtils.lerp(ex.maxRadius, 0.5, Math.max(0, ex.life));
          ex.mesh.scale.setScalar(ex.radius);
          ex.mesh.material.opacity = Math.max(0, ex.life * 0.85);
          if (ex.life <= 0) {
            scene.remove(ex.mesh);
            g.explosions.splice(i, 1);
          }
        }

        // Update Shatter Debris
        for (let i = g.shatterDebris.length - 1; i >= 0; i--) {
          const d = g.shatterDebris[i];
          d.vel.y -= 28 * dt;
          d.mesh.position.addScaledVector(d.vel, dt);
          d.mesh.rotation.x += 6 * dt;
          d.mesh.rotation.y += 6 * dt;
          d.life -= dt;
          if (d.life <= 0) {
            scene.remove(d.mesh);
            g.shatterDebris.splice(i, 1);
          }
        }

        // Interpolate & Render Co-op / WiFi Remote Pilots in 3D Space
        Object.keys(g.remotePlayers).forEach((peerId) => {
          const rp = g.remotePlayers[peerId];
          if (!rp || !rp.data) return;
          if (!rp.mesh) {
            rp.mesh = createRemotePilotMesh(0x00f0ff);
            scene.add(rp.mesh);
          }
          const target = new THREE.Vector3(rp.data.x || 0, rp.data.y || 5, rp.data.z || 0);
          // Snap on big jumps (respawn), smooth otherwise
          if (rp.mesh.position.distanceTo(target) > 20) rp.mesh.position.copy(target);
          else rp.mesh.position.lerp(target, 12 * dt);
          rp.mesh.visible = rp.data.alive !== false;
          rp.mesh.rotation.y = rp.data.yaw || 0;
          rp.mesh.rotation.z = rp.data.roll || 0;
        });

        // 1. Update Rising Lava Level
        g.lavaY += g.lavaBaseSpeed * dt;
        lavaMesh.position.y = g.lavaY;
        lavaTex.offset.x += 0.08 * dt;
        lavaTex.offset.y += 0.05 * dt;
        lavaLight.position.set(p.pos.x, g.lavaY + 5, p.pos.z);

        // 2. Periodically Erupt Slide-Boost Platforms from the Lava
        g.nextPlatformSpawnTimer -= dt;
        if (g.nextPlatformSpawnTimer <= 0) {
          g.nextPlatformSpawnTimer = 2.6;
          const idlePlatforms = g.risingPlatforms.filter((pl) => pl.state === 'IDLE');
          if (idlePlatforms.length > 0) {
            idlePlatforms.sort((a, b) => {
              const da = Math.hypot(a.cx - p.pos.x, a.cz - p.pos.z);
              const db = Math.hypot(b.cx - p.pos.x, b.cz - p.pos.z);
              return Math.abs(da - 24) - Math.abs(db - 24);
            });
            const chosen = idlePlatforms[0];
            chosen.state = 'RISING';
            chosen.timer = 0;
            chosen.mesh.position.y = g.lavaY - 6;
            chosen.targetY = g.lavaY + 3.2 + Math.random() * 2.5;
            sfx.playPlatformErupt();
          }
        }

        let activePlatCount = 0;
        const dynamicColliders = [];

        g.risingPlatforms.forEach((pl) => {
          if (pl.state === 'RISING') {
            pl.targetY = Math.max(pl.targetY, g.lavaY + 2.8);
            pl.mesh.position.y += 12.0 * dt;
            if (pl.mesh.position.y >= pl.targetY) {
              pl.mesh.position.y = pl.targetY;
              pl.state = 'ACTIVE';
              pl.timer = 9.0;
            }
          } else if (pl.state === 'ACTIVE') {
            pl.mesh.position.y = Math.max(pl.mesh.position.y, g.lavaY + 1.8);
            pl.timer -= dt;
            if (pl.timer <= 0) {
              pl.state = 'SINKING';
            }
          } else if (pl.state === 'SINKING') {
            pl.mesh.position.y -= 6.5 * dt;
            if (pl.mesh.position.y < g.lavaY - 10) {
              pl.state = 'IDLE';
            }
          }

          if (pl.state !== 'IDLE') {
            activePlatCount++;
            const halfW = pl.width / 2;
            dynamicColliders.push({
              minX: pl.cx - halfW,
              maxX: pl.cx + halfW,
              minY: pl.mesh.position.y - pl.height,
              maxY: pl.mesh.position.y + 0.55,
              minZ: pl.cz - halfW,
              maxZ: pl.cz + halfW,
              isSlidePad: true,
              isExit: false,
            });
          }
        });

        const allColliders = [...g.staticColliders, ...dynamicColliders];

        // 3. Player Directional Input Vectors
        const forward = new THREE.Vector3(-Math.sin(p.yaw), 0, -Math.cos(p.yaw)).normalize();
        const right = new THREE.Vector3(Math.cos(p.yaw), 0, -Math.sin(p.yaw)).normalize();

        const wishDir = new THREE.Vector3();
        if (g.keys.KeyW) wishDir.add(forward);
        if (g.keys.KeyS) wishDir.sub(forward);
        if (g.keys.KeyD) wishDir.add(right);
        if (g.keys.KeyA) wishDir.sub(right);
        if (wishDir.lengthSq() > 0) wishDir.normalize();

        // 4. Acceleration & Friction (Ground vs Slide vs Air vs Wallrun)
        if (p.grounded) {
          const friction = p.sliding ? 1.15 : 6.5;
          p.vel.x -= p.vel.x * friction * dt;
          p.vel.z -= p.vel.z * friction * dt;

          const accel = p.sliding ? 14.0 : 65.0;
          p.vel.x += wishDir.x * accel * dt;
          p.vel.z += wishDir.z * accel * dt;
        } else if (p.wallrunning) {
          p.vel.x -= p.vel.x * 1.4 * dt;
          p.vel.z -= p.vel.z * 1.4 * dt;

          const wallTangent = new THREE.Vector3(-p.wallNormal.z, 0, p.wallNormal.x);
          if (wallTangent.dot(forward) < 0) wallTangent.negate();

          const currentSpeed = Math.hypot(p.vel.x, p.vel.z);
          const targetWallSpeed = Math.max(currentSpeed, 21.5);
          p.vel.x = THREE.MathUtils.lerp(p.vel.x, wallTangent.x * targetWallSpeed, 6 * dt);
          p.vel.z = THREE.MathUtils.lerp(p.vel.z, wallTangent.z * targetWallSpeed, 6 * dt);

          // Low gravity on walls
          p.vel.y = Math.max(p.vel.y - 5.5 * dt, -1.2);
          p.wallRunTimer += dt;
          if (p.wallRunTimer > 3.2) {
            p.wallrunning = false;
            p.wallCooldown = 0.35;
          }
        } else {
          // Air Strafe Acceleration
          p.vel.x -= p.vel.x * 0.35 * dt;
          p.vel.z -= p.vel.z * 0.35 * dt;
          p.vel.x += wishDir.x * 26.0 * dt;
          p.vel.z += wishDir.z * 26.0 * dt;
          p.vel.y -= 28.5 * dt; // Gravity
        }

        // 5. Move & Resolve Collisions (Y Axis then XZ Plane)
        p.pos.y += p.vel.y * dt;
        p.grounded = false;
        p.onSlidePad = false;

        const eyeOffset = p.sliding ? 1.15 : p.height;

        for (const box of allColliders) {
          if (
            p.pos.x + p.radius > box.minX &&
            p.pos.x - p.radius < box.maxX &&
            p.pos.z + p.radius > box.minZ &&
            p.pos.z - p.radius < box.maxZ
          ) {
            const feetY = p.pos.y - eyeOffset;
            if (p.vel.y <= 0 && feetY <= box.maxY && feetY >= box.maxY - 2.2) {
              p.pos.y = box.maxY + eyeOffset;
              p.vel.y = 0;
              p.grounded = true;
              p.wallrunning = false;
              p.canDoubleJump = true;

              if (box.isSlidePad) {
                p.onSlidePad = true;
                if (p.sliding && p.slideBoostCooldown <= 0) {
                  p.vel.addScaledVector(forward, 21.0);
                  p.slideBoostCooldown = 0.85;
                  sfx.playSlideBoost();
                }
              }

              if (box.isExit) {
                g.state = 'WON';
                setGameState('WON');
                const run = {
                  name: g.pilotName || 'PILOT',
                  time: Math.round(g.elapsedTime * 100) / 100,
                  score: g.score,
                };
                g.localRuns.push(run);
                setHud((h) => ({ ...h, elapsedTime: run.time, score: run.score }));
                if (g.netSend) {
                  g.netSend({ type: 'RUN_FINISHED', time: run.time, score: run.score });
                } else {
                  setLeaderboard({ ...rankRuns(g.localRuns), shared: false });
                }
                sfx.playVictory();
                safeExitPointerLock();
              }
            }
          }
        }

        for (const prism of g.wallPrisms) {
          const feetY = p.pos.y - eyeOffset;
          if (p.vel.y > 0 || feetY > prism.maxY || feetY < prism.maxY - 2.2) continue;
          const c = prismContact(prism, p.pos.x, p.pos.z, p.radius);
          if (c && c.dist < p.radius) {
            p.pos.y = prism.maxY + eyeOffset;
            p.vel.y = 0;
            p.grounded = true;
            p.wallrunning = false;
            p.canDoubleJump = true;
          }
        }

        // Move XZ and detect Wallrunning Contacts
        p.pos.x += p.vel.x * dt;
        p.pos.z += p.vel.z * dt;

        let touchedWallNormal = null;
        const detectRadius = p.radius + 0.38;

        for (const box of allColliders) {
          const feetY = p.pos.y - eyeOffset;
          if (p.pos.y > box.minY + 0.5 && feetY < box.maxY - 0.4) {
            if (
              p.pos.x + p.radius > box.minX &&
              p.pos.x - p.radius < box.maxX &&
              p.pos.z + p.radius > box.minZ &&
              p.pos.z - p.radius < box.maxZ
            ) {
              const overlapLeft = p.pos.x + p.radius - box.minX;
              const overlapRight = box.maxX - (p.pos.x - p.radius);
              const overlapFront = p.pos.z + p.radius - box.minZ;
              const overlapBack = box.maxZ - (p.pos.z - p.radius);

              const minOverlap = Math.min(overlapLeft, overlapRight, overlapFront, overlapBack);

              if (minOverlap === overlapLeft) {
                p.pos.x = box.minX - p.radius;
                if (p.vel.x > 0) p.vel.x = 0;
                touchedWallNormal = new THREE.Vector3(-1, 0, 0);
              } else if (minOverlap === overlapRight) {
                p.pos.x = box.maxX + p.radius;
                if (p.vel.x < 0) p.vel.x = 0;
                touchedWallNormal = new THREE.Vector3(1, 0, 0);
              } else if (minOverlap === overlapFront) {
                p.pos.z = box.minZ - p.radius;
                if (p.vel.z > 0) p.vel.z = 0;
                touchedWallNormal = new THREE.Vector3(0, 0, -1);
              } else {
                p.pos.z = box.maxZ + p.radius;
                if (p.vel.z < 0) p.vel.z = 0;
                touchedWallNormal = new THREE.Vector3(0, 0, 1);
              }
            } else if (
              !touchedWallNormal &&
              p.pos.x + detectRadius > box.minX &&
              p.pos.x - detectRadius < box.maxX &&
              p.pos.z + detectRadius > box.minZ &&
              p.pos.z - detectRadius < box.maxZ
            ) {
              const dLeft = Math.abs(p.pos.x - box.minX);
              const dRight = Math.abs(p.pos.x - box.maxX);
              const dFront = Math.abs(p.pos.z - box.minZ);
              const dBack = Math.abs(p.pos.z - box.maxZ);
              const minD = Math.min(dLeft, dRight, dFront, dBack);
              if (minD === dLeft) touchedWallNormal = new THREE.Vector3(-1, 0, 0);
              else if (minD === dRight) touchedWallNormal = new THREE.Vector3(1, 0, 0);
              else if (minD === dFront) touchedWallNormal = new THREE.Vector3(0, 0, -1);
              else touchedWallNormal = new THREE.Vector3(0, 0, 1);
            }
          }
        }

        for (const prism of g.wallPrisms) {
          const feetY = p.pos.y - eyeOffset;
          if (!(p.pos.y > prism.minY + 0.5 && feetY < prism.maxY - 0.4)) continue;
          const c = prismContact(prism, p.pos.x, p.pos.z, detectRadius);
          if (!c) continue;
          if (c.dist < p.radius) {
            // Push out and drop the velocity going into the wall (keeps the sliding part)
            const push = p.radius - c.dist;
            p.pos.x += c.nx * push;
            p.pos.z += c.nz * push;
            const into = p.vel.x * c.nx + p.vel.z * c.nz;
            if (into < 0) {
              p.vel.x -= c.nx * into;
              p.vel.z -= c.nz * into;
            }
            touchedWallNormal = new THREE.Vector3(c.nx, 0, c.nz);
          } else if (!touchedWallNormal) {
            touchedWallNormal = new THREE.Vector3(c.nx, 0, c.nz);
          }
        }

        // Engage or Maintain Titanfall 2 Wallrun
        const currentHorizSpeed = Math.hypot(p.vel.x, p.vel.z);
        if (!p.grounded && touchedWallNormal && currentHorizSpeed > 6.5 && p.wallCooldown <= 0) {
          if (!p.wallrunning) {
            p.wallrunning = true;
            p.wallRunTimer = 0;
            p.canDoubleJump = true;
            p.vel.y = Math.max(p.vel.y * 0.4, 2.2);
            sfx.playWallAttach();
          }
          p.wallNormal.copy(touchedWallNormal);
          const sideDot = right.dot(p.wallNormal);
          p.wallSide = sideDot > 0 ? 'LEFT' : 'RIGHT';
        } else {
          p.wallrunning = false;
          p.wallSide = null;
        }

        // 6. Camera Tilt (Roll) & FOV Speed Effect
        let targetRoll = 0;
        if (p.wallrunning) {
          targetRoll = p.wallSide === 'LEFT' ? 0.24 : -0.24;
        } else if (p.sliding) {
          targetRoll = -0.08;
        }
        p.roll = THREE.MathUtils.lerp(p.roll, targetRoll, 11 * dt);

        const targetFov = THREE.MathUtils.clamp(85 + (currentHorizSpeed - 12) * 0.65, 85, 108);
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 8 * dt);
        camera.updateProjectionMatrix();

        camera.position.copy(p.pos);
        camera.rotation.set(p.pitch, p.yaw, p.roll, 'YXZ');

        if (currentHorizSpeed > p.maxSpeedReached) {
          p.maxSpeedReached = currentHorizSpeed;
        }

        // 7. Check Lava Death Condition
        if (p.pos.y - eyeOffset < g.lavaY - 0.15) {
          g.state = 'LOST';
          setGameState('LOST');
          sfx.playLavaBurn();
          safeExitPointerLock();
        }

        // 8. Sync HUD State
        hudUpdateCounter++;
        if (hudUpdateCounter % 3 === 0) {
          const dist = Math.round(p.pos.distanceTo(g.exitPos));
          const aliveCount = g.enemies.filter((e) => e.alive).length;
          setHud({
            speed: Math.round(currentHorizSpeed * 3.6), // km/h feel
            maxSpeed: Math.round(p.maxSpeedReached * 3.6),
            altitude: Number((p.pos.y - g.lavaY).toFixed(1)),
            lavaLevel: Number(g.lavaY.toFixed(1)),
            wallrunning: p.wallrunning,
            wallSide: p.wallSide,
            sliding: p.sliding || p.onSlidePad,
            doubleJumpReady: p.canDoubleJump,
            slideBoostCooldown: p.slideBoostCooldown,
            distanceToExit: dist,
            elapsedTime: Math.round(g.elapsedTime * 100) / 100,
            platformAlert: g.nextPlatformSpawnTimer < 0.7,
            activePlatforms: activePlatCount,
            kills: g.kills,
            streak: g.streak,
            streakTimeLeft: Math.max(0, Number(g.streakTimer.toFixed(1))),
            totalEnemies: g.enemies.length,
            enemiesAlive: aliveCount,
            score: g.score,
          });
        }
      } else {
        // Orbit preview camera gently when in Menu
        const t = performance.now() * 0.0003;
        camera.position.set(Math.cos(t) * 60, 48, Math.sin(t) * 60);
        camera.lookAt(0, 6, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Responsive Resize Handler
    // Follows the container's real size, so the view fixes itself if styles arrive late.
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    resizeObserver?.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('pointerlockerror', onPointerLockError);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
    };
  }, [triggerKillPopup, safeRequestPointerLock, safeExitPointerLock]);


  return (
    <div className="relative w-full h-screen bg-slate-950 text-white overflow-hidden font-sans select-none">
      {/* 3D WebGL Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-crosshair" />

      {/* Top Navigation & ZIP Export Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold tracking-wider uppercase flex items-center gap-2">
              Lava Labyrinth <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">TF2 PARKOUR + BAZOOKA</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Wallrun the maze, blast wall-clinging cyborg nerds, and slide-boost off erupting pillars
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {zipStatus && (
            <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-3 py-1.5 rounded-full animate-pulse">
              {zipStatus}
            </span>
          )}

          <button
            onClick={() => setShowMultiplayerModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
              mpMode !== 'OFFLINE'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border-slate-700'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>
              {mpMode === 'OFFLINE'
                ? 'WiFi / Co-op Lobby'
                : `${roomCode} (${remotePilotsList.length + 1} Pilots)`}
            </span>
          </button>

          <button
            onClick={() => setShowControlsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Pilot Guide</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title={muted ? 'Unmute Synth Audio' : 'Mute Synth Audio'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

        </div>
      </div>

      {/* ========================================== */}
      {/* IN-GAME TITANFALL 2 PILOT HUD + KILL POPUPS */}
      {/* ========================================== */}
      {gameState === 'PLAYING' && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Dynamic Center Crosshair + Wallrun Arc + Rocket Ready Indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {hud.wallrunning && (
                <div
                  className={`absolute w-20 h-20 rounded-full border-2 border-cyan-400/80 transition-transform duration-150 ${
                    hud.wallSide === 'LEFT' ? 'border-r-transparent -rotate-12' : 'border-l-transparent rotate-12'
                  }`}
                />
              )}
              <Crosshair
                className={`w-7 h-7 transition-transform duration-100 ${
                  hud.sliding
                    ? 'text-cyan-300 scale-125'
                    : hud.wallrunning
                    ? 'text-emerald-400 scale-110'
                    : 'text-orange-400/90'
                }`}
              />
            </div>
          </div>

          {/* FLASHY "NERD KILLED" + STREAK POPUP OVERLAY */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30">
            {killPopups.map((popup) => (
              <div
                key={popup.id}
                style={{
                  transform: `translate(${popup.offsetX}px, ${popup.offsetY}px)`,
                }}
                className="mb-2 flex flex-col items-center animate-bounce"
              >
                <div className="px-6 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-rose-600 to-orange-500 border-2 border-yellow-300 shadow-[0_0_35px_rgba(244,63,94,0.85)] flex items-center gap-3">
                  <Skull className="w-7 h-7 text-yellow-300 animate-spin" style={{ animationDuration: '1.5s' }} />
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-black italic tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      {popup.label}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-yellow-200">
                      <span>{popup.subtitle}</span>
                      <span>•</span>
                      <span>+{popup.points} PTS</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Persistent Top-Right Kill Streak & Score Tracker */}
          <div className="absolute top-20 right-6 flex flex-col items-end gap-2">
            <div className="bg-slate-950/85 backdrop-blur-md border border-fuchsia-500/40 rounded-xl px-4 py-3 shadow-xl min-w-[210px]">
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-fuchsia-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Cyborg Nerds
                </span>
                <span className="text-xs font-mono text-slate-300">
                  {hud.kills} / {hud.totalEnemies} Eliminated
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <div className="text-[10px] uppercase text-slate-400">Active Streak</div>
                  <div
                    className={`text-2xl font-black font-mono ${
                      hud.streak >= 3
                        ? 'text-yellow-300 animate-pulse'
                        : hud.streak > 0
                        ? 'text-fuchsia-400'
                        : 'text-slate-500'
                    }`}
                  >
                    x{hud.streak}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-slate-400">Combat Score</div>
                  <div className="text-xl font-black font-mono text-cyan-300">{hud.score}</div>
                </div>
              </div>

              {/* Streak Timer Bar */}
              {hud.streak > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-yellow-300 font-mono mb-0.5">
                    <span>STREAK COMBO TIMER</span>
                    <span>{hud.streakTimeLeft}s</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fuchsia-500 to-yellow-400 transition-all duration-150"
                      style={{ width: `${Math.min(100, (hud.streakTimeLeft / 6.5) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Connected WiFi / Co-op Pilots Scoreboard */}
            {mpMode !== 'OFFLINE' && (
              <div className="bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 rounded-xl px-4 py-2.5 shadow-xl min-w-[210px]">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" /> Room: {roomCode}
                  </span>
                  <span>{remotePilotsList.length + 1} Online</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-cyan-300 font-bold">
                    <span>{pilotName} (YOU)</span>
                    <span>{hud.score} pts</span>
                  </div>
                  {remotePilotsList.map((peer) => (
                    <div key={peer.id} className="flex justify-between text-slate-300">
                      <span className="truncate max-w-[120px]">{peer.name || 'PILOT'}</span>
                      <span className="text-emerald-400">{peer.score || 0} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Left HUD: Speedometer & Jump-Kit Status */}
          <div className="absolute bottom-7 left-7 flex flex-col gap-3">
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 w-64 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider mb-1">
                <span>Velocity</span>
                <span className="text-cyan-400 font-mono">MAX {hud.maxSpeed} KM/H</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black font-mono tracking-tight text-white">
                  {hud.speed}
                </span>
                <span className="text-xs font-semibold text-cyan-400 uppercase">km/h</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-400 to-emerald-400 transition-all duration-100"
                  style={{ width: `${Math.min(100, (hud.speed / 120) * 100)}%` }}
                />
              </div>

              {/* Parkour State Pills */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                    hud.wallrunning
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse'
                      : 'bg-slate-900/70 border-slate-800 text-slate-500'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{hud.wallrunning ? `WALLRUN (${hud.wallSide})` : 'WALLRUN IDLE'}</span>
                </div>

                <div
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                    hud.sliding
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 animate-bounce'
                      : 'bg-slate-900/70 border-slate-800 text-slate-500'
                  }`}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>{hud.sliding ? 'SLIDE BOOST!' : 'SLIDE READY'}</span>
                </div>
              </div>
            </div>

            {/* Bazooka & Jump-Kit Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  hud.doubleJumpReady
                    ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-500'
                }`}
              >
                JUMP-KIT: {hud.doubleJumpReady ? 'ONLINE' : 'RECHARGING'}
              </div>
              <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-950/80 border border-orange-500/50 text-orange-300">
                LMB: FIRE BAZOOKA
              </div>
              <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-950/80 border border-yellow-500/50 text-yellow-300">
                TAB: LEADERBOARD
              </div>
            </div>
          </div>

          {/* Right HUD: Rising Lava Altimeter & Beacon Tracker */}
          <div className="absolute bottom-7 right-7 flex flex-col items-end gap-3">
            {hud.platformAlert && (
              <div className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse shadow-lg">
                <Zap className="w-4 h-4 text-cyan-300" />
                Boost Pillar Erupting from Lava!
              </div>
            )}

            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 w-64 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 uppercase mb-2">
                <span className="flex items-center gap-1 text-orange-400 font-bold">
                  <Flame className="w-3.5 h-3.5" /> Magma Clearance
                </span>
                <span className="font-mono text-white font-bold">{hud.altitude}m</span>
              </div>

              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-150 ${
                    hud.altitude < 4.5
                      ? 'bg-rose-500 animate-pulse'
                      : 'bg-gradient-to-r from-orange-500 to-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(8, (hud.altitude / 22) * 100))}%` }}
                />
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-400" /> Exit Beacon
                </span>
                <span className="text-cyan-300 font-mono font-bold text-sm">{hud.distanceToExit}m</span>
              </div>

              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Erupted Boost Pads</span>
                <span className="text-emerald-400 font-mono font-bold">{hud.activePlatforms} Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* OVERLAY MENUS (START, PAUSE, VICTORY, LOSS) */}
      {/* ========================================== */}
      {gameState !== 'PLAYING' && (
        <div className="absolute inset-0 z-20 flex flex-col lg:flex-row items-center justify-center gap-6 bg-slate-950/75 backdrop-blur-md p-6 pt-24 lg:pt-6 overflow-y-auto">
          <div className="max-w-lg w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-7 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

            {gameState === 'MENU' && (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold uppercase tracking-widest mb-4">
                  <Flame className="w-3.5 h-3.5" /> Protocol 3: Escape the Labyrinth
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
                  LAVA LABYRINTH PARKOUR
                </h2>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  The labyrinth floor is rising magma. Chain <span className="text-cyan-400 font-semibold">Titanfall 2 wallruns</span>, blast wall-clinging <span className="text-fuchsia-400 font-semibold">white-hoodie cyborg nerds</span> with your Bazooka for streak combos, and hit <span className="text-emerald-400 font-semibold">Shift / C</span> on erupting boost pads!
                </p>
              </>
            )}

            {gameState === 'PAUSED' && (
              <>
                <h2 className="text-3xl font-black text-white mb-2">SIMULATION PAUSED</h2>
                <p className="text-sm text-slate-400 mb-6">
                  Current Streak: <span className="text-yellow-300 font-bold">x{hud.streak}</span> • Nerds Eliminated: <span className="text-fuchsia-400 font-bold">{hud.kills}</span>
                </p>
              </>
            )}

            {gameState === 'WON' && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-emerald-400 mb-1">LABYRINTH ESCAPED!</h2>
                <p className="text-sm text-slate-300 mb-5">
                  Phenomenal Pilot movement! You reached the extraction beacon before the magma consumed the maze.
                </p>
                <div className="grid grid-cols-4 gap-2 mb-6 bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Clear Time</div>
                    <div className="text-lg font-black font-mono text-white">{formatRunTime(hud.elapsedTime)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Top Speed</div>
                    <div className="text-lg font-black font-mono text-cyan-400">{hud.maxSpeed}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Nerds Killed</div>
                    <div className="text-lg font-black font-mono text-fuchsia-400">{hud.kills}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Total Score</div>
                    <div className="text-lg font-black font-mono text-yellow-300">{hud.score}</div>
                  </div>
                </div>
              </>
            )}

            {gameState === 'LOST' && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-rose-400 mb-1">
                  {deathCause ? `FRAGGED BY ${deathCause}` : 'CONSUMED BY MAGMA'}
                </h2>
                <p className="text-sm text-slate-300 mb-5">
                  {deathCause
                    ? 'Keep moving, stay off their line of fire, and rocket them back!'
                    : 'Stay high on the labyrinth walls, rocket-jump or chain wall-kicks, and use erupting cyan boost pillars!'}
                </p>
                <div className="grid grid-cols-3 gap-2 mb-6 bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Nerds Killed</div>
                    <div className="text-lg font-black font-mono text-fuchsia-400">{hud.kills}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Top Speed</div>
                    <div className="text-lg font-black font-mono text-cyan-400">{hud.maxSpeed} km/h</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Score</div>
                    <div className="text-lg font-black font-mono text-yellow-300">{hud.score}</div>
                  </div>
                </div>
              </>
            )}

            {/* Controls Quick Reference Card */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 text-left mb-6 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Move / Strafe</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-mono">W A S D</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Fire Bazooka Rocket</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-orange-300 font-mono">Left Click (LMB)</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Wallrun & Wall-Kick / Double Jump</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-mono">SPACEBAR</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">TF2 Slide Boost (Especially on Cyan Pillars)</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-emerald-300 font-mono">SHIFT or C</kbd>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={startGame}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 transition cursor-pointer"
              >
                {gameState === 'PAUSED' ? <Play className="w-4 h-4 fill-current" /> : <RotateCcw className="w-4 h-4" />}
                <span>{gameState === 'MENU' ? 'Launch Parkour Run' : gameState === 'PAUSED' ? 'Resume Run' : 'Deploy Again'}</span>
              </button>

            </div>
          </div>
          <LeaderboardPanel board={leaderboard} me={pilotName} />
        </div>
      )}

      {gameState === 'PLAYING' && showBoardHotkey && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none p-6">
          <LeaderboardPanel board={leaderboard} me={pilotName} />
        </div>
      )}

      {/* Pilot Movement Guide Modal */}
      {showControlsModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" /> Titanfall 2 Movement & Combat Guide
              </h3>
              <button
                onClick={() => setShowControlsModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-cyan-400 block mb-0.5">1. Wallrunning & Camera Roll:</strong>
                Jump toward any labyrinth wall while holding <code className="text-white">W</code>. You will automatically lock onto the wall, tilt your camera, and glide with reduced gravity.
              </li>
              <li className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-fuchsia-400 block mb-0.5">2. Bazooka & Cyborg Nerds:</strong>
                Press <code className="text-white">Left-Click</code> to launch explosive rockets at wall-clinging cyborgs wearing white hoodies, black pants, and white sneakers. Chain kills within 6.5 seconds to multiply your <code className="text-yellow-300">NERD KILLED</code> streak!
              </li>
              <li className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-orange-400 block mb-0.5">3. Erupting Lava Boost Pillars:</strong>
                Watch for basalt columns with glowing cyan tops rising out of the lava. Land on them and press <code className="text-white">Shift</code> or <code className="text-white">C</code> for an instant high-velocity TF2 slide-boost!
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* WiFi LAN & Live Room Multiplayer Modal */}
      {showMultiplayerModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" /> WiFi & Co-op Multiplayer Lobby
              </h3>
              <button
                onClick={() => setShowMultiplayerModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] uppercase text-slate-400 font-bold mb-1">
                  Your Pilot Callsign
                </label>
                <input
                  type="text"
                  value={pilotName}
                  onChange={(e) => setPilotName(e.target.value.toUpperCase().slice(0, 14))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-slate-400 font-bold mb-1">
                  Shared Room Code
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 10))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(roomCode);
                      setCopiedRoom(true);
                      setTimeout(() => setCopiedRoom(false), 1500);
                    }}
                    className="px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="Copy Room Code"
                  >
                    {copiedRoom ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="space-y-2.5 mb-5">
              <div
                onClick={() => setMpMode('CLOUD_ROOM')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  mpMode === 'CLOUD_ROOM'
                    ? 'bg-emerald-950/50 border-emerald-400'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                    <Radio className="w-4 h-4" /> Option 1: Host's Server (Recommended)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    AUTO-CONNECT
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Everyone who opened the host&apos;s link and uses the same Room Code (<code className="text-white">{roomCode}</code>) plays together. Nothing to type in.
                </p>
              </div>

              <div
                onClick={() => setMpMode('WIFI_WS')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  mpMode === 'WIFI_WS'
                    ? 'bg-cyan-950/50 border-cyan-400'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                    <Wifi className="w-4 h-4" /> Option 2: Custom Server Address
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    ADVANCED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 mb-2">
                  Only needed if you run your own copy of the game and want to join someone else&apos;s server. Use the address their server window prints:
                </p>
                <input
                  type="text"
                  value={lanUrl}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    setLanUrl(e.target.value);
                    setMpMode('WIFI_WS');
                  }}
                  placeholder="ws://192.168.1.100:8080/ws"
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-200"
                />
              </div>

              {mpMode !== 'OFFLINE' && (
                <button
                  onClick={() => {
                    setMpMode('OFFLINE');
                    setMpStatus('Singleplayer Mode');
                  }}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Disconnect & Return to Singleplayer
                </button>
              )}
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">{mpStatus}</span>
              <span className="font-mono font-bold text-emerald-400">
                {remotePilotsList.length} Remote Pilot(s)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}