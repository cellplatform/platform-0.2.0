import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { VFileCompatible } from 'vfile';
import { CodeBlock } from './CodeBlock.mjs';

import type { Code as MdCodeNode } from 'mdast';
import type { Root as HtmlRootNode, Element as HtmlElementNode } from 'hast';

type CodeBlock = {
  id: string;
  lang: string;
  type: string;
  text: string;
};

type CodeMatch = (e: CodeMatchArgs) => void;
type CodeMatchArgs = { node: MdCodeNode; replace(value: HtmlElementNode): void };

/**
 * Namespace: Plugin Processing Content extracting metatadata.
 * Context: [unified.js] text AST processing.
 */
export const TextProcessor = {
  markdown() {
    const api = {
      async run(input: VFileCompatible) {
        const blocks: CodeBlock[] = [];

        const extractMetaCodeBlocks: CodeMatch = (e) => {
          if (e.node.meta) {
            blocks.push(CodeBlock.toObject(e.node));
          }
        };

        const pipeline = unified()
          .use(remarkParse)
          .use(CodeBlock.plugin, extractMetaCodeBlocks)
          .use(remarkStringify);

        const vfile = await pipeline.process(input);

        return {
          get info() {
            return { metablocks: [...blocks] };
          },

          get markdown() {
            return vfile?.toString() || '';
          },

          toObject: () => ({ vfile }),
          toString: () => vfile?.toString(),

          async toHtml() {
            let index = 0;
            const onCodeBlock: CodeMatch = (e) => {
              if (e.node.meta) {
                const item = blocks[index];
                if (item) {
                  const div = CodeBlock.placeholder.createPendingElement(item.id);
                  e.replace(div);
                }
                index++;
              }
            };

            function convertBlocksToDivPlaceholder() {
              return (tree: HtmlRootNode) => {
                visit(tree, 'element', (el) => {
                  const block = CodeBlock.placeholder.findBlock(el, blocks);
                  if (block) {
                    CodeBlock.placeholder.mutateToFinalElement(el, block);
                  }
                });
              };
            }

            const pipeline = unified()
              .use(remarkParse)
              .use(CodeBlock.plugin, onCodeBlock)
              .use(remarkToRehype)
              .use(rehypeFormat)
              .use(convertBlocksToDivPlaceholder)
              .use(rehypeStringify);

            return (await pipeline.process(vfile)).toString();
          },
        };
      },
    };

    return api;
  },
};
