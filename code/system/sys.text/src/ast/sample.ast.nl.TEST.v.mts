import retextEnglish from 'retext-english';
import retextStringify from 'retext-stringify';
import { unified } from 'unified';
import { selectAll } from 'unist-util-select';

import { describe, expect, it } from '../test';

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

  it('sample scenario: replace "CO2" => "CO₂"', async () => {
    const SAMPLE = `
    # Sample
    **Lorem ipsum** dolor CO2 sit amet, consectetur adipiscing elit. Quisque nec quam lorem. Praesent 
    fermentum, augue ut porta varius, eros nisl euismod ante, [co2] ac suscipit elit libero 
    nec dolor. Morbi magna enim, molestie non arcu id, "Co2" varius sollicitudin neque. 
    In sed quam mauris. Aenean CO₂ mi nisl, elementum non arcu quis, ultrices tincidunt 
    augue. Vivamus fermentum iaculis tellus finibus porttitor. Nulla <CO2> eu purus id dolor auctor 
    suscipit. Integer lacinia sapien at ante tempus volutpat....co2!
  `;

    type MatchAndReplace = (args: MatchAndReplaceArgs) => void;
    type MatchAndReplaceArgs = { text: string; replace(value: string): void };
    type O = { match: MatchAndReplace };

    function samplePlugin(options: O) {
      return (tree: Root) => {
        const matches = selectAll('WordNode TextNode', tree) as Text[];
        matches.forEach((word) => {
          options.match({
            text: word.value,
            replace: (value) => (word.value = value),
          });
        });
      };
    }

    const match: MatchAndReplace = (e) => {
      if (e.text.toUpperCase() === 'CO2') e.replace('CO₂');
    };

    const pipeline = unified()
      //
      .use(retextEnglish)
      .use(samplePlugin, { match })
      .use(retextStringify);

    const res1 = await pipeline.process('Foo bar CO2 baz');
    const res2 = await pipeline.process(SAMPLE);

    expect(res1.toString()).to.eql('Foo bar CO₂ baz');
    expect(res2.toString()).to.include('[CO₂]');

    const match1 = res2.toString().match(/CO₂/g) || [];
    const match2 = res2.toString().match(/CO2/g) || [];

    expect(match1.length).to.eql(6);
    expect(match2.length).to.eql(0);
  });
});
