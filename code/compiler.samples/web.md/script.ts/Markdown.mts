// import format from 'rehype-format';
// import html from 'rehype-stringify';
// import rehypeSanitize from 'rehype-sanitize';
// import markdown from 'remark-parse';
// import remark2rehype from 'remark-rehype';
// import { unified, Processor } from 'unified';

// import {read} from 'to-vfile'

import { inspect } from 'util';
import { NodeFs } from 'sys.fs.node';

import { unified, Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';

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
 *
 */
async function main() {
  const p = NodeFs.resolve('./script.ts/example.md');
  console.log('p', p);

  const markdown = (await NodeFs.readFile(p)).toString();
  console.log('markdown:', markdown);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter, ['yaml', 'toml'])
    .use(remarkStringify)
    .use(() => (tree: any) => {
      console.dir(tree, { depth: 10 });
    })
    .process(markdown);

  console.log('-------------------------------------------');
  console.log(String(file));
}

/**
 * See:
 *   - https://github.com/remarkjs/remark-rehype
 */
export const MarkdownProcessor = {
  toHtml,
  toHtmlSync,

  // TEMP 🐷
  async tmp(markdown: string = '') {
    await main();
  },
};

/**
 * Helpers
 */

const Util = {
  get processor(): Processor {
    if (!_processor) {
      // _processor = unified().use(markdown).use(remark2rehype).use(format).use(html);
      _processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkFrontmatter, ['yaml', 'toml'])
        .use(rehypeSanitize)
        .use(remarkStringify)
        .use(() => (tree: any) => {
          console.dir(tree, {});
        });
    }
    return _processor;
  },

  formatHtml(input: string) {
    return input.replace(/^\n/, '').replace(/\n$/, '');
  },
};
