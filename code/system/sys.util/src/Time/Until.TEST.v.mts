import { Time } from '.';
import { rx } from '../Rx';
import { describe, expect, it } from '../test';

const now = () => new Date().getTime();

describe('until', () => {
  describe('delay', () => {
    it('completes ← (not disposed)', async () => {
      const { dispose$ } = rx.disposable();
      const startedAt = now();
      let count = 0;
      const time = Time.until(dispose$);

      expect(now() - startedAt).to.be.lessThan(8);
      await time.delay(10, () => (count += 1));

      expect(now() - startedAt).to.be.greaterThan(8);
      expect(count).to.eql(1);
    });

    it('does not complete ← (disposed$)', async () => {
      const { dispose, dispose$ } = rx.disposable();

      let count = 0;
      const time = Time.until(dispose$);
      expect(time.disposed).to.eql(false);

      const res = time.delay(10, () => (count += 1));
      dispose();

      await res;
      await Time.wait(20);

      expect(count).to.eql(0);
      expect(time.disposed).to.eql(true);
    });
  });
});
