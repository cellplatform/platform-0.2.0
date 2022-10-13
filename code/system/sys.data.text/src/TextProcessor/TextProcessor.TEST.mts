import { describe, it } from '../test/index.mjs';
import { TextProcessor } from './TextProcessor.mjs';

describe('Sample: process/matching', () => {
  it('match and process markdown', async () => {
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

\`\`\`yaml props:view
foo: "props:view"
\`\`\`

---

The End.
    `;

    const res = await TextProcessor.markdown(MARKDOWN);
    // const res = await processor.run(MARKDOWN);

    console.log('---------------------------------------');
    console.log('res.markdown\n', res.markdown);

    const html = await res.toHtml();

    console.log('---------------------------------');
    console.log('res.info', res.info);
    console.log('------------------------------------');
    console.log('run response:', res);
    console.log('-------------------------------------------');
    console.log('html:', html.toString());
  });
});
