import rehypeFormat from 'rehype-format';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFileCompatible } from 'vfile';

import { t } from '../common/index.mjs';
import { CodeBlock } from './MD.CodeBlock.mjs';
import { Sanatize } from './util.Sanitize.mjs';

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
  markdown(options: MarkdownConvertOptions = {}) {
    return {
      async html(input: VFileCompatible) {
        const builder = PipelineBuilder('Markdown>Html', options);
        const vfile = await builder.pipeline.process(input);
        const text = formatText(vfile?.toString());
        const info = builder.info;
        return { text, info };
      },
    };
  },
};

/**
 * Helpers for working with the markdown sanatizer
 */

function PipelineBuilder(kind: 'Markdown' | 'Markdown>Html', options: MarkdownConvertOptions) {
  const { gfm = true } = options;
  const pipeline = unified();
  const _codeblocks: t.CodeBlock[] = [];

  const handleCodeBlockMatch: t.CodeMatch = (e) => {
    if (e.node.meta) {
      const def = CodeBlock.toObject(e.node);
      _codeblocks.push(def);

      if (kind === 'Markdown>Html') {
        // HACK: Pending <div> contains the ID and is finalised within [rehype]
        //       as ID is not being passed through HTML conversion.
        e.replace(CodeBlock.placeholder.createPendingElement(def.id));
      }
    }
  };

  /**
   * Markdown (Grammar)
   */
  pipeline.use(remarkParse);
  if (gfm) pipeline.use(remarkGfm);
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

  /**
   * Finish up.
   */
  return {
    pipeline,
    get info() {
      return {
        codeblocks: [..._codeblocks],
      };
    },
  };
}

function formatText(text: string = '') {
  if (text.startsWith('\n')) text = text.substring(1);
  if (text.endsWith('\n')) text = text.substring(0, text.length - 1);
  return text;
}
