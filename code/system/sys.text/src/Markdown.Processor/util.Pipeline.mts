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

export const Pipeline = {
  /**
   * Compose together a pipeline of text transformation plugins.
   */
  compose(kind: 'md:only' | 'md > html', options: t.MarkdownOptions) {
    const { gfm = true } = options;
    const pipeline = unified();
    const _code: t.CodeBlock[] = [];

    const handleCodeBlock: t.CodeMatch = (e) => {
      const def = CodeBlock.toObject(e.node);
      _code.push(def);

      if (kind === 'md > html' && def.type) {
        // HACK: Pending <div> contains the ID and is finalised within [rehype]
        //       as ID will not be passed through the HTML conversion.
        e.replace(CodeBlock.placeholder.createPendingElement(def.id));
      }
    };

    /**
     * Markdown (Grammar)
     */
    pipeline.use(remarkParse);
    if (gfm) pipeline.use(remarkGfm);
    pipeline.use(CodeBlock.plugin.markdown, handleCodeBlock);
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
        .use(CodeBlock.plugin.html, () => _code)
        .use(rehypeStringify);
    }

    /**
     * Finish up.
     */
    return {
      pipeline,
      get info(): t.MarkdownInfo {
        return {
          code: {
            get all() {
              return [..._code];
            },
            get typed() {
              return _code.filter((block) => Boolean(block.type));
            },
            get untyped() {
              return _code.filter((block) => !Boolean(block.type));
            },
          },
        };
      },
    };
  },
};
