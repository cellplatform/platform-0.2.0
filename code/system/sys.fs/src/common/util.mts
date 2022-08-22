import * as t from './types.mjs';

/**
 * Standard JSON stringify format.
 */
export function stringify(input: t.Json) {
  return `${JSON.stringify(input, null, '  ')}\n`;
}
