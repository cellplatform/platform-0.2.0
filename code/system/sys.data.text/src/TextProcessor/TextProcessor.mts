import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { VFileCompatible } from 'vfile';

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
  async markdown(input: VFileCompatible) {
    const codeblocks: CodeBlock[] = [];

    const extractMetaCodeBlocks: CodeMatch = (e) => {
      if (e.node.meta) codeblocks.push(CodeBlock.toObject(e.node));
    };

    const pipeline = unified()
      .use(remarkParse)
      .use(CodeBlock.plugin, extractMetaCodeBlocks)
      .use(remarkStringify);

    const vfile = await pipeline.process(input);

    return {
      get info() {
        return { codeblocks: [...codeblocks] };
      },

      get markdown() {
        return vfile?.toString() || '';
      },

      async toHtml() {
        let index = 0;

        const onCodeBlock: CodeMatch = (e) => {
          if (e.node.meta) {
            const item = codeblocks[index];
            if (item) {
              const div = CodeBlock.placeholder.createPendingElement(item.id);
              e.replace(div);
            }
            index++;
          }
        };

        function codeBlocksToPlaceholders() {
          return (tree: HtmlRootNode) => {
            visit(tree, 'element', (el) => {
              const block = CodeBlock.placeholder.findBlock(el, codeblocks);
              if (block) CodeBlock.placeholder.mutateToFinalElement(el, block);
            });
          };
        }

        const pipeline = unified()
          .use(remarkParse)
          .use(CodeBlock.plugin, onCodeBlock)
          .use(remarkToRehype)
          .use(rehypeFormat)
          .use(codeBlocksToPlaceholders)
          .use(rehypeStringify);

        return (await pipeline.process(vfile)).toString();
      },
    };
  },
};
