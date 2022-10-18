import rehypeFormat from 'rehype-format';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import { unified } from 'unified';

import { t } from '../common/index.mjs';
import { CodeBlock } from './util.plugin.CodeBlock.mjs';
import { Sanatize } from './util.Sanitize.mjs';
import remarkStringify from 'remark-stringify';

import { DocStructure } from './util.plugin.DocStructure.mjs';

/**
 * Builds a pipeline for processing markdown.
 */
export function PipelineBuilder(kind: 'md:only' | 'md > html', options: t.MarkdownOptions) {
  const { gfm = true } = options;
  const pipeline = unified();
  const _codeblocks: t.CodeBlock[] = [];

  const handleCodeBlockMatch: t.CodeMatch = (e) => {
    if (e.node.meta) {
      const def = CodeBlock.toObject(e.node);
      _codeblocks.push(def);

      if (kind === 'md > html') {
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
  pipeline.use(DocStructure.plugin);
  if (kind === 'md:only') pipeline.use(remarkStringify);

  /**
   * HTML (Grammar)
   */
  if (kind === 'md > html') {
    pipeline
      // -> Html
      .use(remarkToRehype)
      .use(rehypeFormat)
      .use(rehypeSanitize, Sanatize.schema())
      .use(CodeBlock.plugin.html, () => _codeblocks)
      .use(rehypeStringify);
  }

  /**
   * Finish up.
   */
  return {
    pipeline,
    get info(): t.MarkdownInfo {
      return {
        typedCodeBlocks: [..._codeblocks],
      };
    },
  };
}
