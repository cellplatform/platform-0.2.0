/**
 * Chunked comparison of two [Uint8Array]'s.
 */
export function eql(a: Uint8Array, b: Uint8Array, chunkSize: number = 1024): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i += chunkSize) {
    const aChunk = a.subarray(i, i + chunkSize);
    const bChunk = b.subarray(i, i + chunkSize);
    if (!aChunk.every((value, index) => value === bChunk[index])) return false;
  }

  return true;
}
