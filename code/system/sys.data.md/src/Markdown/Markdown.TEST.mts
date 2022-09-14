import { Markdown } from './index.mjs';
import { expect, describe, it } from '../Test/index.mjs';

describe('Markdown', () => {
  it('Markdown.toHtml (async)', async () => {
    const markdown = `# Heading`;
    const html = await Markdown.toHtml(markdown);
    expect(html).to.eql('<h1>Heading</h1>');
  });

  it('Markdown.toHtmlSync (sync)', () => {
    const markdown = `# Heading`;
    const html = Markdown.toHtmlSync(markdown);
    expect(html).to.eql('<h1>Heading</h1>');
  });
});
