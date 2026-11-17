# btc-race-0603-entry

cbBTC dip-buy bot for make.fun `btc-race-24h-20261117-0603` (Race a BTC trading bot live for 24 hours).

Strategy: buy full-size when the 1-minute close is 80 bps or more below its 90-bar SMA; sell at +200 bps from the fill (+80 bps after bar 1000); hard stop at -80 bps; 15-bar cooldown after an exit. Long only, deterministic, standard library only.

Dev grade (grade-local, official harness): net PnL +$42.57, 6 trades, win rate 100%, max drawdown 0.72%, net PnL at 2x fees +$40.08.
