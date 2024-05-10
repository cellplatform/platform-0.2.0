import { t, expect, describe, it } from '../test';
import { Style } from '../index.mjs';

describe('padding', function () {
  it('PaddingX', () => {
    const res = Style.transform({
      PaddingX: 14,
      paddingLeft: 1234, // Overwritten.
    });
    expect(res.paddingLeft).to.equal(14);
    expect(res.paddingRight).to.equal(14);
  });

  it('PaddingY', () => {
    const res = Style.transform({ PaddingY: 20 });
    expect(res.paddingTop).to.equal(20);
    expect(res.paddingBottom).to.equal(20);
  });

  it('Padding (10)', () => {
    const res = Style.transform({ Padding: 20 });
    expect(res.paddingTop).to.equal(20);
    expect(res.paddingRight).to.equal(20);
    expect(res.paddingBottom).to.equal(20);
    expect(res.paddingLeft).to.equal(20);
  });

  it('Padding ([10, null, "5em", "30px"])', () => {
    const res = Style.transform({
      Padding: [10, null, '5em', '30px'],
    });
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
    });
    expect(res.marginLeft).to.equal(14);
    expect(res.marginRight).to.equal(14);
  });

  it('MarginY', () => {
    const res = Style.transform({ MarginY: 20 });
    expect(res.marginTop).to.equal(20);
    expect(res.marginBottom).to.equal(20);
  });

  it('Margin (10)', () => {
    const res = Style.transform({ Margin: 20 });
    expect(res.marginTop).to.equal(20);
    expect(res.marginRight).to.equal(20);
    expect(res.marginBottom).to.equal(20);
    expect(res.marginLeft).to.equal(20);
  });

  it('Margin ([10, null, "5em", "30px"])', () => {
    const res = Style.transform({ Margin: [10, null, '5em', '30px'] });
    expect(res.marginTop).to.equal(10);
    expect(res.marginRight).to.equal(undefined);
    expect(res.marginBottom).to.equal('5em');
    expect(res.marginLeft).to.equal(30);
  });
});

describe('size (width, height)', () => {
  type N = number | string | undefined;
  const test = (input: t.CssValue['Size'], width: N, height: N) => {
    const res = Style.transform({ Size: input });
    expect(res.width).to.equal(width);
    expect(res.height).to.equal(height);
  };

  it('nothing', () => {
    test(null, undefined, undefined);
    test(undefined, undefined, undefined);
    test('', undefined, undefined);
    test('  ', undefined, undefined);
    test([0] as any, undefined, undefined);
    test([] as any, undefined, undefined);
  });

  it('number', () => {
    test(50, 50, 50);
    test([50, 50], 50, 50);
    test([10, 20], 10, 20);
    test([10, 20, 999] as any, 10, 20);
  });

  it('string', () => {
    test('5em', '5em', '5em');
    test(['5em', '3px'], '5em', '3px');
    test(['5em', '3px', '99em'] as any, '5em', '3px');
  });

  it('mixed (string | number)', () => {
    test([5, '10em'], 5, '10em');
    test(['10em', 99], '10em', 99);
  });
});
