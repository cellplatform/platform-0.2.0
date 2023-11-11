import { describe, it, expect, type t } from '../test';
import { toObject } from './util';

describe('Util', () => {
  it('toObject', () => {
    const obj = { foo: [{ count: 1 }] };
    const res = toObject(obj);
    expect(res).to.eql(obj);
    expect(res).to.not.equal(obj);
  });

  it('toObject ← non {} param', () => {
    [undefined, null, 123, [], ''].forEach((value) => {
      expect(toObject(value)).to.eql({}, `${value}`);
    });
  });
});
