import { SKIP, visit } from 'unist-util-visit';

import { slug, t } from '../common/index.mjs';

import type { Node as AstNode } from 'unist';
import type { Root as MdRootNode, Code as MdCodeNode } from 'mdast';
import type { Root as HtmlRootNode, Element as HtmlElementNode, Text as HtmlTextNode } from 'hast';

/**
 * Tools for working with tripple-tick (```) code blocks within markdown.
 *
 *    ```<lang> <meta:type>
 *
 * Example:
 *
 *    ```yaml project:props
 *
 */
export const CodeBlock = {
  plugin: {
    markdown(onMatch: t.CodeMatch) {
      return (tree: MdRootNode) => {
        visit(tree, 'code', (node, i, parent) => {
          const replace: t.CodeMatchArgs['replace'] = (node) => CodeBlock.replace(node, parent, i);
          onMatch({ node, replace });
        });
      };
    },

    html(getBlocks: () => t.CodeBlock[]) {
      return (tree: HtmlRootNode) => {
        visit(tree, 'element', (el) => {
          const blocks = getBlocks();
          const block = CodeBlock.findBlock(el, blocks);
          if (block) CodeBlock.placeholder.mutateToFinalElement(el, block);
        });
      };
    },
  },

  replace(node: AstNode, parent: any, index?: number | null) {
    const i = index || -1;
    if (i < 0) return;
    if (typeof parent !== 'object') return;
    parent.children[i] = node;
    return [SKIP, i];
  },

  toObject(node: MdCodeNode) {
    return {
      id: `container.${slug()}`,
      lang: node.lang || '',
      type: node.meta || '',
      text: node.value,
    };
  },

  findBlock(el: HtmlElementNode, blocks: t.CodeBlock[]) {
    if (!CodeBlock.placeholder.isMatch(el)) return;
    const child = el.children[0] as HtmlTextNode;
    const id = child.value.replace(/^code\:/, '');
    return blocks.find((item) => item.id === id);
  },

  placeholder: {
    createPendingElement(id: string): HtmlElementNode {
      return {
        type: 'element',
        tagName: 'div',
        children: [{ type: 'text', value: `code:${id}` }],
      };
    },
    mutateToFinalElement(el: HtmlElementNode, block: t.CodeBlock) {
      const props = el.properties || (el.properties = {});
      props['id'] = block.id;
      props['data-lang'] = block.lang;
      props['data-type'] = block.type;
      el.children = [];
      return el;
    },
    isMatch(el: HtmlElementNode) {
      if (!(el.type === 'element' && el.tagName === 'div')) return false;
      if (el.children[0].type !== 'text') return false;
      if (!el.children[0].value.startsWith('code:')) return false;
      return true;
    },
  },
};
