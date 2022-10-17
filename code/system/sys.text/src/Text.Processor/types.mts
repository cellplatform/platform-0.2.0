import * as t from '../common/types.mjs';

/**
 * Root index for text processing tools.
 */
export type TextProcessor = {
  markdown(options?: t.MarkdownOptions): t.MarkdownProcessor;
};
