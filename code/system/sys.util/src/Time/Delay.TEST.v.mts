import { Subject } from 'rxjs';
import { describe, expect, it, type t } from '../test';
import { delay, wait, action } from './Delay.mjs';

const now = () => new Date().getTime();

describe('delay', () => {
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
});

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

describe('action', () => {
  it('start → complete', async () => {
    let fired: t.TimeDelayActionReason[] = [];
    const timer = action(5, (e) => fired.push(e.action));
    expect(timer.running).to.eql(false);

    await wait(10);
    expect(fired).to.eql([]);
    expect(timer.running).to.eql(false);

    timer.start();
    expect(timer.running).to.eql(true);
    await wait(10);
    expect(fired.length).to.eql(1);
    expect(fired[0]).to.eql('complete');
    expect(timer.running).to.eql(false);
  });

  it('start → clear', async () => {
    let fired: t.TimeDelayActionReason[] = [];
    const timer = action(10, (e) => fired.push(e.action));
    expect(timer.running).to.eql(false);

    timer.start();
    expect(timer.running).to.eql(true);
    await wait(3);
    timer.reset();
    expect(timer.running).to.eql(false);

    await wait(20);
    expect(fired.length).to.eql(1);
    expect(fired[0]).to.eql('reset');
  });

  it('start → complete (forced early)', async () => {
    let fired: t.TimeDelayActionReason[] = [];
    const timer = action(10, (e) => fired.push(e.action));
    expect(timer.running).to.eql(false);

    timer.start();
    expect(timer.running).to.eql(true);
    await wait(3);
    timer.complete();
    timer.complete();
    timer.complete(); // NB: does not fire multiple times.
    expect(fired.length).to.eql(1);
    expect(fired[0]).to.eql('complete');
    expect(timer.running).to.eql(false);

    await wait(20);
    expect(fired.length).to.eql(1); // NB: does not fire after timeout (cancelled).
  });
});
