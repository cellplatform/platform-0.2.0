import { expect, describe, it } from '../test/index.mjs';
import { TextProcessor } from './index.mjs';

describe('TextProcessor: Markdown', () => {
  describe('code-block processing', () => {
    it('extract code blocks (that contain a meta-data suffix)', async () => {
      const SAMPLE = `
# My Title

\`\`\`yaml doc:meta
version: 0.0.0
title:   My Document
\`\`\`

\`\`\`yaml
sample: "plain block not a meta block"
detail: "not a meta block"
\`\`\`

\`\`\`ts
// Sample code.
\`\`\`


\`\`\`ts props:view
export default { foo: 123 }
\`\`\`

---

The End.
    `;

      const res = await TextProcessor.md().html(SAMPLE);
      const html = res.html;

      expect(res.info.codeblocks.length).to.eql(2);
      expect(res.info.codeblocks[0].lang).to.eql('yaml');
      expect(res.info.codeblocks[1].lang).to.eql('ts');

      expect(res.info.codeblocks[0].text).to.eql('version: 0.0.0\ntitle:   My Document');
      expect(res.info.codeblocks[1].text).to.eql('export default { foo: 123 }');

      res.info.codeblocks.forEach((item) => {
        const lang = `data-lang="${item.lang}"`;
        const type = `data-type="${item.type}"`;
        expect(html).to.include(`<div id="${item.id}" ${lang} ${type}`);
      });

      // NB: Blocks with no "meta" entry are not converted.
      expect(html).to.include(`<code class="language-yaml">sample: "plain block not a meta block"`);
      expect(html).to.include(`<code class="language-ts">// Sample code.`);
      expect(html).to.include('<p>The End.</p>');
    });

    it('markdown only', async () => {
      const SAMPLE = `
  \`\`\`yaml doc:meta
  version: 0.0.0
  \`\`\`
            `;

      const processor = TextProcessor.md();
      const res = await processor.markdown(SAMPLE);

      expect(res.markdown).to.eql('```yaml doc:meta\nversion: 0.0.0\n```');
      expect(res.info.codeblocks.length).to.eql(1);
      expect(res.info.codeblocks[0].text).to.eql('version: 0.0.0');
    });
  });

  describe('option: GFM (Github Flavored Markdown)', () => {
    console.info(`
    Examples of GFM variants covered by the parser:
    
    - Tables
    - Tasklists
    - Strikethrough
    - Footnote
    - Autolink literals

    Specification: https://github.github.com/gfm/
    `);

    it('strikethrough', async () => {
      const SAMPLE = `~one~`;
      const res1 = await TextProcessor.md({ gfm: false }).html(SAMPLE);
      const res2 = await TextProcessor.md().html(SAMPLE); // Default: true (enabled).

      expect(res2.html).to.eql('<p><del>one</del></p>'); // <== GFM (Github Flavored Markdown): https://github.github.com/gfm/
      expect(res1.html).to.eql('<p>~one~</p>'); //          <== CommonMark (via Micromark):
      //                                                          - https://commonmark.org
      //                                                          - https://github.com/micromark/micromark
    });

    it('footnote', async () => {
      const SAMPLE = `
A note[^1]

[^1]: My note...
      `;
      const res1 = await TextProcessor.md().html(SAMPLE, { gfm: false });
      const res2 = await TextProcessor.md().html(SAMPLE, { gfm: true });

      expect(res1.html).to.include(`<p>A note[^1]</p>`);

      expect(res2.html).to.include('<p>A note');
      expect(res2.html).to.include('<sup><a href="#');
      expect(res2.html).to.include('Footnotes</h2>');
      expect(res2.html).to.include('<ol>');
      expect(res2.html).to.include('<p>My note...');
    });

    it('table', async () => {
      const SAMPLE = `
| a | b  |  c |  d  |
| - | :- | -: | :-: |
      `;
      const res1 = await TextProcessor.md({ gfm: false }).html(SAMPLE);
      const res2 = await TextProcessor.md({ gfm: true }).html(SAMPLE);

      expect(res1.html).to.include('| a | b');
      expect(res2.html).to.include('<table>');
      expect(res2.html).to.include('<th>a</th>');
      expect(res2.html).to.include('<th align="left">b</th>');
      expect(res2.html).to.include('<th align="right">c</th>');
      expect(res2.html).to.include('<th align="center">d</th>');
    });
  });

  describe('santized input', () => {
    it('santized input', async () => {
      const res1 = await TextProcessor.md().html('# Hello');
      const res2 = await TextProcessor.md().html('<div>hello</div>');

      expect(res1.html).to.eql('<h1>Hello</h1>');
      expect(res2.html).to.eql('');
    });
  });

  it.skip('option: output ("md" | "html")', async () => {
    //
    /**
     * TODO 🐷
     */
  });
});
