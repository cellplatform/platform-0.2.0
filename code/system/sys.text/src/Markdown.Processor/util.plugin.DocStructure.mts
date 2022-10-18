import { t } from './common.mjs';

/**
 * Tools for extracting and working with "Documet Structure", eg:
 *
 *    - Header
 *      - Section
 *        - List(s)
 *
 */
export const DocStructure = {
  /**
   * Simple plugin that provides the root AST tree of the
   * markdown document when parsed via a callback.
   */
  plugin(options: { onParse?: (e: { tree: t.MdastRoot }) => void } = {}) {
    return (tree: t.MdastRoot) => options.onParse?.({ tree });
  },
};
