import rehypeFormat from 'rehype-format';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

import { t } from './common.mjs';
import { CodeBlock } from './util.plugin.CodeBlock.mjs';
import { DocStructure } from './util.plugin.DocStructure.mjs';
import { Hast } from './util.plugin.Hast.mjs';
import { Mdast } from './util.plugin.Mdast.mjs';
import { Sanatize } from './util.Sanitize.mjs';

export const Pipeline = {
  /**
   * Compose together a pipeline of text transformation plugins.
   */
  compose(kind: 'md:only' | 'md > html', options: t.MarkdownOptions & t.HtmlOptions = {}) {
    const { gfm = true } = options;
    const pipeline = unified();
    const _code: t.CodeBlock[] = [];
    let _root: t.MdastRoot | undefined;

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
    pipeline.use(DocStructure.plugin, { onParse: (e) => (_root = e.tree) });
    pipeline.use(Mdast.optionPlugin, options);
    pipeline.use(CodeBlock.plugin.markdown, { onMatch: handleCodeBlock });
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
        .use(CodeBlock.plugin.html, { getBlocks: () => _code })
        .use(Hast.optionPlugin, options) // NB: Supports injection of a node manipulator from the call-site.
        .use(rehypeStringify);
    }

    /**
     * Finish up.
     */
    return {
      pipeline,
      get info(): t.MarkdownInfo {
        const code: t.CodeInfo = {
          get all() {
            return [..._code];
          },
          get typed() {
            return _code.filter((block) => Boolean(block.type));
          },
          get untyped() {
            return _code.filter((block) => !Boolean(block.type));
          },
        };

        return {
          code,
          get mdast() {
            if (!_root) throw new Error(`The root of the markdown has not been parsed`);
            return _root;
          },
        };
      },
    };
  },
};
