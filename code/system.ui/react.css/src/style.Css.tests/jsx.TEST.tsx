import React from 'react';

import { describe, it, expect, t, css } from '../test';

describe('JSX', () => {
  it('applied to <div>', () => {
    const style = css({ Size: 123 });
    const el = <div {...style}>Hello</div>;
    expect(React.isValidElement(el)).to.eql(true);
  });

  it('media queries', () => {
    const style = css({ '@media (max-width: 1100px)': { opacity: 0.1 } });
    const el = <div {...style}>Hello</div>;
    expect(React.isValidElement(el)).to.eql(true);
  });
});
