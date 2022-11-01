import { Fetch } from '../common.mjs';
import { MarkdownFind as find } from './Markdown.Util.Find.mjs';

export const MarkdownUtil = {
  find,

  /**
   * Language Parser/Transformations.
   */
  async parseMarkdown(input: string = '') {
    const processor = await MarkdownUtil.markdownProcessor();
    const { info, markdown } = await processor.toMarkdown(input);
    return { info, markdown };
  },

  async parseHtml(input: string = '') {
    const processor = await MarkdownUtil.markdownProcessor();
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

  /**
   * Pull the [Text] module and initialize a new markdown processor.
   */
  async markdownProcessor() {
    const Text = await Fetch.module.Text(); // <== NB: Dynamic module load | (Code Split) 🌳
    return Text.Processor.markdown();
  },
};
