import format from 'rehype-format';
import html from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified, { Processor } from 'unified';

/**
 * See:
 *   - https://github.com/remarkjs/remark-rehype
 */
export const MarkdownProcessor = {
  /**
   * Converts the given markdown to HTML asynchronously.
   */
  async toHtml(markdown?: string): Promise<string> {
    const res = await Util.processor.process(markdown ?? '');
    return Util.formatHtml(res.toString());
  },

  /**
   * Converts the given markdown to HTML synchronously.
   */
  toHtmlSync(markdown: string): string {
    const res = Util.processor.processSync(markdown ?? '');
    return Util.formatHtml(res.toString());
  },
};

/**
 * Helpers
 */
let _processor: Processor | undefined;
const Util = {
  get processor(): Processor {
    if (!_processor) _processor = unified().use(markdown).use(remark2rehype).use(format).use(html);
    return _processor;
  },

  formatHtml(input: string) {
    return input.replace(/^\n/, '').replace(/\n$/, '');
  },
};
