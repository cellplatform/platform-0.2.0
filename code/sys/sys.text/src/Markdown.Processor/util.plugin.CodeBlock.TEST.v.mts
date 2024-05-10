import { describe, it, expect } from '../test';
import { MarkdownProcessor } from '.';

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
// Sample.
\`\`\`

~~~
$ sample
~~~

~~~ts props:view
export default { foo: 123 }
~~~

---

The End.
`.substring(1);

describe('Markdown: code-block (```) procesing', () => {
  describe('typed code-blocks: ```<lang> <type>', () => {
    it('matches typed blocks (only)', async () => {
      const res1 = await MarkdownProcessor().toHtml(SAMPLE);
      const res2 = await MarkdownProcessor().toMarkdown(SAMPLE);

      expect(res1.info.code.all.length).to.eql(5);
      expect(res1.info.code.typed.length).to.eql(2);

      expect(res1.info.code.typed[0].lang).to.eql('yaml');
      expect(res1.info.code.typed[1].lang).to.eql('ts');

      expect(res1.info.code.typed).to.not.eql(res2.info.code.typed); // NB: Differs on ID's.

      const code1 = res1.info.code.typed.map((item) => item.text);
      const code2 = res2.info.code.typed.map((item) => item.text);
      expect(code1).to.eql(code2);
    });

    it('markdown and html (code path: toHtml)', async () => {
      const res = await MarkdownProcessor().toHtml(SAMPLE);
      const html = res.html;

      expect(res.info.code.all.length).to.eql(5);
      expect(res.info.code.typed.length).to.eql(2);
      expect(res.info.code.typed[0].text).to.eql('version: 0.0.0\ntitle:   My Document');
      expect(res.info.code.typed[1].text).to.eql('export default { foo: 123 }');

      res.info.code.typed.forEach((item) => {
        const lang = `data-lang="${item.lang}"`;
        const type = `data-type="${item.type}"`;
        expect(html).to.include(`<div id="${item.id}" ${lang} ${type}`);
      });
    });

    it('markdown only (code path: toMarkdown)', async () => {
      const processor = MarkdownProcessor();
      const res = await processor.toMarkdown(SAMPLE);

      expect(res.markdown.startsWith('# My Title')).to.eql(true);
      expect(res.markdown.endsWith('The End.')).to.eql(true);

      expect(res.info.code.typed[0].text).to.eql('version: 0.0.0\ntitle:   My Document');
      expect(res.info.code.typed[1].text).to.eql('export default { foo: 123 }');
    });
  });

  describe('untyped code-blocks: ```<lang>', () => {
    it('matches untyped blocks (only)', async () => {
      const res1 = await MarkdownProcessor().toMarkdown(SAMPLE);
      const res2 = await MarkdownProcessor().toHtml(SAMPLE);

      expect(res1.info.code.all.length).to.eql(5);
      expect(res1.info.code.untyped.length).to.eql(3);

      expect(res1.info.code.untyped[0].lang).to.eql('yaml');
      expect(res1.info.code.untyped[1].lang).to.eql('ts');
      expect(res1.info.code.untyped[2].lang).to.eql('');

      expect(res1.info.code.typed).to.not.eql(res2.info.code.typed); // NB: Differs on ID's.

      const code1 = res1.info.code.typed.map((item) => item.text);
      const code2 = res2.info.code.typed.map((item) => item.text);
      expect(code1).to.eql(code2);
    });

    it('Blocks with no "meta" type are not converted.', async () => {
      const res = await MarkdownProcessor().toHtml(SAMPLE);
      const html = res.html;

      expect(html).to.include(`<code class="language-yaml">sample: "plain block not a meta block"`);
      expect(html).to.include(`<code class="language-ts">// Sample.`);
      expect(html).to.include(`<pre><code>$ sample`);
      expect(html).to.include('<p>The End.</p>');
    });
  });
});
