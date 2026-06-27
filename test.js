const assert = require("assert");
const { simulate } = require("./index");

// 1. single 0% debt: $1000, $100/mo, no extra -> exactly 10 months, $0 interest
let r = simulate([{ name: "A", balance: 1000, apr: 0, min: 100 }], 0, "snowball");
assert.strictEqual(r.months, 10); assert.strictEqual(r.interest, 0); assert(r.paid);

// 2. avalanche never costs more interest than snowball when they diverge
const debts = [
  { name: "HiAPR", balance: 1000, apr: 25, min: 25 },
  { name: "LoAPR", balance: 500, apr: 5, min: 25 },
];
const snow = simulate(debts, 100, "snowball");
const aval = simulate(debts, 100, "avalanche");
assert(snow.order[0] === "LoAPR" && aval.order[0] === "HiAPR", "strategies must diverge here");
assert(aval.interest <= snow.interest + 1e-6, "avalanche should not cost more interest");

// 3. more extra never makes payoff slower
const less = simulate(debts, 50, "avalanche");
const more = simulate(debts, 250, "avalanche");
assert(more.months <= less.months, "more extra -> not slower");

// 4. minimums below interest never finish -> paid:false, flagged not crashed
const stuck = simulate([{ name: "Z", balance: 5000, apr: 30, min: 10 }], 0, "snowball");
assert(stuck.paid === false && stuck.months === 600);

console.log("self-check OK");
