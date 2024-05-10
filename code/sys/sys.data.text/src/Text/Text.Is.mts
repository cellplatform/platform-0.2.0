import { type t } from '../common';
import { is as node } from 'unist-util-is';

/**
 * Flaggable "concepts" (boolean questions) arising from
 * an AST (abstract syntax tree).
 */
export const Is: t.TextIs = {
  /**
   * Check if node passes a test.
   * Ref:
   *    https://github.com/syntax-tree/unist-util-is#isnode-test-index-parent-context
   */
  node,
};
