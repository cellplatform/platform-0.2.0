import { describe, expect, it } from '../test';

import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { select, selectAll } from 'unist-util-select';
import { visit } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';

import type { Heading, Root, Text } from 'mdast';
import type { Parent } from 'unist';

describe('Sample: markdown with "universal syntax tree" utilities (unist)', () => {
  describe('unist-util ', () => {
    /**
     * https://unifiedjs.com/learn/recipe/tree-traversal-typescript/#unist-util-visit
     */
    describe('unist-util-visit', () => {
      it('sample: increase markdown heading level', async () => {
        function samplePlugin() {
          return (tree: Root) => {
            visit(tree, 'heading', (node) => {
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
          return (tree: Root) => {
            visit(tree, 'list', (node) => {
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
        expect(res.toString()).to.eql(`* Hello\n`);
      });
    });

    /**
     * https://unifiedjs.com/learn/recipe/tree-traversal-typescript/#unist-util-visit-parents
     */
    describe('unist-util-visit-parents', () => {
      it('check if all markdown [ListItem] are inside a [List]', async () => {
        const _parents: Parent[] = [];

        function samplePlugin() {
          return (tree: Root) => {
            visitParents(tree, 'listItem', (listItem, parents) => {
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
        expect(res.toString()).to.eql('1. Hello\n');

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
        type T = ReturnType<typeof selectAll>;
        const _matches: T = [];

        function samplePlugin() {
          return (tree: Root) => {
            const matches = selectAll('blockquote paragraph', tree);
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

  describe('partial processing and combining', () => {
    type O = { suffix: string };
    function headingSuffix(options: O) {
      return (tree: Root) => {
        const matches = selectAll('heading', tree) as Heading[];
        matches
          .filter((heading) => heading.depth === 1)
          .forEach((heading) => {
            const text = select('text', heading) as Text | null;
            if (text?.value) {
              text.value = `${text.value}${options.suffix}`;
            }
          });
      };
    }

    const pipeline1 = unified()
      .use(remarkParse)
      .use(headingSuffix, { suffix: '...' })
      .use(remarkStringify);

    const pipeline2 = unified()
      .use(remarkParse)
      .use(headingSuffix, { suffix: '!' })
      .use(remarkStringify);

    it('combine: input/output as strings (immutable)', async () => {
      const res1 = (await pipeline1.process('# Hello')).toString();
      const res2 = (await pipeline2.process(res1)).toString();
      expect(res1).to.eql('# Hello...\n');
      expect(res2).to.eql('# Hello...!\n');
    });

    it('combine: input/output as VFile objects (mutable)', async () => {
      const res1 = await pipeline1.process('# Hello');
      expect(res1.toString()).to.eql('# Hello...\n');

      const res2 = await pipeline2.process(res1);
      expect(res2.toString()).to.eql('# Hello...!\n');
    });
  });
});
