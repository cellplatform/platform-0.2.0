import { MarkdownProcessor } from './index.mjs';
import { expect, describe, it } from '../Test/index.mjs';

describe('MarkdownProcessor', () => {
  it('toHtml (async)', async () => {
    const markdown = `# Heading`;
    const html = await MarkdownProcessor.toHtml(markdown);
    expect(html).to.eql('<h1>Heading</h1>');
  });

  it('toHtmlSync (sync)', () => {
    const markdown = `# Heading`;
    const html = MarkdownProcessor.toHtmlSync(markdown);
    expect(html).to.eql('<h1>Heading</h1>');
  });
});
