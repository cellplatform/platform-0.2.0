import { Http } from '.';
import { describe, expect, it } from '../test';

describe('Http', () => {
  describe('Http.Is (flags)', () => {
    it('Is.nativeHeaders', () => {
      const test = (input: any, expected: boolean) => {
        expect(Http.Is.nativeHeaders(input)).to.eql(expected, input);
      };
      test(new Headers(), true);
      [null, 0, [], {}, true, ''].forEach((v) => test(v, false));
    });

    it('Is.methods', async () => {
      const test = (input: any, expected: boolean) => {
        expect(Http.Is.methods(input)).to.eql(expected, input);
      };
      test(Http.methods(), true);
      [null, 0, [], {}, true, ''].forEach((v) => test(v, false));
    });
  });
});
