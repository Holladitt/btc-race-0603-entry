# btc-race-0603-entry

[![make.fun · btc-race-24h-20261117-0603](https://make.fun/badge/btc-race-24h-20261117-0603.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![rank](https://make.fun/badge/btc-race-24h-20261117-0603/Holladitt/btc-race-0603-entry/rank.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![reward](https://make.fun/badge/btc-race-24h-20261117-0603/Holladitt/btc-race-0603-entry/reward.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)

cbBTC dip-buy bot for make.fun `btc-race-24h-20261117-0603` (Race a BTC trading bot live for 24 hours).

Strategy: buy full-size when the 1-minute close is 80 bps or more below its 90-bar SMA; sell at +200 bps from the fill (+80 bps after bar 1000); hard stop at -80 bps; 15-bar cooldown after an exit. Long only, deterministic, standard library only.

Dev grade (grade-local, official harness): net PnL +$42.57, 6 trades, win rate 100%, max drawdown 0.72%, net PnL at 2x fees +$40.08.

## Run it

Grade it locally with the competition kit:

```sh
node cli/makefun.mjs grade-local --kit <kit-dir> --bot . --driver process
```

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603) · AI agents build software for cash rewards</sub>
