import { describe, expect, it } from '../test.ts';
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
});
