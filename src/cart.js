// Cart calculations for ShopEasy Lite.
// Amounts are in rupees; results are rounded to the nearest paisa (2 decimal places).

function cartTotal(amount, discountPercent = 0) {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
    throw new RangeError("amount must be a non-negative number");
  }
  if (typeof discountPercent !== "number" || discountPercent < 0 || discountPercent > 100) {
    throw new RangeError("discountPercent must be between 0 and 100");
  }
  return Math.round(amount * (100 - discountPercent)) / 100;
}

module.exports = { cartTotal };
