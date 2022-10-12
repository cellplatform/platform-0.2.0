import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit, SKIP } from 'unist-util-visit';

import { describe, expect, it } from '../test/index.mjs';
import { visitParents } from 'unist-util-visit-parents';
import type { Root } from 'mdast';
import { selectAll } from 'unist-util-select';

describe('Plugin (Sample)', () => {
  /**
   * https://unifiedjs.com/learn/recipe/tree-traversal-typescript/#unist-util-visit
   */
  describe('unist-util-visit', () => {
    it('sample: increase markdown heading level', async () => {
      function samplePlugin() {
        return (mdast: Root) => {
          visit(mdast, 'heading', (node) => {
            node.depth += 1;
          });
        };
      }

      const pipeline = unified()
        //
        .use(remarkParse)
        .use(samplePlugin)
        .use(remarkStringify);

      const res = await pipeline.process(`# Hello`);
      expect(res.toString()).to.eql(`## Hello\n`);
    });

    it('sample: make all ordered lists in a markdown document unordered', async () => {
      function samplePlugin() {
        return (mdast: Root) => {
          visit(mdast, 'list', (node) => {
            if (node.ordered) node.ordered = false;
          });
        };
      }

      const pipeline = unified()
        //
        .use(remarkParse)
        .use(samplePlugin)
        .use(remarkStringify);

      const res = await pipeline.process(`1. Hello`);
      expect(res.toString()).to.eql(`*   Hello\n`);
    });
  });

  /**
   * https://unifiedjs.com/learn/recipe/tree-traversal-typescript/#unist-util-visit-parents
   */
  describe('unist-util-visit-parents', () => {
    it('check if all markdown [ListItem] are inside a [List]', async () => {
      type O = { onError: (msg: string) => void };

      function samplePlugin(options: O) {
        return (mdast: Root) => {
          visitParents(mdast, 'listItem', (listItem, parents) => {
            //
            // console.dir(parents, { depth: 15 });
            console.log('listItem', listItem);

            if (!parents.some((parent) => parent.type === 'list')) {
              // console.log('listItem', listItem);
              // options.onError('not within list');
            }
          });
        };
      }

      const errors: string[] = [];

      const pipeline = unified()
        //
        .use(remarkParse)
        .use(samplePlugin, { onError: (msg) => errors.push(msg) })
        .use(remarkStringify);

      const res = await pipeline.process(`1. Hello`);

      console.log('-------------------------------------------');
      console.log('res.toString()', res.toString());
      console.log('errors', errors);
    });
  });

  /**
   * https://unifiedjs.com/learn/recipe/tree-traversal-typescript/#unist-util-select
   */
  describe('unist-util-select', () => {
    it('select a node', async () => {
      //
    });
  });

  describe('spike', () => {
    it.only('does', async () => {
      function samplePlugin() {
        return (mdast: Root) => {
          visit(mdast, 'code', (node, index = -1, parent) => {
            console.log('node', node);
            (parent as any).children.splice(index, 1);
            return [SKIP, index];
          });
        };
      }

      const pipeline = unified()
        //
        .use(remarkParse)
        .use(samplePlugin)
        .use(remarkStringify);

      const md = `
# My Title

\`\`\`yaml foo
foo:
  bar: 123
\`\`\`

      `;

      const res = await pipeline.process(md);
      // expect(res.toString()).to.eql(`*   Hello\n`);
      console.log('-----------------------------------------');
      console.log('res', res);
    });
  });
});
