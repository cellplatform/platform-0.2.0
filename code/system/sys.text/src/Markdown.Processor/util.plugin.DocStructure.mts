import { SKIP, visit } from 'unist-util-visit';

import type { Node as AstNode } from 'unist';
import type { Root as MdRootNode, Code as MdCodeNode } from 'mdast';
import type { Root as HtmlRootNode, Element as HtmlElementNode, Text as HtmlTextNode } from 'hast';

/**
 * Tools for extracting and working with "Documet Structure", eg:
 *
 *    - Header
 *      - Section
 *        - List(s)
 *
 */
export const DocStructure = {
  plugin() {
    return (tree: MdRootNode) => {
      console.log('DocStructure::/tree', tree);
      console.log('-------------------------------------------');

      visit(tree, (node, i, parent) => {
        console.log('DocStructure::/node', node);
      });
    };
  },
};
