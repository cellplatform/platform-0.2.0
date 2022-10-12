import { toHtml, toHtmlSync, Util } from './processor.mjs';
import { expect, describe, it } from '../test/index.mjs';
import { Time } from '../common/index.mjs';

describe('processor', () => {
  it('toHtml (async)', async () => {
    const markdown = `# Heading`;
    const html = await toHtml(markdown);
    expect(html).to.eql('<h1>Heading</h1>');
  });

  it('toHtmlSync (sync)', () => {
    const markdown = `# Heading`;
    const html = toHtmlSync(markdown);
    expect(html).to.eql('<h1>Heading</h1>');
  });

  describe('word match and replacement', () => {
    /**
     * TODO 🐷
     * https://github.com/cellplatform/platform-0.2.0/issues/83
     */
    it.skip('scenario: replaces "CO2" => "CO₂"', async () => {
      const SAMPLE = `
        # Sample
        **Lorem ipsum** dolor CO2 sit amet, consectetur adipiscing elit. Quisque nec quam lorem. Praesent 
        fermentum, augue ut porta varius, eros nisl euismod ante, [co2] ac suscipit elit libero 
        nec dolor. Morbi magna enim, molestie non arcu id, "Co2" varius sollicitudin neque. 
        In sed quam mauris. Aenean mi nisl, elementum non arcu quis, ultrices tincidunt 
        augue. Vivamus fermentum iaculis tellus finibus porttitor. Nulla <CO2> eu purus id dolor auctor 
        suscipit. Integer lacinia sapien at ante tempus volutpat....co2!
      `;

      // NB: Psudo-functions
      pattern((word) => match('CO2', word))
        .replaceWith('CO₂')
        .process(SAMPLE);
    });

    /**
     * TODO 🐷
     * https://github.com/cellplatform/platform-0.2.0/issues/84
     */
    it.skip('scenario: match and derive "config props" inline within markdown', async () => {
      //
      const SAMPLE = `
        # Sample
        **Lorem ipsum** dolor sit amet, consectetur adipiscing elit. Quisque nec quam lorem. Praesent 
        fermentum, augue ut porta varius, eros.

        \`\`\`yaml
        foo:
          kind: 'bar'
          view: 'sys.doc.image'
          src: 'path/to/image.png'
          margin: [50, 20]
        \`\`\`


        - One
        - Two

        ---

        Morbi magna enim, molestie non arcu id, "Co2" varius sollicitudin neque:

        \`\`\`ts
        // component: sys.doc.chart
        const props = { count:123 };
        \`\`\`

        In sed quam mauris. Aenean mi nisl, elementum non arcu quis, ultrices tincidunt 
        augue. Vivamus fermentum iaculis tellus finibus porttitor. Nulla <CO2> eu purus id dolor auctor 
        suscipit. Integer lacinia sapien at ante tempus volutpat....co2!
      `;

      // NB: Psudo-functions
      pattern((word) => match(word))
        .replaceWith('CO₂')
        .process(SAMPLE);
    });
  });
});

/**
 * 🐷 TEMP 🐷
 * Stub psudo-functions
 */
const api = {
  pattern(filter: (word: string) => boolean) {
    return api;
  },
  match(filter: string | ((word: string) => boolean)) {
    return api;
  },
  replaceWith(word: string) {
    return api;
  },

  process(input: string) {
    return api;
  },
};

const { pattern } = api;

const match = (...input: any[]) => true;
