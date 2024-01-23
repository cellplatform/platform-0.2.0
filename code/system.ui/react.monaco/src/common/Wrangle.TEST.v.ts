import { describe, it, expect, t, DEFAULTS } from '../test';
import { Wrangle } from './Wrangle';

const { NULL_RANGE } = DEFAULTS;

describe('Wrangle', () => {
  describe('asRange', () => {
    it('null', () => {
      expect(Wrangle.asRange(null)).to.eql(NULL_RANGE);
    });

    it('[1, 5] - single character', () => {
      const res = Wrangle.asRange([1, 5]);
      expect(res).to.eql({
        startLineNumber: 1,
        startColumn: 5,
        endLineNumber: 1,
        endColumn: 5,
      });
    });

    it('[1, 5, 2, 3] - span', () => {
      const res = Wrangle.asRange([1, 5, 2, 3]);
      expect(res).to.eql({
        startLineNumber: 1,
        startColumn: 5,
        endLineNumber: 2,
        endColumn: 3,
      });
    });

    it('{ Range } object', () => {
      const SAMPLE: t.EditorRange = {
        startLineNumber: -1,
        startColumn: -1,
        endLineNumber: -1,
        endColumn: -1,
      };

      const res1 = Wrangle.asRange(NULL_RANGE);
      const res2 = Wrangle.asRange(SAMPLE);

      expect(res1).to.eql(NULL_RANGE);
      expect(res2).to.eql(SAMPLE);

      expect(res1).to.not.equal(NULL_RANGE);
      expect(res2).to.not.equal(SAMPLE);
    });
  });
});
