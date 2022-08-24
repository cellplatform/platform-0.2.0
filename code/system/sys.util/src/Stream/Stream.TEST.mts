import { Stream } from './index.mjs';
import { expect } from 'chai';
import { t, Json } from './common.mjs';

describe.skip('ReadStream (web)', () => {
  describe('read (Uint8Array)', () => {
    it('json', async () => {
      const test = async (input: t.Json) => {
        const res = await Stream.toUint8Array(input);
        const text = new TextDecoder().decode(res);
        expect(text).to.eql(Json.stringify(input));
      };

      await test(undefined);
      await test(null);
      await test('hello');
      await test(1234);
      await test(true);
      await test([1, 2, 3]);
      await test({ foo: 123 });
    });
  });
});
