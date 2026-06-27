# Debt Payoff Calculator (snowball vs avalanche)

A tiny, dependency-free JavaScript engine that calculates how long it takes to pay
off your debts and how much interest you'll pay — comparing the **debt snowball**
and **debt avalanche** methods. Pure and deterministic: same inputs, same answer,
no network, no tracking.

**▶ Live interactive calculator:** https://comil27.github.io/
**📊 Worked payoff examples (by balance & APR):** https://comil27.github.io/debt-payoff/

## Install

```bash
npm install github:comil27/debt-payoff-calculator
```

or just copy `index.js` — it's one self-contained function.

## Usage

```js
const { simulate } = require("debt-payoff-calculator");

const debts = [
  { name: "Card A", balance: 5000, apr: 22.9, min: 125 },
  { name: "Card B", balance: 1200, apr: 18.0, min: 35  },
  { name: "Loan",   balance: 8000, apr: 9.5,  min: 180 },
];

const result = simulate(debts, /* extra per month */ 200, "avalanche");
// => { months, interest, order: [names in payoff order], paid: true|false }
console.log(`Debt-free in ${result.months} months, $${result.interest} interest`);
```

### API

`simulate(debts, extra, strategy)`

- `debts` — `[{ name, balance, apr, min }]`
- `extra` — extra dollars/month on top of all minimums (number)
- `strategy` — `"snowball"` (smallest balance first) or `"avalanche"` (highest APR first)
- returns `{ months, interest, order, paid }`

The total monthly payment is held **fixed**: as each debt clears, its freed-up minimum
rolls onto the next priority debt (the "debt rollover" that makes both methods accelerate).

## Snowball vs avalanche

- **Snowball** attacks the *smallest balance* first — fastest psychological wins.
- **Avalanche** attacks the *highest APR* first — mathematically the least interest.

The avalanche method never costs more interest than snowball (it's a checked invariant
in `test.js`). Snowball can be worth it for motivation; this tool lets you compare both.

## Test

```bash
npm test   # runs assert-based self-checks (payoff math, invariants, edge cases)
```

## More

This engine powers the free calculator above. If you want the full **debt-free budget
workbook** — a multi-tab Excel / Google Sheets file with the payoff plan, budget,
sinking funds, net-worth tracker and a 52-week challenge — it's linked from
https://comil27.github.io/.

## License

MIT
