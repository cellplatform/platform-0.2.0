import { expect, describe, it } from '../test/index.mjs';
import { TextProcessor } from './TextProcessor.mjs';

describe('TextProcessor: Markdown', () => {
  it('match meta-data code blocks', async () => {
    const MARKDOWN = `
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

    const res = await TextProcessor.markdown(MARKDOWN);
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
});
