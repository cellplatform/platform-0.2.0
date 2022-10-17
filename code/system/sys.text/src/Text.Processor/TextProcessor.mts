import { MarkdownProcessor as markdown } from './MarkdownProcessor.mjs';
import { t } from '../common/index.mjs';

/**
 * Namespace: Plugin Processing Content extracting metatadata.
 * Context: [unified.js] text AST processing.
 */
export const TextProcessor: t.TextProcessor = {
  markdown,
};
