import { expect, describe, it } from '../test';
import { Value } from '.';
import { Time } from '../Time';

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

describe('asyncFilter', () => {
  it('filters (async)', async () => {
    const list = ['cat', 'hello cat', 'foobar'];
    const res = await Value.asyncFilter(list, async (value) => {
      await Time.wait(3);
      return value.includes('cat');
    });
    expect(res).to.eql(['cat', 'hello cat']);
  });
});
