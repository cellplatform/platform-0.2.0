import { Hash } from '../common';

/**
 * Generate a Uint8Array containing random data.
 */
export function randomFile(length = 10) {
  const data = crypto.getRandomValues(new Uint8Array(length));
  const hash = Hash.sha256(data);
  const bytes = data.byteLength;
  return { data, hash, bytes };
}
