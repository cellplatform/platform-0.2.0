import { t } from '../common.mjs';
import { Fetch } from '../Fetch.mjs';

export const MarkdownUtil = {
  /**
   * Code-Split
   */
  async parseMarkdown(input: string) {
    const Text = await Fetch.module.Text(); // <== NB: Code Splitting
    const transform = Text.Processor.markdown();
    const { info, markdown } = await transform.toMarkdown(input);
    const { ast } = info;
    return { info, markdown, ast };
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
