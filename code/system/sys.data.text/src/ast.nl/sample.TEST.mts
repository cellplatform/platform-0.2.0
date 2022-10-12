import retextEnglish from 'retext-english';
import retextStringify from 'retext-stringify';
import { unified } from 'unified';
import { selectAll } from 'unist-util-select';

import { describe, expect, it } from '../test/index.mjs';

import type { Root, Text } from 'nlcst';

describe('Sample: nlcst (Natural Language Concrete Syntax Tree)', () => {
  it('process words', async () => {
    const _words: string[] = [];

    function samplePlugin() {
      return (tree: Root) => {
        const matches = selectAll('WordNode TextNode', tree) as Text[];
        matches.forEach((word) => {
          word.value = word.value.toLowerCase(); // <== Adjust the word (for example).
          _words.push(word.value);
        });
      };
    }

    const pipeline = unified()
      //
      .use(retextEnglish)
      .use(samplePlugin)
      .use(retextStringify);

    const res = await pipeline.process(`💦 One Two Three!`);
    expect(res.toString()).to.eql('💦 one two three!');
    expect(_words).to.eql(['one', 'two', 'three']);
  });
});
