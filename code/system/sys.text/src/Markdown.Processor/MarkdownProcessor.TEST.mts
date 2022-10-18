import { expect, describe, it } from '../test/index.mjs';
import { MarkdownProcessor } from './index.mjs';

describe('TextProcessor.md', () => {
  describe('markdown formatting', () => {
    it('trims \\n characters', async () => {
      const SAMPLE = `

# Hello

`;
      expect(SAMPLE[0]).to.eql('\n'); // NB: Assert the input markdown is padded with \n characters.

      const res1 = await MarkdownProcessor().toHtml(SAMPLE);
      const res2 = await MarkdownProcessor().toMarkdown(SAMPLE);

      expect(res1.html).to.eql('<h1>Hello</h1>');
      expect(res1.markdown).to.eql('# Hello');
      expect(res1.toString()).to.eql(res1.html);

      expect(res2.markdown).to.eql('# Hello');
      expect(res2.toString()).to.eql(res2.markdown);
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
      const res1 = await MarkdownProcessor({ gfm: false }).toHtml(SAMPLE);
      const res2 = await MarkdownProcessor().toHtml(SAMPLE); // Default: true (enabled).

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
      const res1 = await MarkdownProcessor().toHtml(SAMPLE, { gfm: false });
      const res2 = await MarkdownProcessor().toHtml(SAMPLE, { gfm: true });

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
      const res1 = await MarkdownProcessor({ gfm: false }).toHtml(SAMPLE);
      const res2 = await MarkdownProcessor({ gfm: true }).toHtml(SAMPLE);

      expect(res1.html).to.include('| a | b');
      expect(res2.html).to.include('<table>');
      expect(res2.html).to.include('<th>a</th>');
      expect(res2.html).to.include('<th align="left">b</th>');
      expect(res2.html).to.include('<th align="right">c</th>');
      expect(res2.html).to.include('<th align="center">d</th>');
    });
  });

  describe('santizing input', () => {
    it('santized input', async () => {
      const res1 = await MarkdownProcessor().toHtml('# Hello');
      const res2 = await MarkdownProcessor().toHtml('<div>hello</div>');

      expect(res1.html).to.eql('<h1>Hello</h1>');
      expect(res2.html).to.eql('');
    });
  });

  describe('input (string, Uint8Array, undefined)', () => {
    it('Uint8Array', async () => {
      const input = new TextEncoder().encode('# Hello\n');
      const res1 = await MarkdownProcessor().toMarkdown(input);
      const res2 = await MarkdownProcessor().toHtml(input);

      expect(res1.markdown).to.eql('# Hello');
      expect(res2.markdown).to.eql('# Hello');
      expect(res2.html).to.eql('<h1>Hello</h1>');
    });

    it('string', async () => {
      const input = '# Hello\n';
      const res1 = await MarkdownProcessor().toMarkdown(input);
      const res2 = await MarkdownProcessor().toHtml(input);

      expect(res1.markdown).to.eql('# Hello');
      expect(res2.markdown).to.eql('# Hello');
      expect(res2.html).to.eql('<h1>Hello</h1>');
    });

    it('nothing | non-standard type', async () => {
      const test = async (input?: any) => {
        const res1 = await MarkdownProcessor().toMarkdown(input);
        const res2 = await MarkdownProcessor().toHtml(input);

        expect(res1.markdown).to.eql('');
        expect(res2.markdown).to.eql('');
        expect(res2.html).to.eql('');
      };

      await test();
      await test(null);
      await test(true);
      await test(1234);
      await test({});
      await test([{ count: 123 }]);
    });
  });
});
