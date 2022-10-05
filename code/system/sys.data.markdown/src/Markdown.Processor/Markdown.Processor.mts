import { unified, Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';

import rehypeSanitize from 'rehype-sanitize';

let _processor: Processor | undefined; // Lazily initialized singleton.

/**
 * Converts the given markdown to HTML asynchronously.
 */
export async function toHtml(markdown?: string): Promise<string> {
  const res = await Util.processor.process(markdown ?? '');
  return Util.formatHtml(res.toString());
}

/**
 * Converts the given markdown to HTML synchronously.
 */
export function toHtmlSync(markdown?: string): string {
  const res = Util.processor.processSync(markdown ?? '');
  return Util.formatHtml(res.toString());
}

/**
 * See:
 *   - https://github.com/remarkjs/remark-rehype
 */
export const MarkdownProcessor = {
  toHtml,
  toHtmlSync,
};

/**
 * Helpers
 */

const Util = {
  get processor(): Processor {
    if (!_processor) {
      _processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkFrontmatter, ['yaml', 'toml'])
        // .use(rehypeSanitize)
        .use(remarkStringify);
    }
    return _processor;
  },

  formatHtml(input: string) {
    return input.replace(/^\n/, '').replace(/\n$/, '');
  },
};
