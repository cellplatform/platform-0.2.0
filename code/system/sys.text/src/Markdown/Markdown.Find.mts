import { CONTINUE, EXIT, visit } from 'unist-util-visit';
import { type t } from '../common';

/**
 * Flags for looking at markdown.
 */
export const MarkdownFind: t.MarkdownFind = {
  /**
   * Determine if the given node is or contains an image.
   * Markdown: "![name](https://path)"
   * NOTE:
   *    Test is useful because images are normally embedded within root <p> tags
   */
  image(within) {
    if (!within) return;
    let _res: t.MdastImage | undefined;
    visit(within, (e) => {
      if (e.type !== 'image') return CONTINUE;
      _res = e;
      return EXIT;
    });
    return _res;
  },
};
