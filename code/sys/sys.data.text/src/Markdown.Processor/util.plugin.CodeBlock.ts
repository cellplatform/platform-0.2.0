import { SKIP, visit } from 'unist-util-visit';
import { slug, type t } from './common';

/**
 * Tools for working with tripple-tick (```) code blocks within markdown.
 *
 *    ```<lang> <meta:type>
 *
 * Example (typed):
 *
 *    ```yaml project:props
 *
 * Example (untyped):
 *
 *    ```ts
 *
 */
export const CodeBlock = {
  plugin: {
    markdown(options: { onMatch?: t.CodeMatch } = {}) {
      return (tree: t.MdastRoot) => {
        const { onMatch } = options;
        visit(tree, 'code', (node, i, parent) => {
          onMatch?.({
            node,
            replace: (node) => CodeBlock.replace(node, parent, i),
          });
        });
      };
    },

    html(options: { getBlocks?: () => t.CodeBlock[] } = {}) {
      return (tree: t.HastRoot) => {
        const { getBlocks } = options;
        visit(tree, 'element', (el) => {
          /**
           * - Find the adjusted MD element placeholder.
           * - Mutate into the final shape of the HTML element (updating ID attributes etc).
           */
          if (getBlocks) {
            const blocks = getBlocks().filter((block) => Boolean(block.type));
            const block = CodeBlock.findBlock(el, blocks);
            if (block) CodeBlock.placeholder.mutateToFinalElement(el, block);
          }
        });
      };
    },
  },

  replace(node: t.AstNode, parent: any, index?: number | null) {
    const i = index || -1;
    if (i < 0) return;
    if (typeof parent !== 'object') return;
    parent.children[i] = node;
    return [SKIP, i];
  },

  toObject(node: t.MdastCode) {
    return {
      id: `container.${slug()}`,
      lang: node.lang || '',
      type: node.meta || '',
      text: node.value,
    };
  },

  findBlock(el: t.HastElement, blocks: t.CodeBlock[]) {
    if (!CodeBlock.placeholder.isMatch(el)) return;
    const child = el.children[0] as t.HastText;
    const id = child.value.replace(/^code\:/, '');
    return blocks.find((item) => item.id === id);
  },

  placeholder: {
    createPendingElement(id: string): t.HastElement {
      return {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [{ type: 'text', value: `code:${id}` }],
      };
    },
    mutateToFinalElement(el: t.HastElement, block: t.CodeBlock) {
      const props = el.properties || (el.properties = {});
      props['id'] = block.id;
      props['data-lang'] = block.lang;
      props['data-type'] = block.type;
      el.children = [];
      return el;
    },
    isMatch(el: t.HastElement) {
      if (!(el.type === 'element' && el.tagName === 'div')) return false;
      if (el.children[0].type !== 'text') return false;
      if (!el.children[0].value.startsWith('code:')) return false;
      return true;
    },
  },
};
