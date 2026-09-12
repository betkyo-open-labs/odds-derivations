#!/usr/bin/env node
// Renders the charts in charts/ as plain SVG from the same arithmetic the other
// scripts use — no dependencies, so `node charts.mjs` reproduces every image.
import { writeFileSync, mkdirSync } from 'node:fs';
mkdirSync('charts', { recursive: true });
const BG = '#0f1216', INK = '#e8e6df', MUTE = '#8b9096', GOLD = '#f5c451', JADE = '#3ddc97', ROSE = '#ff6b8a', SKY = '#63b3ff';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const svg = (w, h, body, title) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="ui-sans-serif, -apple-system, Segoe UI, Helvetica, Arial, sans-serif">
<rect width="${w}" height="${h}" fill="${BG}"/>
<text x="32" y="44" fill="${INK}" font-size="24" font-weight="700">${esc(title)}</text>
${body}</svg>`;

// 1. Dealer bust probability by upcard (infinite shoe, S17) — from blackjack-dealer.mjs
{
  const ranks = { 1: 1 / 13, 2: 1 / 13, 3: 1 / 13, 4: 1 / 13, 5: 1 / 13, 6: 1 / 13, 7: 1 / 13, 8: 1 / 13, 9: 1 / 13, 10: 4 / 13 };
  const memo = new Map();
  const dist = (total, soft) => { const key = `${total}:${soft}`; if (memo.has(key)) return memo.get(key); let out;
    if (total > 21) out = soft ? dist(total - 10, false) : { bust: 1 };
    else if (total >= 17) out = { [total]: 1 };
    else { out = {}; for (const [r, p] of Object.entries(ranks)) { let t = total + +r, s = soft; if (+r === 1 && t + 10 <= 21) { t += 10; s = true; } for (const [k, v] of Object.entries(dist(t, s))) out[k] = (out[k] || 0) + p * v; } }
    memo.set(key, out); return out; };
  const ups = [2, 3, 4, 5, 6, 7, 8, 9, 10, 1];
  const bust = ups.map((u) => (u === 1 ? dist(11, true) : dist(u, false)).bust || 0);
  const W = 900, H = 460, L = 70, T = 80, PW = 780, PH = 300;
  let b = '';
  for (const g of [0, 10, 20, 30, 40, 50]) { const y = T + PH - (g / 50) * PH; b += `<line x1="${L}" y1="${y}" x2="${L + PW}" y2="${y}" stroke="#262b31"/><text x="${L - 10}" y="${y + 5}" fill="${MUTE}" font-size="13" text-anchor="end">${g}%</text>`; }
  const bw = PW / ups.length;
  ups.forEach((u, i) => { const v = bust[i] * 100, h = (v / 50) * PH, x = L + i * bw + bw * 0.18, y = T + PH - h; const c = u >= 2 && u <= 6 ? ROSE : u === 1 ? SKY : GOLD;
    b += `<rect x="${x}" y="${y}" width="${bw * 0.64}" height="${h}" rx="4" fill="${c}"/><text x="${x + bw * 0.32}" y="${y - 8}" fill="${INK}" font-size="14" font-weight="600" text-anchor="middle">${v.toFixed(1)}</text><text x="${x + bw * 0.32}" y="${T + PH + 24}" fill="${INK}" font-size="15" text-anchor="middle">${u === 1 ? 'A' : u}</text>`; });
  b += `<text x="${L + PW / 2}" y="${T + PH + 52}" fill="${MUTE}" font-size="13" text-anchor="middle">dealer upcard · infinite shoe, dealer stands on all 17s · exact recursion, blackjack-dealer.mjs</text>`;
  writeFileSync('charts/dealer-bust-by-upcard.svg', svg(W, H, b, 'Dealer bust probability by upcard'));
}

// 2. Plinko multipliers, 16 rows, three risk levels (log scale) — same tables as plinko-return.mjs
{
  const PL = { LOW: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16], MEDIUM: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110], HIGH: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000] };
  const W = 900, H = 480, L = 70, T = 80, PW = 780, PH = 320, lo = Math.log10(0.1), hi = Math.log10(1000);
  const Y = (m) => T + PH - ((Math.log10(m) - lo) / (hi - lo)) * PH;
  let b = '';
  for (const g of [0.1, 1, 10, 100, 1000]) { const y = Y(g); b += `<line x1="${L}" y1="${y}" x2="${L + PW}" y2="${y}" stroke="#262b31"/><text x="${L - 10}" y="${y + 5}" fill="${MUTE}" font-size="13" text-anchor="end">×${g}</text>`; }
  const cols = { LOW: JADE, MEDIUM: GOLD, HIGH: ROSE };
  for (const [k, arr] of Object.entries(PL)) { const pts = arr.map((m, i) => `${L + (i / 16) * PW},${Y(m)}`).join(' ');
    b += `<polyline points="${pts}" fill="none" stroke="${cols[k]}" stroke-width="3" stroke-linejoin="round"/>` + arr.map((m, i) => `<circle cx="${L + (i / 16) * PW}" cy="${Y(m)}" r="4" fill="${cols[k]}"/>`).join(''); }
  for (let i = 0; i <= 16; i += 2) b += `<text x="${L + (i / 16) * PW}" y="${T + PH + 24}" fill="${INK}" font-size="14" text-anchor="middle">${i}</text>`;
  b += `<text x="${L + PW / 2}" y="${T + PH + 52}" fill="${MUTE}" font-size="13" text-anchor="middle">bucket (0 = far left) · 16 rows · every board returns ≈99% of stake, the risk level only moves where the return sits</text>`;
  let lx = L + PW - 260; for (const [k, c] of Object.entries(cols)) { b += `<rect x="${lx}" y="58" width="14" height="14" rx="3" fill="${c}"/><text x="${lx + 20}" y="70" fill="${INK}" font-size="14">${k}</text>`; lx += 90; }
  writeFileSync('charts/plinko-16-rows.svg', svg(W, H, b, 'Plinko multipliers by bucket, 16 rows'));
}

// 3. Keno: chance of hitting k of 10 picks (hypergeometric, 10 of 40 drawn)
{
  const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
  const hits = [...Array(11).keys()].map((k) => (C(10, k) * C(30, 10 - k)) / C(40, 10));
  const W = 900, H = 460, L = 70, T = 80, PW = 780, PH = 300, max = 0.3;
  let b = '';
  for (const g of [0, 10, 20, 30]) { const y = T + PH - (g / 100 / max) * PH; b += `<line x1="${L}" y1="${y}" x2="${L + PW}" y2="${y}" stroke="#262b31"/><text x="${L - 10}" y="${y + 5}" fill="${MUTE}" font-size="13" text-anchor="end">${g}%</text>`; }
  const bw = PW / 11;
  hits.forEach((p, k) => { const h = (p / max) * PH, x = L + k * bw + bw * 0.18, y = T + PH - h; const inv = 1 / p; const label = p >= 0.0005 ? (p * 100).toFixed(1) : '1 in ' + (inv >= 1e6 ? (inv / 1e6).toFixed(1) + 'M' : Math.round(inv).toLocaleString('en-US'));
    b += `<rect x="${x}" y="${y}" width="${bw * 0.64}" height="${Math.max(h, 1)}" rx="4" fill="${k >= 5 ? GOLD : SKY}"/><text x="${x + bw * 0.32}" y="${y - 8}" fill="${INK}" font-size="${p >= 0.0005 ? 14 : 11}" font-weight="600" text-anchor="middle">${label}</text><text x="${x + bw * 0.32}" y="${T + PH + 24}" fill="${INK}" font-size="15" text-anchor="middle">${k}</text>`; });
  b += `<text x="${L + PW / 2}" y="${T + PH + 52}" fill="${MUTE}" font-size="13" text-anchor="middle">hits out of 10 picks · 10 balls drawn from 40 · hypergeometric, the distribution every paytable in keno-return.mjs is priced against</text>`;
  writeFileSync('charts/keno-10-pick-hits.svg', svg(W, H, b, 'Keno: how often 10 picks hit k numbers'));
}
console.log('wrote charts/dealer-bust-by-upcard.svg, charts/plinko-16-rows.svg, charts/keno-10-pick-hits.svg');
