// Lane A mean-reversion scalp: buy CBBTC when close is DIP_BPS below SMA(W),
// exit at TP_BPS from entry fill (LATE_TP_BPS after LATE_BAR), SL / time-stop.
// Long only, full-size, one position, cooldown COOL bars after an exit fill.
// Deterministic: float64 closes only, no clock, no randomness.
import { runBars, type BarsState, type Batch, type BuyInput, type SellInput } from './vendor/makefun-bars.ts';

const W = 90;
const DIP_BPS = 80;
const TP_BPS = 200;
const SL_BPS = 80;
const TS_BARS = 0;
const COOL_BARS = 15;
const LATE_BAR = 1000;
const LATE_TP_BPS = 80;
const TP1_BPS = 0;
const MAX_SLIP_BPS = 100;

const closes: number[] = [];
let entryPx = 0;
let entryBar = -1;
let lastExitBar = -9999;
let halfTaken = false;

function sma(): number | null {
  if (closes.length < W) return null;
  let s = 0;
  for (let i = closes.length - W; i < closes.length; i++) s += closes[i];
  return s / W;
}

await runBars({
  onBatch(state: BarsState, batch: Batch) {
    // Fold fills first: entry price / exit bookkeeping from the harness's own fills.
    for (const f of batch.fills) {
      if (f.status !== 'filled') continue;
      if (f.side === 'buy') {
        entryPx = Number(f.price) / 100000;
        entryBar = state.seq;
        halfTaken = false;
      } else if (f.side === 'sell') {
        lastExitBar = state.seq;
      }
    }
    for (const bar of batch.bars) closes.push(Number(bar.c) / 100000);
    const devIdx = state.seq - state.warmupBars;
    const held = state.positions.get('CBBTC');
    const orders: (BuyInput | SellInput)[] = [];
    const close = closes[closes.length - 1];
    if (held !== undefined && held.qty > 0n) {
      if (entryPx > 0) {
        const retBps = ((close - entryPx) / entryPx) * 10000;
        const tpNow = LATE_TP_BPS > 0 && devIdx >= LATE_BAR ? LATE_TP_BPS : TP_BPS;
        if (TP1_BPS > 0 && !halfTaken && retBps >= TP1_BPS) {
          halfTaken = true;
          orders.push({ side: 'sell', symbol: 'CBBTC', qty: held.qty / 2n, max_slippage_bps: MAX_SLIP_BPS });
        } else if (retBps >= tpNow || retBps <= -SL_BPS || (TS_BARS > 0 && devIdx - entryBar >= TS_BARS)) {
          orders.push({ side: 'sell', symbol: 'CBBTC', qty: held.qty, max_slippage_bps: MAX_SLIP_BPS });
        }
      }
      return orders;
    }
    if (state.warmingUp) return orders;
    if (devIdx - lastExitBar < COOL_BARS) return orders;
    const m = sma();
    if (m === null) return orders;
    const dipBps = ((close - m) / m) * 10000;
    if (dipBps <= -DIP_BPS) {
      const notional = state.cash;
      if (notional >= 1000000n) {
        orders.push({ side: 'buy', symbol: 'CBBTC', notional_quote_units: notional, max_slippage_bps: MAX_SLIP_BPS });
      }
    }
    return orders;
  },
});
