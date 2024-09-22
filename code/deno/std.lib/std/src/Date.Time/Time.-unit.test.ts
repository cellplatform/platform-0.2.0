import { describe, expect, it } from '../common.ts';
import { Testing } from '../Testing/mod.ts';
import { Time } from '../mod.ts';

describe('Time', () => {
  const calcDiff = (a: Date, b: Date = new Date()) => b.getTime() - a.getTime();

  describe('Time.delay( n-milliseconds )', () => {
    it('TimeDelayPromise: response structure', () => {
      const res = Time.delay(0);
      expect(typeof res.cancel).to.eql('function');
      expect(res.is).to.eql({ cancelled: false, completed: false, done: false });
      expect(res.timeout).to.eql(0);
      res.cancel();
    });

    it('10ms, ()=>', async () => {
      let fired = 0;
      const startedAt = new Date();
      const res = Time.delay(30, () => fired++);
      expect(fired).to.eql(0);
      expect(res.is).to.eql({ cancelled: false, completed: false, done: false });
      expect(res.timeout).to.eql(30);
      await res;
      expect(fired).to.eql(1);
      expect(calcDiff(startedAt)).to.be.closeTo(30, 40);
      expect(res.is).to.eql({ cancelled: false, completed: true, done: true });
    });

    it('0ms, ()=>', async () => {
      let fired = 0;
      const startedAt = new Date();
      const res = Time.delay(0, () => fired++);
      expect(fired).to.eql(0);
      await res;
      expect(fired).to.eql(1);
      expect(calcDiff(startedAt)).to.be.closeTo(0, 10); // NB: closer to zero.
      expect(res.is).to.eql({ cancelled: false, completed: true, done: true });
      expect(res.timeout).to.eql(0);
    });

    it('()=> | ← handler only, defaults to 0:msecs', async () => {
      let fired = 0;
      const startedAt = new Date();
      const res = Time.delay(() => fired++);
      expect(fired).to.eql(0);
      await res;
      expect(fired).to.eql(1);
      expect(calcDiff(startedAt)).to.be.closeTo(0, 10); // NB: closer to zero.
      expect(res.is).to.eql({ cancelled: false, completed: true, done: true });
      expect(res.timeout).to.eql(0);
    });

    it('cancel', async () => {
      let fired = 0;
      const res = Time.delay(5, () => fired++);
      res.cancel();

      await Testing.wait(30);

      expect(fired).to.eql(0);
      expect(res.is).to.eql({ cancelled: true, completed: false, done: true });
    });
  });
});
