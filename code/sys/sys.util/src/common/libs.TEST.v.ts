import { describe, expect, it } from '../test';
import { R } from './libs';

const circular: any = { foo: 123 };
circular.ref = circular;

describe('libs', () => {
  it('R.toString', () => {
    const test = (input: any, expected: string) => {
      const res = R.toString(input);
      expect(res).to.eql(expected);
    };
    test(undefined, 'undefined');
    test(null, 'null');
    test({}, '{}');
    test({ foo: 123 }, '{"foo": 123}');
    test(circular, '{"foo": 123, "ref": <Circular>}');
    test([], '[]');
    test([1, 'two', { item: 3 }], '[1, "two", {"item": 3}]');
    test([1, circular], '[1, {"foo": 123, "ref": <Circular>}]');
    test(true, 'true');
    test(false, 'false');
    test(123, '123');
    test(BigInt(9999), '9999');
    test(Symbol('foo'), 'Symbol(foo)');
    test((input: string) => true, '(input) => true');
  });
});
