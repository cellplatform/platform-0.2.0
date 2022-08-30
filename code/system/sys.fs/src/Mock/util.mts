import { Hash } from '../common/index.mjs';

/**
 * Generate a Uint8Array containing random data.
 */
export function randomFile(length = 10) {
  const data = crypto.getRandomValues(new Uint8Array(length));
  const hash = Hash.sha256(data);
  return { data, hash };
}
