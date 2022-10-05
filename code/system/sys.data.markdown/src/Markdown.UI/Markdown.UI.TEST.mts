import { describe, it, expect, render } from '../test/index.mjs';
import { MarkdownUI } from './index.mjs';

describe('MarkdownUI', () => {
  it('toElement from markdown', () => {
    const el = MarkdownUI.toElement('# Title');
    expect(el.props.html).to.eql('<h1>Title</h1>');

    const html = render(el).container.innerHTML;
    expect(html).to.include('<h1>Title</h1>');
  });
});
