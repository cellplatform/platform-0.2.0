import { expect, describe, it } from '../test/index.mjs';
import { TextProcessor } from './index.mjs';
import { MarkdownProcessor } from '../Markdown.Processor/index.mjs';

describe('TextProcessor', () => {
  it('MarkdownProcessor', () => {
    expect(TextProcessor.markdown).to.equal(MarkdownProcessor);
  });
});
