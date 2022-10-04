import { expect, describe, it } from '../test/index.mjs';
import { Style } from '../index.mjs';

describe('padding', function () {
  it('PaddingX', () => {
    const res = Style.transform({
      PaddingX: 14,
      paddingLeft: 1234, // Overwritten.
    }) as any;
    expect(res.paddingLeft).to.equal(14);
    expect(res.paddingRight).to.equal(14);
  });

  it('PaddingY', () => {
    const res = Style.transform({
      PaddingY: 20,
    }) as any;
    expect(res.paddingTop).to.equal(20);
    expect(res.paddingBottom).to.equal(20);
  });

  it('Padding (10)', () => {
    const res = Style.transform({
      Padding: 20,
    }) as any;
    expect(res.paddingTop).to.equal(20);
    expect(res.paddingRight).to.equal(20);
    expect(res.paddingBottom).to.equal(20);
    expect(res.paddingLeft).to.equal(20);
  });

  it('Padding ([10, null, "5em", "30px"])', () => {
    const res = Style.transform({
      Padding: [10, null, '5em', '30px'],
    }) as any;
    expect(res.paddingTop).to.equal(10);
    expect(res.paddingRight).to.equal(undefined);
    expect(res.paddingBottom).to.equal('5em');
    expect(res.paddingLeft).to.equal(30);
  });
});

describe('margin', function () {
  it('MarginX', () => {
    const res = Style.transform({
      MarginX: 14,
      marginLeft: 1234, // Overwritten.
    }) as any;
    expect(res.marginLeft).to.equal(14);
    expect(res.marginRight).to.equal(14);
  });

  it('MarginY', () => {
    const res = Style.transform({
      MarginY: 20,
    }) as any;
    expect(res.marginTop).to.equal(20);
    expect(res.marginBottom).to.equal(20);
  });

  it('Margin (10)', () => {
    const res = Style.transform({
      Margin: 20,
    }) as any;
    expect(res.marginTop).to.equal(20);
    expect(res.marginRight).to.equal(20);
    expect(res.marginBottom).to.equal(20);
    expect(res.marginLeft).to.equal(20);
  });

  it('Margin ([10, null, "5em", "30px"])', () => {
    const res = Style.transform({
      Margin: [10, null, '5em', '30px'],
    }) as any;
    expect(res.marginTop).to.equal(10);
    expect(res.marginRight).to.equal(undefined);
    expect(res.marginBottom).to.equal('5em');
    expect(res.marginLeft).to.equal(30);
  });
});

describe('size (width, height)', () => {
  it('Size: number', () => {
    const res = Style.transform({ Size: 50 }) as any;
    expect(res.width).to.equal(50);
    expect(res.height).to.equal(50);
  });

  it('Size: string', () => {
    const res = Style.transform({ Size: '5em' }) as any;
    expect(res.width).to.equal('5em');
    expect(res.height).to.equal('5em');
  });
});
