const test = require("node:test");
const assert = require("node:assert");
const { cartTotal } = require("../src/cart");

test("no discount leaves the total unchanged", () => {
  assert.strictEqual(cartTotal(1000), 1000);
});

test("10% discount on Rs 1,000 gives Rs 900", () => {
  assert.strictEqual(cartTotal(1000, 10), 900);
});

test("result is rounded to the nearest paisa", () => {
  assert.strictEqual(cartTotal(999.99, 10), 899.99);
});

test("negative amounts are rejected", () => {
  assert.throws(() => cartTotal(-5, 10), RangeError);
});

test("discounts above 100% are rejected", () => {
  assert.throws(() => cartTotal(1000, 150), RangeError);
});
