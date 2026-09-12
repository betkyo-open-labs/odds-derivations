#!/usr/bin/env node
// Monte Carlo of the 75-ball solo bingo described in the Journal: a 5×5 card
// (column ranges of 15, free centre), 38 balls drawn from 75, paid by how many
// of the 12 lines complete. Pay tiers are the engine's published tiers.
//   node bingo-sim.mjs [rounds=200000]
const N = +(process.argv[2] ?? 200000);
const PAY = { 0: 0, 1: 1.5, 2: 4, 3: 12, 4: 30, 5: 100, 6: 200, 7: 500 };
const rnd = (n) => Math.floor(Math.random() * n);
const drawSome = (pool, k) => { const p = pool.slice(); const out = []; for (let i = 0; i < k; i++) { const j = rnd(p.length); out.push(p[j]); p[j] = p[p.length - 1]; p.pop(); } return out; };
const lines = []; for (let r = 0; r < 5; r++) lines.push([0, 1, 2, 3, 4].map((c) => r * 5 + c)); for (let c = 0; c < 5; c++) lines.push([0, 1, 2, 3, 4].map((r) => r * 5 + c)); lines.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);
const count = {}; let ret = 0;
for (let i = 0; i < N; i++) {
    const card = new Array(25); for (let c = 0; c < 5; c++) { const nums = drawSome(Array.from({ length: 15 }, (_, k) => c * 15 + k + 1), 5); for (let r = 0; r < 5; r++) card[r * 5 + c] = nums[r]; } card[12] = 0;
    const drawn = new Set(drawSome(Array.from({ length: 75 }, (_, k) => k + 1), 38));
    const done = lines.filter((L) => L.every((cell) => card[cell] === 0 || drawn.has(card[cell]))).length;
    const tier = Math.min(done, 7); count[tier] = (count[tier] || 0) + 1; ret += PAY[tier];
}
for (const t of Object.keys(count).sort((a, b) => a - b)) console.log(`${t} lines: ${(100 * count[t] / N).toFixed(3)}%`);
console.log(`return ${(100 * ret / N).toFixed(2)}%  hit rate ${(100 * (1 - (count[0] || 0) / N)).toFixed(1)}%  (${N} rounds)`);
