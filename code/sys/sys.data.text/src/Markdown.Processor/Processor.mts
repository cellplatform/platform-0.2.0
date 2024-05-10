import { t, trimToPosition } from './common.mjs';
import { Pipeline } from './util.Pipeline.mjs';

/**
 * Markdown transformer.
 */

export const MarkdownProcessor: t.MarkdownProcessorFactory = (options = {}) => {
  const base = options;
  return {
    /**
     * Process markdown only, but do not convert to HTML.
     */
    async toMarkdown(input, options = {}) {
      const builder = Pipeline.compose('md:only', { ...base, ...options });
      const text = Format.input(input);
      await builder.pipeline.process(text);
      const markdown = Format.text(text);
      const info = builder.info.markdown;
      const { mdast } = info;
      const res: t.ProcessedMdast = {
        info,
        markdown,
        mdast,
        toString(position) {
          return trimToPosition(markdown, position);
        },
      };

      return res;
    },

    /**
     * Convert from Markdown to Html
     */
    async toHtml(input, options = {}) {
      const builder = Pipeline.compose('md > html', { ...base, ...options });
      const text = Format.input(input);
      const vfile = await builder.pipeline.process(text);
      const html = Format.text(vfile?.toString());
      const markdown = Format.text(text);
      const info = builder.info.html;
      const { mdast, hast } = info;
      const res: t.ProcessedHast = {
        info,
        html,
        markdown,
        mdast,
        hast,
        toString(position) {
          return trimToPosition(markdown, position);
        },
      };

      return res;
    },
  };
};

/**
 * Helpers
 */

const Format = {
  input(input: t.MarkdownInput): string {
    if (typeof input === 'string') return input;
    if (input instanceof Uint8Array) return new TextDecoder().decode(input);
    return '';
  },

  text(text: string = ''): string {
    const res = text.replace(/^\n/, '').replace(/\n$/, '');
    return res === text ? res : Format.text(res); // 🌳 <== RECURSION (ensure all \n chars are stripped)
  },
};
