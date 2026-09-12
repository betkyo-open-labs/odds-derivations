# Betkyo odds derivations

The scripts that turn the engine's published tables into the return figures quoted in the [Betkyo Journal](https://betkyo.com/en/blog/). No dependencies; each script prints the numbers the corresponding article prints.

| Script | Computes | Article |
|---|---|---|
| `keno-return.mjs` | Expected return of all forty keno paytables from the hypergeometric hit distribution (10 of 40) | [What a keno risk level actually changes](https://betkyo.com/en/blog/what-a-keno-risk-level-changes/) |
| `plinko-return.mjs` | Expected return of every Plinko board from the binomial path counts | [Plinko, priced](https://betkyo.com/en/blog/plinko-priced-the-binomial-behind-every-board/) |
| `blackjack-dealer.mjs` | Dealer bust and final-total distribution by upcard, infinite shoe, S17, exact recursion | [Dealer bust odds by upcard](https://betkyo.com/en/blog/dealer-bust-odds-by-upcard-on-an-infinite-shoe/) |
| `bingo-sim.mjs` | Monte Carlo of the 38-ball, 12-line bingo card and its pay tiers | [Designing Bingo](https://betkyo.com/en/blog/designing-bingo-38-balls-12-lines/) |

The paytables themselves are in the `odds-data` repository (and at betkyo.com/data); the round verifier is `provably-fair-verifier`. The rule that every figure must be traceable to engine source: [How the Journal verifies a number](https://betkyo.com/en/blog/how-the-journal-verifies-a-number-methodology/).

Licence: MIT. Betkyo is a crypto casino with provably fair original games. 18+. These scripts describe games with a house edge; nothing here is betting advice.
