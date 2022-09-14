import React from 'react';

import { describe, expect, it } from '../Test/index.mjs';
import { SanitizeHtml } from './index.mjs';

import { render } from '@testing-library/react';

describe('SanitizeHtml', () => {
  const toHtml = (html: string) => {
    const el = <SanitizeHtml html={html} className={'my-container'} />;
    return render(el).container.innerHTML;
  };

  it('div: allowed', () => {
    const source = '<div>foo</div>';
    const html = toHtml(source);
    expect(html).to.include('class="my-container"');
    expect(html).to.include(source);
  });

  it('img: allowed', () => {
    const source = `<img src="./img.png">`;
    const html = toHtml(source);
    expect(html).to.include(source);
  });

  it('script: disallowed', () => {
    const source = `<script>alert('hello world')</script>`;
    const html = toHtml(source);
    expect(html).to.not.include(source);
  });
});
