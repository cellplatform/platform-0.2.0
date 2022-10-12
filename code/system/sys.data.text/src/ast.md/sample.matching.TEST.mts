import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { selectAll } from 'unist-util-select';
import { SKIP, visit } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';

import { describe, expect, it } from '../test/index.mjs';

import type { Root } from 'mdast';
import type { Parent, Node, Data } from 'unist';

describe('Sample: process/matching', () => {
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
