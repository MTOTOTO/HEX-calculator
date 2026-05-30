/**
 * Accepts a hex string and returns true if it is 1–2 valid hex digits.
 */
export function validateInput(val) {
  return /^[0-9A-Fa-f]{1,2}$/.test(val);
}

/**
 * Accepts a hex string and returns true if it fits within 4 hex digits (0000–FFFF).
 */
export function validateOutput(val) {
  return /^[0-9A-Fa-f]{1,4}$/.test(val);
}

function toHex(n) {
  if (n < 0) n = 0;
  if (n > 0xffff) n = 0xffff;
  return n.toString(16).toUpperCase().padStart(4, '0');
}

export function hexAdd(a, b) {
  return toHex(parseInt(a, 16) + parseInt(b, 16));
}

export function hexSubtract(a, b) {
  return toHex(parseInt(a, 16) - parseInt(b, 16));
}

export function hexMultiply(a, b) {
  return toHex(parseInt(a, 16) * parseInt(b, 16));
}

export function hexDivide(a, b) {
  const divisor = parseInt(b, 16);
  if (divisor === 0) throw new Error('Division by zero');
  return toHex(Math.floor(parseInt(a, 16) / divisor));
}
