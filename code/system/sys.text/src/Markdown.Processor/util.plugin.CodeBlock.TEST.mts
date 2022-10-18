import { describe, it, expect } from '../test/index.mjs';
import { MarkdownProcessor } from './index.mjs';

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

describe('Markdown: CodeBlock (```) procesing', () => {
  it('markdown and html (code path: toHtml)', async () => {
    const res = await MarkdownProcessor().toHtml(SAMPLE);
    const html = res.html;

    expect(res.info.typedCodeBlocks.length).to.eql(2);
    expect(res.info.typedCodeBlocks[0].lang).to.eql('yaml');
    expect(res.info.typedCodeBlocks[1].lang).to.eql('ts');

    expect(res.info.typedCodeBlocks[0].text).to.eql('version: 0.0.0\ntitle:   My Document');
    expect(res.info.typedCodeBlocks[1].text).to.eql('export default { foo: 123 }');

    res.info.typedCodeBlocks.forEach((item) => {
      const lang = `data-lang="${item.lang}"`;
      const type = `data-type="${item.type}"`;
      expect(html).to.include(`<div id="${item.id}" ${lang} ${type}`);
    });

    // NB: Blocks with no "meta" entry are not converted.
    expect(html).to.include(`<code class="language-yaml">sample: "plain block not a meta block"`);
    expect(html).to.include(`<code class="language-ts">// Sample code.`);
    expect(html).to.include('<p>The End.</p>');
  });

  it('markdown only (code path: toMarkdown)', async () => {
    const processor = MarkdownProcessor();
    const res = await processor.toMarkdown(SAMPLE);

    expect(res.markdown.startsWith('# My Title')).to.eql(true);
    expect(res.markdown.endsWith('The End.')).to.eql(true);

    expect(res.info.typedCodeBlocks[0].text).to.eql('version: 0.0.0\ntitle:   My Document');
    expect(res.info.typedCodeBlocks[1].text).to.eql('export default { foo: 123 }');
  });
});
