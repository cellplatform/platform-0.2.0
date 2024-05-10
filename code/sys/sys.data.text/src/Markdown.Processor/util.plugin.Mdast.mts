import { visit } from 'unist-util-visit';
import { CONTINUATION, isContinuation, t, Is } from './common.mjs';

/**
 * Tools for manipulating an MARKDOWN (MD-AST) tree.
 */
export const Mdast = {
  optionPlugin(options: t.MarkdownProcessorOptions = {}) {
    const { externalLinksInNewTab = true } = options;

    return (tree: t.MdastRoot) => {
      const mutate: t.MutateMdast = {
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
              index: i === undefined ? -1 : i,
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
      };

      /**
       * Option: ensure external links open in new tab.
       */
      if (externalLinksInNewTab === true) {
        mutate.visit((e) => {
          if (e.node.type === 'link') {
            let url = e.node.url || ''.trim();

            if (Is.email(url)) {
              e.node.url = url = `mailto:${url}`;
            }

            if (Link.isExternal(url) || Link.isMailTo(url)) {
              type T = { target?: '_blank'; rel?: 'noopener' };
              const props = e.hProperties<T>();
              props.target = '_blank';
              props.rel = 'noopener'; // NB: Security - https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/noopener
            }
          }
        });
      }

      /**
       * Invoke the callback handler (if present).
       */
      const fn = options?.mdast;
      fn?.(mutate);
    };
  },
};

/**
 * [Helpers]
 */

const Link = {
  isExternal(url: string) {
    const link = (url || '').trim();
    return link.startsWith('https://') || link.startsWith('http://');
  },

  isMailTo(url: string) {
    const link = (url || '').trim();
    return link.startsWith('mailto:');
  },
};
