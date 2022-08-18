import { expect } from 'chai';
import { Value } from '.';

describe('compact', () => {
  it('makes no change', () => {
    expect(Value.compact([1, 2, 3])).to.eql([1, 2, 3]);
  });

  it('removes null values', () => {
    expect(Value.compact([1, null, 3, null])).to.eql([1, 3]);
  });

  it('removes undefined values', () => {
    expect(Value.compact([1, undefined, 3, undefined])).to.eql([1, 3]);
  });

  it('removes empty strings', () => {
    expect(Value.compact([1, '', 3])).to.eql([1, 3]);
  });

  it('retains `false` and 0', () => {
    expect(Value.compact([0, 1, false, 3])).to.eql([0, 1, false, 3]);
  });

  it('retains white space strings', () => {
    expect(Value.compact([0, 1, ' ', 3])).to.eql([0, 1, ' ', 3]);
  });
});

describe('flatten', () => {
  it('makes no change', () => {
    expect(Value.flatten([1, 2, 3])).to.eql([1, 2, 3]);
  });

  it('return input value if an array is not passed', () => {
    expect(Value.flatten(123)).to.eql(123);
  });

  it('flattens one level deep', () => {
    expect(Value.flatten([1, [2, 3]])).to.eql([1, 2, 3]);
  });

  it('flattens many levels deep', () => {
    expect(Value.flatten([1, [2, [3, [4, [5, 6]]]]])).to.eql([1, 2, 3, 4, 5, 6]);
  });
});

describe('asArray', () => {
  it('already array', () => {
    const input = [{ count: 1 }, { count: 2 }, { count: 3 }];
    const res = Value.asArray(input);
    expect(res).to.equal(input);
    expect(res[0].count).to.eql(1); // NB: Type inferred and returned.
  });

  it('convert to array', () => {
    const input = { count: 1 };
    const res = Value.asArray(input);
    expect(res.length).to.eql(1);
    expect(res).to.not.equal(input); // NB: Converted into an array
    expect(res[0]).to.equal(input);
    expect(res[0].count).to.eql(1); // NB: Type inferred and returned.
  });
});
