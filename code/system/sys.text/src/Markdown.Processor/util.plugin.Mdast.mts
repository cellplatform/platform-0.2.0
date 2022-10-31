import { t } from './common.mjs';

/**
 * Tools for manipulating an MARKDOWN (MD-AST) tree.
 */
export const Mdast = {
  optionPlugin(options?: t.MarkdownOptions) {
    return (tree: t.MdastRoot) => {
      const fn = options?.mdast;
      fn?.({
        tree: (fn) => fn(tree),
      });
    };
  },
};
