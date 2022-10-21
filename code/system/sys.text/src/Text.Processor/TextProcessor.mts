import { t } from '../common.mjs';
import { MarkdownProcessor as markdown } from '../Markdown.Processor/index.mjs';

/**
 * Namespace: Plugin Processing Content extracting metatadata.
 * Context: [unified.js] text AST processing.
 */
export const TextProcessor: t.TextProcessor = {
  markdown,
};
