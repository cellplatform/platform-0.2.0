import { visit } from 'unist-util-visit';
import { CONTINUATION, isContinuation, t } from './common.mjs';

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
         *    (like 'unist-util-visit') like you would within a plugin.
         */
        tree: (fn) => fn(tree),

        /**
         * Helper for running a 'unist-util-visit' across the MARKDOWN tree
         * with a set of helper tools passed in as arguments.
         */
        visit(fn) {
          visit(tree, (node, i, parent) => {
            const e: t.MutateMdastVisitorArgs = {
              ...CONTINUATION,
              index: i === null ? -1 : i,
              node: node as t.MdastNode,
              parent: parent as t.MdastNode,

              data<T>() {
                const data = e.node.data || (e.node.data = {});
                return data as T;
              },

              hProperties<T>() {
                const data = e.data<{ hProperties: T }>();
                const props = data.hProperties || (data.hProperties = {} as T);
                return props;
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
