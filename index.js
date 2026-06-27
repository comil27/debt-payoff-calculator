// Debt-payoff engine — snowball (smallest balance first) vs avalanche (highest APR first).
// Total monthly payment is held FIXED; as each debt clears, its freed-up minimum rolls onto
// the top-priority remaining debt. Pure, deterministic, zero dependencies.
function simulate(debts, extra, strategy) {
  // debts: [{name,balance,apr,min}] · extra: number · strategy: "snowball" | "avalanche"
  // -> { months, interest, order:[names cleared, in order], paid:boolean }
  const d = debts
    .map(x => ({ name: x.name, bal: +x.balance || 0, apr: +x.apr || 0, min: +x.min || 0 }))
    .filter(x => x.bal > 0);
  if (!d.length) return { months: 0, interest: 0, order: [], paid: true };
  const rank = x => (strategy === "avalanche" ? -x.apr : x.bal); // lower rank attacked first
  const budget = d.reduce((s, x) => s + x.min, 0) + (+extra || 0); // fixed total payment
  let months = 0, interest = 0;
  const order = [];
  const MAX = 600; // 50-year guard against minimums that never beat interest
  while (d.some(x => x.bal > 0.005) && months < MAX) {
    months++;
    for (const x of d) {
      if (x.bal > 0) { const i = x.bal * (x.apr / 100 / 12); x.bal += i; interest += i; }
    }
    let left = budget;
    for (const x of d) { // minimums first (capped at balance; the cap rolls into `left`)
      if (x.bal > 0) { const pay = Math.min(x.min, x.bal); x.bal -= pay; left -= pay; }
    }
    if (left < 0) left = 0;
    const owed = d.filter(x => x.bal > 0.005).sort((a, b) => rank(a) - rank(b));
    for (const x of owed) { // funnel everything left onto the priority debt(s)
      if (left <= 0) break;
      const pay = Math.min(left, x.bal); x.bal -= pay; left -= pay;
    }
    for (const x of d) if (x.bal <= 0.005 && !order.includes(x.name)) order.push(x.name);
  }
  return { months, interest: Math.round(interest * 100) / 100, order, paid: d.every(x => x.bal <= 0.005) };
}

module.exports = { simulate };
