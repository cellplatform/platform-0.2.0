import { t } from '../common.mjs';
import { Fetch } from '../Fetch.Util.mjs';

let _transform: t.MarkdownProcessor;

export const MarkdownUtil = {
  /**
   * Code-Split
   */
  async parseMarkdown(input: string) {
    if (!_transform) {
      const Text = await Fetch.module.Text(); // <== NB: Code Splitting
      _transform = Text.Processor.markdown();
    }
    const { info, markdown } = await _transform.toMarkdown(input);
    const { ast } = info;
    return { info, markdown, ast };
  },
};
