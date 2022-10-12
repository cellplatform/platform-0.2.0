import { unified, Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

import remarkToRehype from 'remark-rehype';

import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';

/**
 * Converts the given markdown to HTML asynchronously.
 */
export async function toHtml(markdown: string = ''): Promise<string> {
  const res = await Util.pipeline.cached.process(markdown);
  return Util.formatHtml(res.toString());
}

/**
 * Converts the given markdown to HTML synchronously.
 */
export function toHtmlSync(markdown: string = ''): string {
  const res = Util.pipeline.cached.processSync(markdown);
  return Util.formatHtml(res.toString());
}

/**
 * Helpers
 */

let _pipeline: Processor | undefined; // Lazily initialized singleton.
export const Util = {
  pipeline: {
    create() {
      return unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkToRehype)
        .use(rehypeFormat)
        .use(rehypeStringify);
    },

    get cached(): Processor {
      if (!_pipeline) _pipeline = Util.pipeline.create();
      return _pipeline;
    },
  },

  formatHtml(input: string) {
    return input.replace(/^\n/, '').replace(/\n$/, '');
  },
};
