import * as t from './types.mjs';

/**
 * Substring into portion of a string based on the given Unified.js AST postiion.
 */
export function trimToPosition(text: string, position?: t.AstPosition) {
  return position ? text.substring(position.start.offset ?? 0, position.end.offset) ?? '' : text;
}
