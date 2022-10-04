import React from 'react';

import { describe, expect, it, render } from '../test/index.mjs';
import { SanitizeHtml } from './index.mjs';

describe('SanitizeHtml', () => {
  const renderToHtml = (html: string) => {
    const el = <SanitizeHtml html={html} className={'my-container'} />;
    return render(el).container.innerHTML;
  };

  it('sanitize (helper)', () => {
    const test = (html: string, after: string) => {
      expect(SanitizeHtml.sanitize(html)).to.eql(after);
    };
    test(`<div>foo</div>`, `<div>foo</div>`);
    test(`<script>alert('hello world')</script>`, '');
    test(`<div><script>alert('hello world')</script></div>`, '<div></div>');
  });

  describe('render', () => {
    it('div: allowed', () => {
      const source = '<div>foo</div>';
      const html = renderToHtml(source);
      expect(html).to.include('class="my-container"');
      expect(html).to.include(source);
    });

    it('img: allowed', () => {
      const source = `<img src="./img.png">`;
      const html = renderToHtml(source);
      expect(html).to.include(source);
    });

    it('script: disallowed', () => {
      const source = `<script>alert('hello world')</script>`;
      const html = renderToHtml(source);
      expect(html).to.not.include(source);
    });
  });
});
