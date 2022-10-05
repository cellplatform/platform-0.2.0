import { Markdown } from './index.mjs';
import { expect, describe, it } from '../test/index.mjs';
import { MarkdownProcessor } from '../Markdown.Processor/index.mjs';
import { MarkdownUI } from '../Markdown.UI/index.mjs';

describe('Markdown', () => {
  it('toHtml methods', () => {
    expect(Markdown.toHtml).to.equal(MarkdownProcessor.toHtml);
    expect(Markdown.toHtmlSync).to.equal(MarkdownProcessor.toHtmlSync);
  });

  it('UI methods', () => {
    expect(Markdown.UI).to.equal(MarkdownUI);
  });
});
