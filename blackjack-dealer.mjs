#!/usr/bin/env node
// Dealer final-total distribution by upcard on an infinite shoe, dealer stands
// on all 17s: exact recursion over the rank distribution (1/13 per rank, 4/13 tens).
const ranks = { 1: 1 / 13, 2: 1 / 13, 3: 1 / 13, 4: 1 / 13, 5: 1 / 13, 6: 1 / 13, 7: 1 / 13, 8: 1 / 13, 9: 1 / 13, 10: 4 / 13 };
const memo = new Map();
function dist(total, soft) {
    const key = `${total}:${soft}`; if (memo.has(key)) return memo.get(key);
    let out;
    if (total > 21) out = soft ? dist(total - 10, false) : { bust: 1 };
    else if (total >= 17) out = { [total]: 1 };
    else { out = {}; for (const [r, p] of Object.entries(ranks)) { let t = total + +r, s = soft; if (+r === 1 && t + 10 <= 21) { t += 10; s = true; } for (const [k, v] of Object.entries(dist(t, s))) out[k] = (out[k] || 0) + p * v; } }
    memo.set(key, out); return out;
}
console.log('up    bust    17    18    19    20    21');
for (const u of [2, 3, 4, 5, 6, 7, 8, 9, 10, 1]) {
    const d = u === 1 ? dist(11, true) : dist(u, false);
    console.log((u === 1 ? 'A' : String(u)).padEnd(4), ['bust', 17, 18, 19, 20, 21].map((k) => (100 * (d[k] || 0)).toFixed(1).padStart(5)).join(' '));
}
for (const t of [12, 13, 14, 15, 16]) console.log(`hit hard ${t}: bust ${(100 * Object.entries(ranks).reduce((a, [r, p]) => a + (t + +r > 21 ? p : 0), 0)).toFixed(1)}%`);
