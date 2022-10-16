import rehypeFormat from 'rehype-format';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFileCompatible } from 'vfile';

import { t } from '../common/index.mjs';
import { CodeBlock } from './MD.CodeBlock.mjs';

import type { Schema } from 'hast-util-sanitize';
type MarkdownConvertOptions = {
  gfm?: boolean;
};

/**
 * Namespace: Plugin Processing Content extracting metatadata.
 * Context: [unified.js] text AST processing.
 */
export const TextProcessor = {
  /**
   * Markdown transformer.
   */
  async markdown(input: VFileCompatible, options: MarkdownConvertOptions = {}) {
    const { gfm = true } = options;
    const _codeblocks: t.CodeBlock[] = [];

    const handleCodeBlockMatch: t.CodeMatch = (e) => {
      if (e.node.meta) {
        const def = CodeBlock.toObject(e.node);
        e.replace(CodeBlock.placeholder.createPendingElement(def.id)); // HACK: Pending <div> contains the ID and is finalised within [rehype] as ID is not being passed through HTML conversion.
        _codeblocks.push(def);
      }
    };

    /**
     * PIPELINE Compose Text Processors.
     */
    const pipeline = unified();

    /**
     * Markdown (Grammar)
     */
    pipeline.use(remarkParse);
    if (gfm) {
      pipeline.use(remarkGfm);
    }
    pipeline.use(CodeBlock.plugin.markdown, handleCodeBlockMatch);

    /**
     * HTML (Grammar)
     */
    pipeline
      // -> Html
      .use(remarkToRehype)
      .use(rehypeFormat)
      .use(rehypeSanitize, Sanatize.schema());

    pipeline
      // -- Html
      .use(CodeBlock.plugin.html, () => _codeblocks)
      .use(rehypeStringify);

    const vfile = await pipeline.process(input);

    return {
      get info() {
        return {
          codeblocks: [..._codeblocks],
        };
      },

      get text() {
        let text = vfile?.toString() || '';
        if (text.startsWith('\n')) text = text.substring(1);
        if (text.endsWith('\n')) text = text.substring(0, text.length - 1);
        return text;
      },
    };
  },
};

/**
 * Helpers for working with the markdown sanatizer
 */
const Sanatize = {
  /**
   *  REF: https://github.com/rehypejs/rehype-sanitize
   */
  schema(): Schema {
    return {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        code: [
          ...((defaultSchema.attributes || {}).code || []),
          ['className', 'language-ts', 'language-yaml'],
        ],
      },
    };
  },
};
