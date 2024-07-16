import { visit } from 'unist-util-visit';
import { CONTINUATION, isContinuation, type t } from './common';

/**
 * Tools for manipulating an HTML (H-AST) tree.
 */
export const Hast = {
  optionPlugin(options: t.HtmlOptions = {}) {
    return (tree: t.HastRoot) => {
      const fn = options?.hast;
      fn?.({
        /**
         * Basic reveal of the root tree.
         *    Use this with standard unified.js tools
         *    (like 'unist-util-visit') like you would within a plugin.
         */
        tree: (fn) => fn(tree),

        /**
         * Helper for running a 'unist-util-visit' across the HTML tree
         * with a modified set of helper tools.
         */
        visit(fn) {
          visit(tree, (node, i, parent) => {
            const e: t.MutateHastVisitorArgs = {
              ...CONTINUATION,
              index: i === undefined ? -1 : i,
              node,
              parent: parent || null,

              data<T>() {
                const data = e.node.data || (e.node.data = {});
                return data as T;
              },
            };

            const res = fn(e);
            return isContinuation(res) ? res : undefined;
          });
        },
      });
    };
  },
};
