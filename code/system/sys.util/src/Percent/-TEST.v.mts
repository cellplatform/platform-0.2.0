import { Percent } from '.';
import { describe, expect, it, type t } from '../test';

describe('Percent', () => {
  describe('toPercent', () => {
    it('bad input → 0', () => {
      const test = (input: any) => {
        expect(Percent.toPercent(input)).to.eql(0);
      };
      ['', '  ', 'foo', '5%%', [], {}, true].forEach(test);
    });

    it('numbers', () => {
      expect(Percent.toPercent(-1)).to.eql(0);
      expect(Percent.toPercent(0)).to.eql(0);
      expect(Percent.toPercent(0.123)).to.eql(0.123);
      expect(Percent.toPercent(1)).to.eql(1);
      expect(Percent.toPercent(1.000001)).to.eql(1);
      expect(Percent.toPercent(2)).to.eql(1);
    });

    it('strings', () => {
      const test = (input: string, expected: t.Percent) => {
        expect(Percent.toPercent(input)).to.eql(expected);
      };
      test('', 0);
      test('  0.3  ', 0.3);
      test(' 30% ', 0.3);
      test(' 45.1% ', 0.451);
    });
  });
});
