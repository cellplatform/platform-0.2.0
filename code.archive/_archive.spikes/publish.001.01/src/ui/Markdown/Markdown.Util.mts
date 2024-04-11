import { MarkdownFind as find } from './Markdown.Util.Find.mjs';

export const MarkdownUtil = {
  find,

  /**
   * Ensure the given string ends in a `\n` character.
   */
  ensureTrailingNewline(input: string) {
    input = input || '';
    if (input[input.length - 1] !== '\n') input = `${input}\n`;
    return input;
  },
};
