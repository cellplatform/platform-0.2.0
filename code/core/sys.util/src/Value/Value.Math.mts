/**
 * Rounds to the given precision
 */
export function round(value: number, precision = 0) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Generates a random number.
 */
export function random(min = 0, max?: number): number {
  if (max === undefined) {
    max = min + 999;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}
