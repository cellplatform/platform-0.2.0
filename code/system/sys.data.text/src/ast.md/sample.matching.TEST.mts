import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
import { VFileCompatible } from 'vfile';

import { slug } from '../common/index.mjs';
import { describe, it } from '../test/index.mjs';

import type { Root as MRoot, Code } from 'mdast';
import type { Element, Root as HRoot } from 'hast';

describe('Sample: process/matching', () => {
  it('match and process markdown', async () => {
    function MarkdownProcessor() {
      type CodeMatch = (e: CodeMatchArgs) => void;
      type CodeMatchArgs = { node: Code; remove(): void; replace(value: Element): void };

      function codeBlock(onMatch: CodeMatch) {
        return (tree: MRoot) => {
          visit(tree, 'code', (node, i, parent) => {
            const index = i || -1;
            onMatch({
              node,
              remove() {
                (parent as any).children.splice(index, 1);
                return [SKIP, index];
              },
              replace(value: Element) {
                (parent as any).children[index] = value;
                return [SKIP, index];
              },
            });
          });
        };
      }

      const api = {
        async process(input: VFileCompatible) {
          type CodeBlock = {
            id: string;
            lang: string;
            type: string;
            text: string;
          };

          const codeBlocks: CodeBlock[] = [];

          const onMarkdownCodeBlock: CodeMatch = (e) => {
            if (e.node.meta) {
              codeBlocks.push({
                id: slug(),
                lang: e.node.lang || '',
                type: e.node.meta || '',
                text: e.node.value,
              });
            }
          };

          const pipeline = unified()
            .use(remarkParse)
            .use(codeBlock, onMarkdownCodeBlock)
            .use(remarkStringify);

          const file = await pipeline.process(input);

          return {
            get meta() {
              return codeBlocks;
            },
            toObject: () => file,
            toString: () => file?.toString(),
            toHtml() {
              let index = 0;

              const onHtmlCodeBlock: CodeMatch = (e) => {
                if (e.node.meta) {
                  const item = codeBlocks[index];

                  const div: Element = {
                    type: 'element',
                    tagName: 'div',
                    children: [{ type: 'text', value: `code:${item.id}` }],
                  };

                  e.replace(div);
                  index++;
                }
              };

              function myPlugin() {
                return (tree: HRoot) => {
                  const findCodeItem = (node: Element) => {
                    if (!(node.type === 'element' && node.tagName === 'div')) return;
                    if (node.children[0].type !== 'text') return;
                    if (!node.children[0].value.startsWith('code:')) return;
                    const id = node.children[0].value.replace(/^code\:/, '');
                    return codeBlocks.find((item) => item.id === id);
                  };

                  visit(tree, 'element', (el) => {
                    const item = findCodeItem(el);
                    if (!item) return;

                    const props = el.properties || (el.properties = {});
                    props['id'] = item.id;
                    props['data-lang'] = item.lang;
                    props['data-type'] = item.type;
                    el.children = [];
                  });
                };
              }

              const pipeline = unified()
                .use(remarkParse)
                .use(codeBlock, onHtmlCodeBlock)
                .use(remarkToRehype)
                .use(rehypeFormat)
                .use(myPlugin)
                .use(rehypeStringify);
              return pipeline.process(file);
            },
          };
        },
      };

      return api;
    }

    const md = MarkdownProcessor();

    const sample = `
# My Title

\`\`\`yaml doc:meta
version: 0.0.0
title:   My Document
\`\`\`

\`\`\`yaml
sample: "plain block not a meta block"
detail: "not a meta block"
\`\`\`

\`\`\`yaml props:view
foo: "props:view"
\`\`\`

---

end

    `;

    const res = await md.process(sample);

    console.log('-----------------------------------------');
    console.log('res', res.meta);

    // console.log('res.meta', res.meta);

    const html = await res.toHtml();

    console.log('-------------------------------------------');
    console.log('html:', html.toString());
  });
});
