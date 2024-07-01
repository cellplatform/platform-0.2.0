import { describe, it, expect, type t } from '../test';
import { Time } from '../Time';
import { BusConnect } from './Rx.BusConnect';
import { rx } from '.';

describe('BusConnect', () => {
  type E = { type: 'foo'; payload: { count?: number } };

  it('throw: not enough buses', () => {
    const test = (input: t.EventBus[]) => {
      const fn = () => BusConnect(input);
      expect(fn).to.throw(/Must have at least two event-buses to setup connection/);
    };
    test([]);
    test([rx.bus()]);
  });

  it('connect: (3) buses ', async () => {
    const a = rx.bus<E>();
    const b = rx.bus<E>();
    const c = rx.bus<E>();
    BusConnect<E>([a, b, c]);

    const firedA: E[] = [];
    const firedB: E[] = [];
    const firedC: E[] = [];
    a.$.subscribe((e) => firedA.push(e));
    b.$.subscribe((e) => firedB.push(e));
    c.$.subscribe((e) => firedC.push(e));

    const event: E = { type: 'foo', payload: { count: 123 } };
    a.fire(event);

    expect(firedA).to.eql([event]);
    expect(firedB).to.eql([]);
    expect(firedC).to.eql([]);

    await Time.wait(10);
    expect(firedA).to.eql([event]);
    expect(firedB).to.eql([event]);
    expect(firedC).to.eql([event]);
  });

  it('async: true - default', async () => {
    const a = rx.bus<E>();
    const b = rx.bus<E>();
    BusConnect<E>([a, b]);

    const firedA: E[] = [];
    const firedB: E[] = [];
    a.$.subscribe((e) => firedA.push(e));
    b.$.subscribe((e) => firedB.push(e));

    const event: E = { type: 'foo', payload: { count: 123 } };
    a.fire(event);

    expect(firedA).to.eql([event]);
    expect(firedB).to.eql([]); // NB: Empty (because asynchronous)

    await Time.wait(10);
    expect(firedA).to.eql([event]);
    expect(firedB).to.eql([event]);
  });

  it('async: false (aka. synchronous)', async () => {
    const a = rx.bus<E>();
    const b = rx.bus<E>();
    BusConnect<E>([a, b], { async: false });

    const firedA: E[] = [];
    const firedB: E[] = [];
    a.$.subscribe((e) => firedA.push(e));
    b.$.subscribe((e) => firedB.push(e));

    const event: E = { type: 'foo', payload: { count: 123 } };
    a.fire(event);

    expect(firedA).to.eql([event]);
    expect(firedB).to.eql([event]); // NB: Has immediate value (because synchronous).
  });

  it('dispose: via { dispose$ } param', async () => {
    const { dispose, dispose$ } = rx.disposable();
    const a = rx.bus<E>();
    const b = rx.bus<E>();
    BusConnect<E>([a, b], { dispose$ });

    const firedA: E[] = [];
    const firedB: E[] = [];
    a.$.subscribe((e) => firedA.push(e));
    b.$.subscribe((e) => firedB.push(e));

    dispose();
    const event: E = { type: 'foo', payload: { count: 123 } };
    a.fire(event);
    a.fire(event);

    await Time.wait(10);
    expect(firedA).to.eql([event, event]);
    expect(firedB).to.eql([]);
  });

  it('dispose: via .dispose() method', async () => {
    const a = rx.bus<E>();
    const b = rx.bus<E>();
    const conn = BusConnect<E>([a, b]);

    const firedA: E[] = [];
    const firedB: E[] = [];
    a.$.subscribe((e) => firedA.push(e));
    b.$.subscribe((e) => firedB.push(e));

    conn.dispose();
    const event: E = { type: 'foo', payload: { count: 123 } };
    a.fire(event);
    a.fire(event);

    await Time.wait(10);
    expect(firedA).to.eql([event, event]);
    expect(firedB).to.eql([]);
  });
});
