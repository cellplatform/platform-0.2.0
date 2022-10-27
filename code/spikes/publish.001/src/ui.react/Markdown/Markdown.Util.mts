import { Fetch } from '../Fetch.mjs';
import { MarkdownFind as find } from './Markdown.Util.Find.mjs';

export const MarkdownUtil = {
  find,

  /**
   * Language Parser/Transformations.
   */
  async parseMarkdown(input: string = '') {
    const processor = await fetchTextProcessor();
    const { info, markdown } = await processor.toMarkdown(input);
    return { info, markdown };
  },

  async parseHtml(input: string = '') {
    const processor = await fetchTextProcessor();
    const { info, markdown, html } = await processor.toHtml(input);
    return { info, markdown, html };
  },

  /**
   * Ensure the given string ends in a `\n` character.
   */
  ensureTrailingNewline(input: string) {
    input = input || '';
    if (input[input.length - 1] !== '\n') input = `${input}\n`;
    return input;
  },
};

/**
 * Helpers
 */

async function fetchTextProcessor() {
  const Text = await Fetch.module.Text(); // <== NB: Code Splitting
  const processor = Text.Processor.markdown();
  return processor;
}
