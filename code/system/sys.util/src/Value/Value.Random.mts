import { Is } from '../Is';

/**
 * NOTE: [Shim/Polyfill]
 *    Required when running on node-js.
 *    Prevents environment error within module 'nonoid':
 *
 *        ReferenceError: "crypto is not defined"
 *
 * IMPORTANT:
 *    Do NOT rely on this being secure in it's generation
 *    if random numbers when running on node-js.
 *
 */
if (Is.env.nodejs && !(global as any).crypto?.getRandomValues) {
  (global as any).crypto = {
    getRandomValues(buffer: Uint8Array) {
      const length = buffer.length;
      const values = Array.from({ length }).map(() => random(1000, 999999));
      return new Uint8Array(values);
    },
  };
}

/**
 * Generates a random number.
 */
export function random(min = 0, max?: number): number {
  if (max === undefined) max = min + 999999;
  return Math.floor(Math.random() * (max - min + 1) + min);
}
