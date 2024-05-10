import { describe, expect, it, type t } from '../test';
import { Margin } from './Margin';

describe('Margin', () => {
  it('toArray', () => {
    expect(Margin.toArray(5)).to.eql([5, 5, 5, 5]);
    expect(Margin.toArray(undefined as any)).to.eql([0, 0, 0, 0]);
  });

  it('wrangle (input variants)', () => {
    const test = (input: t.MarginInput | undefined, expected: t.Margin) => {
      const res = Margin.wrangle(input);
      expect(res).to.eql(expected);
    };

    test(undefined, [0, 0, 0, 0]);
    test(0, [0, 0, 0, 0]);
    test([] as any, [0, 0, 0, 0]);
    test([5], [5, 5, 5, 5]);
    test([5, 0], [5, 0, 5, 0]);
    test([1, 2, 3, 4], [1, 2, 3, 4]);
  });

  it('wrangle (default value)', () => {
    const res = Margin.wrangle(undefined, 10);
    expect(res).to.eql([10, 10, 10, 10]);
  });
});
