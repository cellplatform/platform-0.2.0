import { Stream } from '.';
import { expect, describe, it } from '../test';
import { t, Json } from './common';

describe('Stream', () => {
  describe('toUint8Array( )', () => {
    it('json | [undefined]', async () => {
      const test = async (input: t.Json | undefined, expected: any) => {
        const binary = await Stream.toUint8Array(input);
        const decoded = new TextDecoder().decode(binary);
        expect(decoded).to.eql(expected);
      };

      await test(undefined, ''); // NB: Not JSON
      await test(null, 'null'); //  NB: Valid JSON

      await test('text', 'text');
      await test(1234, '1234');
      await test(true, 'true');
      await test(false, 'false');

      await test([1, 2, 3], Json.stringify([1, 2, 3]));
      await test({ foo: 123 }, Json.stringify({ foo: 123 }));
    });
  });
});
