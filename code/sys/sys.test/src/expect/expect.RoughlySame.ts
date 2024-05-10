import { type t } from '../common';
import { expect } from './expect';

/**
 * Determines if two numbers are approximately equal within a specified tolerance.
 */
export function areRoughlySame(
  left: number | undefined,
  right: number | undefined,
  tolerance: t.Percent,
): boolean {
  if (typeof left !== 'number') throw new Error('The left number was undefined');
  if (typeof right !== 'number') throw new Error('The right number was undefined');
  const average = (left + right) / 2;
  const difference = Math.abs(left - right);
  const allowedDifference = average * tolerance;
  return difference <= allowedDifference;
}

/**
 * Asserts that two numbers are approximately equal within a specified tolerance.
 * Throws an error with a custom message if the assertion fails.
 */
export function expectRoughlySame(
  left: number | undefined,
  right: number | undefined,
  tolerance: t.Percent,
  message?: string,
) {
  const res = areRoughlySame(left, right, tolerance);
  const within = `within ${tolerance * 100}%`;
  const suffix = `should be roughly the same numbers ${left}, ${right} (${within})`;
  let msg = `${message ?? ''} - ${suffix}`;
  expect(res).to.eql(true, msg);
}
