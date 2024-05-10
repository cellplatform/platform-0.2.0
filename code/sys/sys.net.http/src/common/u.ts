import { Value } from './libs';

/**
 * Determine if the HTTP status code is OK (200).
 */
export function statusOK(input: number | Response) {
  const status = typeof input === 'number' ? input : input.status;
  return (status || 0).toString().startsWith('2');
}

/**
 * Generate a random port.
 */
export const randomPort = () => {
  const random = (min = 0, max = 9) => Value.random(min, max);
  return Value.toNumber(`${random(6, 9)}${random()}${random()}${random()}`);
};

/**
 * Convert a [Blob] into a [Uint8Array].
 */
export async function toUint8Array(data: Blob) {
  return new Uint8Array(await data.arrayBuffer());
}
