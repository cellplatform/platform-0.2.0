import { describe, it, expect, type t } from '../../test';
import { TextboxSync } from '.';

describe('TextboxSync', () => {
  describe('Calc.diff', () => {
    const Calc = TextboxSync.Calc;
    it('no change', () => {

      const res = Calc.diff('foo', 'foo', 0);
      const res1 = Calc.firstDiff('foo', 'foo');
    });
  });
});
