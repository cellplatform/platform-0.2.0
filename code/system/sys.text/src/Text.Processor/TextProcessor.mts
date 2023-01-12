import { type t } from '../common';
import { MarkdownProcessor as markdown } from '../Markdown.Processor';

/**
 * Namespace: Plugin Processing Content extracting metatadata.
 * Context: [unified.js] text AST processing.
 */
export const TextProcessor: t.TextProcessor = {
  markdown,
};
