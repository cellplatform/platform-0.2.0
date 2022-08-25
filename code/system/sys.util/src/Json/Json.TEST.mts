import { expect } from '../TEST/index.mjs';
import { Json } from './index.mjs';

describe('Json', () => {
  describe('stringify', () => {
    it('converts to string with double-spaces and end char-return', () => {
      const obj = { foo: 123 };
      const res = Json.stringify(obj);

      expect(res).to.include('  "foo":');
      expect(res[res.length - 1]).to.eql('\n');
      expect(res[res.length - 2]).to.eql('}');
    });
  });
});
