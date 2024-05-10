import type { t } from '../common';

/**
 * Root index for text processing tools.
 */
export type TextProcessor = {
  markdown(options?: t.MarkdownProcessorOptions): t.MarkdownProcessor;
};
