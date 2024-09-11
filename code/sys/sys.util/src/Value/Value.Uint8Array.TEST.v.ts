import { Value } from '.';
import { describe, expect, it } from '../test';

describe('Value.Uint8Array', () => {
  describe('Uint8Array.eql', () => {
    it('empty', () => {
      const a = Uint8Array.from([]);
      const b = Uint8Array.from([]);
      expect(Value.Uint8Array.eql(a, b)).to.eql(true);
    });

    it('equal', () => {
      const a = Uint8Array.from([1, 2, 3]);
      const b = Uint8Array.from([1, 2, 3]);
      expect(Value.Uint8Array.eql(a, b)).to.eql(true);
    });

    it('not equal', () => {
      const a = Uint8Array.from([1, 2, 3]);
      const b = Uint8Array.from([1, 2]);
      expect(Value.Uint8Array.eql(a, b)).to.eql(false);
    });
  });
});
