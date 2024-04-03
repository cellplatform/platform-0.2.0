import { Http } from '.';
import { describe, expect, it } from '../test';

describe('Http', () => {
  describe('Http.Is', () => {
    it('Is.nativeHeaders', () => {
      const test = (input: any, expected: boolean) => {
        const res = Http.Is.nativeHeaders(input);
        expect(res).to.eql(expected, input);
      };
      test(new Headers(), true);
      [null, 0, [], {}, true, ''].forEach((v) => test(v, false));
    });
  });
});
