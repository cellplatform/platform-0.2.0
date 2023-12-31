import { type t } from '../common';
import { expect } from './expect';

/**
 * Determines if two numbers are approximately equal within a specified tolerance.
 */
export function areRoughlySame(left: number, right: number, tolerance: t.Percent): boolean {
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
  left: number,
  right: number,
  tolerance: t.Percent,
  message?: string,
) {
  const res = areRoughlySame(left, right, tolerance);
  expect(res).to.eql(true, message);
}
