import { Subject } from 'rxjs';
import { describe, expect, expectRoughlySame, it, type t } from '../test';
import { action, delay, wait } from './Delay.mjs';

const now = () => new Date().getTime();
const retry = 3;

describe(
  'delay',
  () => {
    it('delays then executes', async () => {
      const startedAt = now();
      let count = 0;

      expect(now() - startedAt).to.be.lessThan(8);
      await delay(10, () => (count += 1));

      expect(now() - startedAt).to.be.greaterThan(8);
      expect(count).to.eql(1);
    });

    it('does not fail when no callback is specified', async () => {
      const startedAt = now();
      expect(now() - startedAt).to.be.lessThan(8);
      await delay(10);
      expect(now() - startedAt).to.be.greaterThan(8);
    });

    it('cancels delay (await promise)', async () => {
      const startedAt = now();
      let count = 0;

      expect(now() - startedAt).to.be.lessThan(8);

      const res = delay(10, () => count++);
      expect(res.isCancelled).to.eql(false);
      expect(typeof res === 'object').to.eql(true);

      res.cancel();
      expect(res.isCancelled).to.eql(true);

      await res; // NB: Promise resolve upon cancel.
      expect(now() - startedAt).to.be.lessThan(8);
      expect(count).to.eql(0); // Callback not invoked.
    });

    it('returns value from callback', async () => {
      const res1 = await delay(5, () => undefined);
      const res2 = await delay(5, () => 123);
      expect(res1).to.eql(undefined);
      expect(res2).to.eql(123);
    });

    it('stores return value on callback', async () => {
      const res = delay(5, () => 123);
      expect(res.result).to.eql(undefined);
      await res;
      expect(res.result).to.eql(123);
    });
  },
  { retry },
);

describe('wait', () => {
  it('wait: msecs', async () => {
    const startedAt = now();
    expect(now() - startedAt).to.be.lessThan(10);
    await wait(15);
    expect(now() - startedAt).to.be.greaterThan(10);
  });

  it('wait: for observable', async () => {
    const startedAt = now();
    expect(now() - startedAt).to.be.lessThan(10);

    const ob$ = new Subject<void>();
    delay(15, () => ob$.next());

    await wait(ob$);
    expect(now() - startedAt).to.be.greaterThan(10);
  });
});

describe(
  'action',
  () => {
    it('start → complete', async () => {
      let fired: t.TimeDelayActionHandlerArgs[] = [];
      const timer = action(5).on((e) => fired.push(e));
      expect(timer.running).to.eql(false);

      await wait(10);
      expect(fired).to.eql([]);
      expect(timer.running).to.eql(false);

      timer.start();
      expect(timer.running).to.eql(true);
      expect(fired[0].action).to.eql('start');

      await wait(10);
      expect(fired.length).to.eql(2);
      expect(fired[1].action).to.eql('complete');
      expectRoughlySame(fired[1].elapsed, 5, 1.1, `elapsed: ${timer.elapsed}`);
      expect(timer.running).to.eql(false);
      expect(timer.elapsed).to.eql(-1);
    });

    it('start → (restart) → complete', async () => {
      let fired: t.TimeDelayActionHandlerArgs[] = [];
      const timer = action(10).on((e) => fired.push(e));
      expect(timer.running).to.eql(false);

      timer.start();
      expect(timer.running).to.eql(true);
      expect(fired[0].action).to.eql('start');

      const restart = async () => {
        expect(timer.running).to.eql(true);
        await wait(5);
        timer.start();
      };

      await restart();
      await restart();
      await restart();
      await restart();
      await restart();

      expect(timer.elapsed).to.greaterThan(20); // NB: well over the absolute delay of the timer.
      expect(timer.running).to.eql(true);

      // Wait for timeout.
      await wait(15);
      expect(timer.running).to.eql(false);
      expect(timer.elapsed).to.eql(-1);

      expect(fired.length).to.eql(7);
      expect(fired[0].action).to.eql('start');
      expect(fired[1].action).to.eql('restart');
      expect(fired[2].action).to.eql('restart');
      expect(fired[3].action).to.eql('restart');
      expect(fired[4].action).to.eql('restart');
      expect(fired[5].action).to.eql('restart');
      expect(fired[6].action).to.eql('complete');
    });

    it('start → clear', async () => {
      let fired: t.TimeDelayActionHandlerArgs[] = [];
      const timer = action(10).on((e) => fired.push(e));
      expect(timer.running).to.eql(false);

      timer.start();
      expect(timer.running).to.eql(true);
      await wait(3);
      timer.reset();
      expect(timer.running).to.eql(false);
      expect(timer.elapsed).to.eql(-1);

      await wait(20);
      expect(fired.length).to.eql(2);
      expect(fired[1].action).to.eql('reset');
      expectRoughlySame(fired[1].elapsed, 3, 1.1, `elapsed: ${timer.elapsed}`);
    });

    it('start → complete (forced early)', async () => {
      let fired: t.TimeDelayActionHandlerArgs[] = [];
      const timer = action(10).on((e) => fired.push(e));
      expect(timer.running).to.eql(false);

      timer.start();
      expect(timer.running).to.eql(true);
      await wait(3);
      timer.complete();
      timer.complete();
      timer.complete(); // NB: does not fire multiple times.
      expect(fired.length).to.eql(2);
      expect(fired[1].action).to.eql('complete');
      expectRoughlySame(fired[1].elapsed, 3, 1.1, `elapsed: ${timer.elapsed}`);
      expect(timer.running).to.eql(false);
      expect(timer.elapsed).to.eql(-1);

      await wait(20);
      expect(fired.length).to.eql(2); // NB: does not fire after timeout (cancelled).
    });

    it('specific handlers', async () => {
      let fired: t.TimeDelayActionHandlerArgs[] = [];
      const timer = action(5).on('complete', (e) => fired.push(e));
      expect(timer.running).to.eql(false);

      timer.start();
      await wait(10);

      expect(fired.length).to.eql(1);
      expect(fired[0].action).to.eql('complete');
    });
  },
  { retry },
);
