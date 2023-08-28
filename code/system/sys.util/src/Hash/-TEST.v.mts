import { describe, expect, it } from '../test';
import { Hash } from '.';

const circular: any = { foo: 123 };
circular.ref = circular;

import { sha256 } from '@noble/hashes/sha256';

describe('hash', () => {
  it.only('toBytes', () => {
    const res = Hash.toBytes('hello');
    console.log('res', res);

    const h = sha256(res);
  });

  it('TMP', () => {
    const test = (input: any, expected: string) => {
      const res = Hash.sha256(input);

      console.log('res1', res);
    };

    test('foo', '');
  });

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

  it('sha1', () => {
    const test = (input: any, expected: string) => {
      const res1 = Hash.sha1(input);
      const res2 = Hash.sha1(input, { prefix: false });

      // console.log(res1.substring(res1.length - 10));

      expect(res1).to.match(/^sha1-/);
      expect(res2).to.not.match(/^sha1-/);

      expect(res1).to.match(new RegExp(`${expected}$`));
      expect(res2).to.match(new RegExp(`${expected}$`));
    };

    test(new TextEncoder().encode('hello'), 'd9aea9434d');
    test('hello', '5d06f9d0c4');
    test(123, '5ecbdbbeef');
    test('', '9e1ecb2585');
    test({ msg: 'abc' }, 'bd818251c2');
    test({ foo: 123 }, 'f3b5753ac0');
    test(new Uint8Array([21, 31]).buffer, 'b23dece0d3'); // NB: Not converted to string first.
    test(undefined, 'a24b69856e');
    test(null, '65032d6833');
    test({}, '0917b2202f');
    test(circular, '326953447b');
    test([], '302a97674c');
    test([1, { item: 2 }], '488d93ac98');
    test([1, circular], '6705b3f7e6');
    test(true, 'fc8ada44db');
    test(false, 'e14d12cb04');
    test(123, '5ecbdbbeef');
    test(BigInt(9999), '482c1bd594');
    test(Symbol('foo'), '902ba95c2a');
    test((i: number) => i, '40de1fa8e1');
  });

  it('shorten', () => {
    const hash = 'sha256-1234567890';
    const res = Hash.shorten(hash, 3, { trimPrefix: true });
    expect(res).to.eql('123 .. 890');
  });
});
