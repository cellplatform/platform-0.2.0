import { toHtml, toHtmlSync } from './process.mjs';
import { expect, describe, it } from '../test/index.mjs';

describe('MarkdownProcessor', () => {
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
});
