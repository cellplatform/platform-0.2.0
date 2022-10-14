import { Markdown } from './index.mjs';
import { expect, describe, it } from '../test/index.mjs';
import { toHtml, toHtmlSync } from './processor.mjs';

describe('Markdown', () => {
  it('toHtml methods', () => {
    expect(Markdown.toHtml).to.equal(toHtml);
    expect(Markdown.toHtmlSync).to.equal(toHtmlSync);
  });
});
