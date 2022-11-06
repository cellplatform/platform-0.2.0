import { expect, describe, it } from '../test';
import { TextProcessor } from '.';
import { MarkdownProcessor } from '../Markdown.Processor';

describe('TextProcessor', () => {
  it('MarkdownProcessor', () => {
    expect(TextProcessor.markdown).to.equal(MarkdownProcessor);
  });
});
