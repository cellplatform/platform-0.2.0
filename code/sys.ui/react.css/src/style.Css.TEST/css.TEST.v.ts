import { expect, describe, it } from '../test';
import { css, Css } from '..';

describe('css', () => {
  it('is a function', () => {
    expect(css).to.be.an.instanceof(Function);
    expect(Css).to.be.an.instanceof(Function);
    expect(css).to.equal(Css);
  });

  it('css(...)', () => {
    const res = css({ fontFamily: 'sans-serif' });
    const key = Object.keys(res)[0];
    expect(key.startsWith('data-css-')).to.eql(true);
  });
});
