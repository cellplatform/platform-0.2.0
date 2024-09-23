import { Async, Time } from '../mod.ts';
import { describe, expect, it, type t } from '../-test.ts';

describe('Async', () => {
  it('exposes the Time.delay function', () => {
    expect(Async.delay).to.equal(Time.delay);
  });

  describe('retry', () => {
    const testSetup = (options: { failWhenLessThanCount?: number } = {}) => {
      const { failWhenLessThanCount } = options;
      let count = 0;
      const fn = () => {
        count++;
        if (typeof failWhenLessThanCount === 'number' && count <= failWhenLessThanCount) {
          throw new Error('foo');
        }
        return count;
      };
      return {
        fn,
        get count() {
          return count;
        },
      };
    };

    it('works first time', async () => {
      const test = testSetup();
      const res1 = await Async.retry(test.fn);
      const res2 = await Async.retry(async () => test.fn()); // NB: async response.
      expect(res1).to.eql(1);
      expect(res2).to.eql(2);
    });

    it('fails twice, then works', async () => {
      const test = testSetup({ failWhenLessThanCount: 2 });
      const res = await Async.retry(test.fn, { maxTimeout: 100, minTimeout: 10 });
      expect(res).to.eql(3);
    });
  });
});
