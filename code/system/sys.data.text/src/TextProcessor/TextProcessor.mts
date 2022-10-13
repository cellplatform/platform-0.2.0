import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFileCompatible } from 'vfile';

import { t } from '../common/index.mjs';
import { CodeBlock } from './CodeBlock.mjs';

/**
 * Namespace: Plugin Processing Content extracting metatadata.
 * Context: [unified.js] text AST processing.
 */
export const TextProcessor = {
  /**
   * Markdown transformer.
   */
  async markdown(input: VFileCompatible) {
    const codeblocks: t.CodeBlock[] = [];

    const handleCodeBlockMatch: t.CodeMatch = (e) => {
      if (e.node.meta) {
        const def = CodeBlock.toObject(e.node);
        e.replace(CodeBlock.placeholder.createPendingElement(def.id)); // HACK: Pending <div> contains the ID and is finalised within [rehype] as ID is not being passed through HTML conversion.
        codeblocks.push(def);
      }
    };

    const pipeline = unified()
      .use(remarkParse)
      .use(CodeBlock.plugin.markdown, handleCodeBlockMatch)
      .use(remarkToRehype)
      .use(rehypeFormat)
      .use(CodeBlock.plugin.html, () => codeblocks)
      .use(rehypeStringify);

    const vfile = await pipeline.process(input);

    return {
      get info() {
        return {
          code: [...codeblocks],
        };
      },

      get html() {
        return vfile?.toString() || '';
      },
    };
  },
};
