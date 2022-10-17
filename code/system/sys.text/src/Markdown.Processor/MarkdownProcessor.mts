import { t } from '../common/index.mjs';
import { MarkdownPipelineBuilder } from './util.PipelineBuilder.mjs';

/**
 * Markdown transformer.
 */
export function MarkdownProcessor(options: t.MarkdownOptions = {}): t.MarkdownProcessor {
  const base = options;
  return {
    /**
     * Process markdown only, but do not convert to HTML.
     */
    async toMarkdown(input: t.MarkdownString, options: t.MarkdownOptions = {}) {
      const builder = MarkdownPipelineBuilder('md:only', { ...base, ...options });
      const vfile = await builder.pipeline.process(input);
      const md = formatText(vfile?.toString());
      const info = builder.info;
      return {
        markdown: md,
        info,
        toString: () => md,
      };
    },

    /**
     * Convert from Markdown to Html
     */
    async toHtml(input: t.MarkdownString, options: t.HtmlOptions = {}) {
      const builder = MarkdownPipelineBuilder('md > html', { ...base, ...options });
      const vfile = await builder.pipeline.process(input);
      const html = formatText(vfile?.toString());
      const markdown = formatText(input);
      const info = builder.info;
      return {
        info,
        html,
        markdown,
        toString: () => html,
      };
    },
  };
}

/**
 * Helpers
 */

function formatText(text: string = ''): string {
  const res = text.replace(/^\n/, '').replace(/\n$/, '');
  return res === text ? res : formatText(res); // 🌳 <== RECURSION (ensure all \n chars are stripped)
}
