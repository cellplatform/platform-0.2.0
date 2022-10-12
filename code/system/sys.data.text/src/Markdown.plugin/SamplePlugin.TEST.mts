import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit, SKIP } from 'unist-util-visit';

import { describe, expect, it } from '../test/index.mjs';
import { visitParents } from 'unist-util-visit-parents';
import type { Root } from 'mdast';
import { selectAll } from 'unist-util-select';
import type { Parent, Node, Data } from 'unist';

describe('Plugin (Samples)', () => {
  describe('unist-util (universal syntax tree: utilities)', () => {
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
        const _parents: Parent[] = [];

        function samplePlugin() {
          return (mdast: Root) => {
            visitParents(mdast, 'listItem', (listItem, parents) => {
              _parents.push(...parents);
            });
          };
        }

        const pipeline = unified()
          //
          .use(remarkParse)
          .use(samplePlugin)
          .use(remarkStringify);

        const res = await pipeline.process(`1. Hello`);
        expect(res.toString()).to.eql('1.  Hello\n');

        expect(_parents.length).to.eql(2);
        expect(_parents[0].type).to.eql('root');
        expect(_parents[1].type).to.eql('list');
      });
    });

    /**
     * https://unifiedjs.com/learn/recipe/tree-traversal-typescript/#unist-util-select
     */
    describe('unist-util-select', () => {
      it('select a node', async () => {
        const _matches: Node<Data>[] = [];

        function samplePlugin() {
          return (mdast: Root) => {
            const matches = selectAll('blockquote paragraph', mdast);
            _matches.push(...matches);
          };
        }

        const pipeline = unified()
          //
          .use(remarkParse)
          .use(samplePlugin)
          .use(remarkStringify);

        const res = await pipeline.process(`>> Hello`);
        expect(res.toString()).to.eql('> > Hello\n');

        expect(_matches.length).to.eql(1);
        expect(_matches[0].type).to.eql('paragraph');
      });
    });
  });

  describe('matchers and helpers', () => {
    it.skip('code block: yaml | meta:<text>', async () => {
      function samplePlugin() {
        return (mdast: Root) => {
          visit(mdast, 'code', (node, index = -1, parent) => {
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

\`\`\`yaml document:meta
version: 0.0.0
title:   My Document
\`\`\`

      `;

      const res = await pipeline.process(md);
      // expect(res.toString()).to.eql(`*   Hello\n`);
      console.log('-----------------------------------------');
      console.log('res', res);
    });
  });
});
