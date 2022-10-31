import { t } from './common.mjs';

/**
 * Tools for manipulating an MARKDOWN (MD-AST) tree.
 */
export const Mdast = {
  optionPlugin(options?: t.MarkdownOptions) {
    return (tree: t.MdastRoot) => {
      const fn = options?.mdast;
      fn?.({
        /**
         * Basic reveal of the root tree.
         *    Use this with standard unified.js tools
         *    (like 'unist-util-visit') like you would in a plugin.
         */
        tree: (fn) => fn(tree),

        /**
         * Helper for running a 'unist-util-visit' across the MARKDOWN tree
         * with a set of helper tools passed in as arguments.
         */
        visit(fn) {
          /**
           * TODO 🐷
           */
        },
      });
    };
  },
};
