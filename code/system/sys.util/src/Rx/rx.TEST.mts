import { expect } from 'chai';
import { Subject } from 'rxjs';

import { rx } from '.';

describe('rx', () => {
  describe('exports', () => {
    it('rx.pump', () => {
      expect(typeof rx.pump.create === 'function').to.equal(true);
      expect(typeof rx.pump.connect === 'function').to.equal(true);
    });
  });

  describe('rx.event | rx.payload', () => {
    type FooEvent = { type: 'TYPE/foo'; payload: Foo };
    type Foo = { count: number };

    type BarEvent = { type: 'TYPE/bar'; payload: Bar };
    type Bar = { msg: string };

    it('rx.event', () => {
      const source$ = new Subject<FooEvent | BarEvent>();

      const fired: FooEvent[] = [];
      rx.event<FooEvent>(source$, 'TYPE/foo').subscribe((e) => fired.push(e));

      source$.next({ type: 'TYPE/bar', payload: { msg: 'hello' } });
      source$.next({ type: 'TYPE/foo', payload: { count: 123 } });
      source$.next({ type: 'TYPE/bar', payload: { msg: 'hello' } });

      expect(fired.length).to.eql(1);
      expect(fired[0].type).to.eql('TYPE/foo');
      expect(fired[0].payload).to.eql({ count: 123 });
    });

    it('rx.payload', () => {
      const source$ = new Subject<FooEvent | BarEvent>();

      const fired: Foo[] = [];
      rx.payload<FooEvent>(source$, 'TYPE/foo').subscribe((e) => fired.push(e));

      source$.next({ type: 'TYPE/bar', payload: { msg: 'hello' } });
      source$.next({ type: 'TYPE/foo', payload: { count: 123 } });
      source$.next({ type: 'TYPE/bar', payload: { msg: 'hello' } });

      expect(fired.length).to.eql(1);
      expect(fired[0]).to.eql({ count: 123 });
    });
  });

  describe('rx.isEvent', () => {
    const test = (input: any, expected: boolean) => {
      expect(rx.isEvent(input)).to.eql(expected);
    };

    it('is an event', () => {
      test({ type: 'MyEvent', payload: {} }, true);
    });

    it('is not an event', () => {
      test(undefined, false);
      test(null, false);
      test(1, false);
      test(true, false);
      test('two', false);
      test({}, false);
      test({ type: 123, payload: {} }, false);
      test({ type: 'FOO' }, false);
      test({ type: 'FOO', payload: 123 }, false);
    });

    it('is an event of given type', () => {
      const test = (input: any, type: any, expected: boolean) => {
        expect(rx.isEvent(input, type)).to.eql(expected);
      };

      test(undefined, 'foo', false);
      test(null, 'foo', false);
      test(123, 'foo', false);
      test({}, 'foo', false);
      test({ type: 'foo', payload: {} }, 'bar', false);

      test({ type: 'foo', payload: {} }, 'foo', true);
      test({ type: 'foo/bar', payload: {} }, { startsWith: 'foo/bar' }, true);
      test({ type: 'foo/bar', payload: {} }, { startsWith: 'foo/' }, true);
      test({ type: 'foo/bar', payload: {} }, { startsWith: 'foo' }, true);

      test({ type: 'foo', payload: {} }, '  foo  ', false);
      test({ type: 'foo', payload: {} }, 123, false);
      test({ type: 'foo', payload: {} }, null, false);
      test({ type: 'foo', payload: {} }, {}, false);
      test({ type: 'foo/bar', payload: {} }, { startsWith: undefined }, false);
      test({ type: 'foo/bar', payload: {} }, { startsWith: null }, false);
    });
  });

  describe('rx.disposable', () => {
    it('method: dispose', () => {
      const { dispose$, dispose } = rx.disposable();

      let count = 0;
      dispose$.subscribe(() => count++);

      dispose();
      dispose();
      dispose();

      expect(count).to.eql(1); // NB: Multiple calls only fire the observable event once.
    });

    it('until$', () => {
      const until$ = new Subject<number>();
      const { dispose$ } = rx.disposable(until$);

      let count = 0;
      dispose$.subscribe(() => count++);

      expect(count).to.eql(0);

      until$.next(123);
      until$.next(456);
      expect(count).to.eql(1);
    });

    it('rx.done() - fires and completes the subject', () => {
      const dispose$ = new Subject<void>();

      let count = 0;
      dispose$.subscribe((e) => count++);

      rx.done(dispose$);
      rx.done(dispose$);
      rx.done(dispose$);

      expect(count).to.eql(1);
    });
  });

  describe('rx.asPromise', () => {
    type E = { type: 'foo'; payload: { count: number } };

    describe('first', () => {
      it('resolves first response', async () => {
        const $ = new Subject<E>();
        const promise = rx.asPromise.first<E>(rx.payload<E>($, 'foo'));

        $.next({ type: 'foo', payload: { count: 1 } });
        $.next({ type: 'foo', payload: { count: 2 } });
        $.next({ type: 'foo', payload: { count: 3 } });

        const res = await promise;
        expect(res.payload).to.eql({ count: 1 });
        expect(res.error).to.eql(undefined);
      });

      it('error: completed observable', async () => {
        const $ = new Subject<E>();
        $.complete();

        const res = await rx.asPromise.first<E>(rx.payload<E>($, 'foo'));

        expect(res.payload).to.eql(undefined);
        expect(res.error?.code).to.eql('completed');
        expect(res.error?.message).to.include('The given observable has already "completed"');
      });

      it('error: timeout', async () => {
        const $ = new Subject<E>();
        const res = await rx.asPromise.first<E>(rx.payload<E>($, 'foo'), { timeout: 10 });
        expect(res.payload).to.eql(undefined);
        expect(res.error?.code).to.eql('timeout');
        expect(res.error?.message).to.include('Timed out after 10 msecs');
      });

      it('error: timeout ("op")', async () => {
        const op = 'foobar';
        const $ = new Subject<E>();
        const res = await rx.asPromise.first<E>(rx.payload<E>($, 'foo'), { op, timeout: 10 });
        expect(res.payload).to.eql(undefined);
        expect(res.error?.code).to.eql('timeout');
        expect(res.error?.message).to.include('Timed out after 10 msecs');
        expect(res.error?.message).to.include(`[${op}]`);
      });
    });
  });
});
