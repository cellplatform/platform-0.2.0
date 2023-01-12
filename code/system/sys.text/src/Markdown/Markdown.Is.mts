import { is as node } from 'unist-util-is';

import { type t } from '../common';
import { MarkdownFind as Find } from './Markdown.Find.mjs';

/**
 * Flags for looking at markdown.
 */
export const MarkdownIs: t.MarkdownIs = {
  /**
   * Check if node passes a test.
   * Ref:
   *    https://github.com/syntax-tree/unist-util-is#isnode-test-index-parent-context
   */
  node,

  /**
   * Determine if the given node is or contains an image.
   * Markdown: "![name](https://path)"
   * NOTE:
   *    Test is useful because images are normally embedded within root <p> tags
   */
  image(node) {
    return Boolean(Find.image(node));
  },
};
