import { describe, expect, it } from '../test';
import { MarkdownProcessor } from '.';

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
      expect(res1.toString()).to.eql(res1.markdown);

      expect(res2.markdown).to.eql('# Hello');
      expect(res2.toString()).to.eql(res2.markdown); // NB: Without modifier, always returns source "markdown"
    });
  });

  describe('input types (string, Uint8Array, <undefined>)', () => {
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

  describe('GFM (Github Flavored Markdown)', () => {
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

[^1]: My note [link](./path.md)
      `;
      const res1 = await MarkdownProcessor().toHtml(SAMPLE, { gfm: false });
      const res2 = await MarkdownProcessor().toHtml(SAMPLE, { gfm: true });
      const res3 = await MarkdownProcessor().toHtml(SAMPLE, {});

      expect(res1.html).to.include(`<p>A note[^1]</p>`);
      expect(res2.html).to.eql(res3.html); // NB: Default is to use [gfm].

      const html = res2.html;
      expect(html).to.include('<p>A note');
      expect(html).to.include('<sup><a href="#');
      expect(html).to.include('Footnotes</h2>');
      expect(html).to.include('<ol>');
      expect(html).to.include('<p>My note <a href="./path.md">link</a>');
    });

    it('table', async () => {
      const SAMPLE = `
| A | B  |  C |  D  |
| - | :- | -: | :-: |
| a | b  |  c |  d  |
      `;
      const res1 = await MarkdownProcessor({ gfm: false }).toHtml(SAMPLE);
      const res2 = await MarkdownProcessor({ gfm: true }).toHtml(SAMPLE);

      expect(res1.html).to.include('| A | B');

      const html = res2.html;
      expect(html).to.include('<table>');

      expect(html).to.include('<th>A</th>');
      expect(html).to.include('<th align="left">B</th>');
      expect(html).to.include('<th align="right">C</th>');
      expect(html).to.include('<th align="center">D</th>');

      expect(html).to.include('<td>a</td>');
      expect(html).to.include('<td align="left">b</td>');
      expect(html).to.include('<td align="right">c</td>');
      expect(html).to.include('<td align="center">d</td>');
    });
  });

  describe('html sanitizer', () => {
    it('santized input', async () => {
      const res1 = await MarkdownProcessor().toHtml('# Hello');
      const res2 = await MarkdownProcessor().toHtml('<script>eval("danger();")</script>');

      expect(res1.html).to.eql('<h1>Hello</h1>');
      expect(res2.html).to.eql('');
    });
  });

  describe('toString( position? )', async () => {
    const INPUT = `
# Hello

- Foo
`.substring(1);

    const processor = MarkdownProcessor();

    it('{ position }: within MARKDOWN', async () => {
      const m = await processor.toMarkdown(INPUT);
      const h = await processor.toHtml(INPUT);
      const title = m.info.mdast.children[0];
      const list = m.info.mdast.children[1];

      const res1a = m.toString(title.position);
      const res1b = m.toString(list.position);

      const res2a = h.toString(title.position);
      const res2b = h.toString(list.position);

      expect(res1a).to.eql('# Hello');
      expect(res1b).to.eql('- Foo');

      expect(res2a).to.eql(res1a);
      expect(res2b).to.eql(res1b);
    });

    it('sceanrio: parse markdown and convert a single MD element into HTML', async () => {
      const m = await processor.toMarkdown(INPUT);
      const title = m.info.mdast.children[0];
      const list = m.info.mdast.children[1];

      const titleMd = m.toString(title.position);
      const listMd = m.toString(list.position);

      const hTitle = await processor.toHtml(titleMd);
      const hList = await processor.toHtml(listMd);

      expect(hTitle.html).to.eql('<h1>Hello</h1>');
      expect(hList.html.startsWith('<ul>')).to.eql(true);
      expect(hList.html.endsWith('</ul>')).to.eql(true);
    });
  });
});
