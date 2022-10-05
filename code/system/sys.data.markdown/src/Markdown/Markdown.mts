import { toHtml, toHtmlSync } from '../Markdown.Processor/index.mjs';
import { MarkdownUI as UI } from '../Markdown.UI/index.mjs';

/**
 * See:
 *   - https://github.com/remarkjs/remark-rehype
 */
export const Markdown = {
  toHtml,
  toHtmlSync,
  UI,
};
