import { expect, describe, it } from '../Test/index.mjs';
import { Delete } from './index.mjs';

describe('Delete', () => {
  describe('deleteUndefined', () => {
    it('retains existing values, removes undefined', () => {
      const res = Delete.undefined({
        nothing: undefined,
        yes: true,
        no: false,
        zero: 0,
        value: null,
        text: '',
      });

      expect(res).to.eql({
        yes: true,
        no: false,
        zero: 0,
        value: null,
        text: '',
      });
    });
  });

  describe('deleteEmpty', () => {
    it('deletes empty/undefined values', () => {
      const res = Delete.empty({
        nothing: undefined,
        yes: true,
        no: false,
        zero: 0,
        value: null,
        text: '',
      });
      expect(res).to.eql({
        yes: true,
        no: false,
        zero: 0,
        value: null,
      });
    });
  });
});
