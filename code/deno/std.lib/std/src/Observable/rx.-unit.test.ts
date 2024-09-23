import { describe, expect, it } from '../common.ts';
import { rx, Rx } from './mod.ts';

describe('Observable/rx', () => {
  it('dual cased names', () => {
    expect(Rx).to.equal(rx);
  });

  describe('rx.subject (factory)', () => {
    it('void', () => {
      let fired = 0;
      const subject = rx.subject();

      subject.subscribe(() => fired++);
      subject.next();
      expect(fired).to.eql(1);

      subject.complete();
      subject.next();
      expect(fired).to.eql(1);
    });

    it('<T>', () => {
      type T = { type: string };
      const subject = rx.subject<T>();
      const fired: T[] = [];
      subject.subscribe((e) => fired.push(e));
      subject.next({ type: 'foo' });
      expect(fired[0]).to.eql({ type: 'foo' });
    });
  });

  describe('rx.event | rx.payload', () => {
    type FooEvent = { type: 'TYPE/foo'; payload: Foo };
    type Foo = { count: number };

    type BarEvent = { type: 'TYPE/bar'; payload: Bar };
    type Bar = { msg: string };

    it('rx.event', () => {
      const source$ = rx.subject<FooEvent | BarEvent>();

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
      const source$ = rx.subject<FooEvent | BarEvent>();

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
      expect(Rx.Is.event(input)).to.eql(expected);
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
        expect(rx.Is.event(input, type)).to.eql(expected);
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
});
