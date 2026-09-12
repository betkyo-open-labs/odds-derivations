#!/usr/bin/env node
// Expected return of every Plinko board: Σ C(rows, k) / 2^rows × multiplier[k].
//   node plinko-return.mjs [path/to/plinko-multipliers.json]
import { readFileSync } from 'node:fs';
const src = process.argv[2] ?? new URL('../odds-data/data/plinko-multipliers.json', import.meta.url);
const { data } = JSON.parse(readFileSync(src, 'utf8'));
const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
for (const [risk, byRows] of Object.entries(data)) {
    const line = Object.entries(byRows).map(([rows, mult]) => {
        const ret = mult.reduce((a, m, k) => a + (C(+rows, k) / 2 ** +rows) * m, 0);
        return `${rows}:${(100 * ret).toFixed(2)}%`;
    });
    console.log(risk.padEnd(7), line.join('  '));
}
