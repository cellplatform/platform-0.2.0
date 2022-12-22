import { describe, expect, it } from '../test/index.mjs';
import { maybeWait, Promise } from './Promise.mjs';

describe('Promise', () => {
  describe('maybeWait', () => {
    type T = { count: number };
    const fn1 = (): T => ({ count: 1 });
    const fn2 = async (): Promise<T> => ({ count: 2 });

    it('sync', async () => {
      const res = await maybeWait(fn1());
      expect(res).to.eql({ count: 1 });
    });

    it('async', async () => {
      const res = await maybeWait(fn2());
      expect(res).to.eql({ count: 2 });
    });

    it('exposed from Promise', () => {
      expect(Promise.maybeWait).to.equal(maybeWait);
    });
  });
});
