import { VFileCompatible } from 'vfile';

import { t } from '../common/index.mjs';
import { MarkdownPipelineBuilder } from './util.PipelineBuilder.mjs';

/**
 * Markdown transformer.
 */
export function MarkdownProcessor(options: t.MarkdownOptions = {}): t.MarkdownProcessor {
  const base = options;
  return {
    /**
     * Convert from Markdown to Html
     */
    async html(input: VFileCompatible, options: t.HtmlOptions = {}) {
      const builder = MarkdownPipelineBuilder('md > html', { ...base, ...options });
      const vfile = await builder.pipeline.process(input);
      const text = formatText(vfile?.toString());
      const info = builder.info;
      return { text, info };
    },

    /**
     * Process markdown only, but do not convert to HTML.
     */
    async markdown(input: VFileCompatible, options: t.MarkdownOptions = {}) {
      const builder = MarkdownPipelineBuilder('md:only', { ...base, ...options });
      const vfile = await builder.pipeline.process(input);
      const text = formatText(vfile?.toString());
      const info = builder.info;
      return { text, info };
    },
  };
}

/**
 * Helpers
 */

function formatText(text: string = '') {
  if (text.startsWith('\n')) text = text.substring(1);
  if (text.endsWith('\n')) text = text.substring(0, text.length - 1);
  return text;
}
