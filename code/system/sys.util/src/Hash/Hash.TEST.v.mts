import { describe, expect, it } from '../test';
import { Hash } from '.';

const circular: any = { foo: 123 };
circular.ref = circular;

describe('hash', () => {
  it('sha256', () => {
    const test = (input: any, expected: string) => {
      const res1 = Hash.sha256(input);
      const res2 = Hash.sha256(input, { prefix: false });

      // console.log(res1.substring(res1.length - 10));

      expect(res1).to.match(/^sha256-/);
      expect(res2).to.not.match(/^sha256-/);

      expect(res1).to.match(new RegExp(`${expected}$`));
      expect(res2).to.match(new RegExp(`${expected}$`));
    };

    test(new TextEncoder().encode('hello'), '62938b9824');
    test('hello', 'ff3f354e7a');
    test(123, 'f7f7a27ae3');
    test('', 'a03d82e126');
    test({ msg: 'abc' }, '43991ca7b7');
    test({ foo: 123 }, '3c8235fbf9');
    test(new Uint8Array([21, 31]).buffer, 'ba420bd4bd'); // NB: Not converted to string first.
    test(undefined, '359aa9950c');
    test(null, '92f982b90b');
    test({}, 'f61caaff8a');
    test(circular, 'd5a63d31fd');
    test([], '161202b945');
    test([1, { item: 2 }], 'a6a2f3f837');
    test([1, circular], 'aa35da71e7');
    test(true, 'b44867e12b');
    test(false, '245224f8aa');
    test(123, 'f7f7a27ae3');
    test(BigInt(9999), '456a506e05');
    test(Symbol('foo'), 'b4f8db9f3e');
    test((i: number) => i, 'fd3fbf2906');
  });

  it('shorten', () => {
    const hash = 'sha256-1234567890';
    const res = Hash.shorten(hash, 3, { trimPrefix: true });
    expect(res).to.eql('123 .. 890');
  });
});
