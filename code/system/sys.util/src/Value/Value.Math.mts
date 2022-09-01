/**
 * Rounds to the given precision
 */
export function round(value: number, precision = 0) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
