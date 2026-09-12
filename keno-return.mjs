#!/usr/bin/env node
// Expected return of every keno paytable: Σ P(hits | picks) × multiplier,
// with P from the hypergeometric draw of 10 balls from 40.
//   node keno-return.mjs [path/to/keno-paytables.json]
import { readFileSync } from 'node:fs';
const src = process.argv[2] ?? new URL('../odds-data/data/keno-paytables.json', import.meta.url);
const { data } = JSON.parse(readFileSync(src, 'utf8'));
const C = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
const BALLS = 40, DRAWN = 10;
const pHits = (picks, hits) => (C(picks, hits) * C(BALLS - picks, DRAWN - hits)) / C(BALLS, DRAWN);
for (const [level, byPicks] of Object.entries(data)) {
    const line = Object.entries(byPicks).map(([picks, byHits]) => {
        const ret = Object.entries(byHits).reduce((a, [h, m]) => a + pHits(+picks, +h) * m, 0);
        return `${picks}:${(100 * ret).toFixed(2)}%`;
    });
    console.log(level.padEnd(8), line.join('  '));
}
