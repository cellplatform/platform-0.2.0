import { Is, describe, expect, it, type t, rx } from '../test';
import { PatchState } from '.';

describe('PatchState', () => {
  type T = { label: string };
  const initial: T = { label: 'foo' };

  describe('init', () => {
    it('init: (default)', (e) => {
      const state = PatchState.init<T>({ initial });
      const value = state.current;
      expect(value).to.eql(initial);
      expect(state.current).to.equal(value); // NB: no change, same instance.
    });

    it('init: specified {initial}', (e) => {
      const state = PatchState.init({ initial });
      const value = state.current;
      expect(value).to.eql({ label: 'foo' });
      expect(state.current).to.equal(value); // NB: no change, same instance.
    });

    it('init: instance { id }', (e) => {
      const state1 = PatchState.init({ initial });
      const state2 = PatchState.init({ initial });
      expect(state1.instance).to.not.eql(state2.instance);
    });
  });

  describe('change', () => {
    it('change', (e) => {
      const state = PatchState.init({ initial });

      const before = state.current;
      state.change((draft) => (draft.label = 'hello'));
      const after = state.current;

      expect(before.label).to.eql('foo');
      expect(after.label).to.eql('hello');
      expect(before).to.not.equal(after); // NB: different instance.
    });

    it('onChange (callback → patches)', (e) => {
      const fired: t.PatchChange<T>[] = [];
      const state = PatchState.init({
        initial,
        onChange: (e) => fired.push(e),
      });

      state.change((draft) => (draft.label = 'hello'));

      expect(fired.length).to.eql(1);
      expect(fired[0].op).to.eql('update');
      expect(fired[0].from).to.eql({ label: 'foo' });
      expect(fired[0].to).to.eql({ label: 'hello' });
      expect(fired[0].patches.next.length).to.eql(1);
    });
  });

  describe('events → default', () => {
    it('distinct instances', () => {
      const state = PatchState.init({ initial });
      const events1 = state.events();
      const events2 = state.events();
      expect(events1).to.not.equal(events2);
    });

    it('fires patch/change event', () => {
      const state = PatchState.init({ initial });
      const fired: t.PatchChange<T>[] = [];
      const events = state.events();
      events.$.subscribe((e) => fired.push(e));

      state.change((draft) => (draft.label = 'hello'));
      expect(fired.length).to.eql(1);
      expect(fired[0].op).to.eql('update');
      expect(fired[0].from).to.eql({ label: 'foo' });
      expect(fired[0].to).to.eql({ label: 'hello' });
      expect(fired[0].patches.next.length).to.eql(1);
    });

    it('dispose() ← via method', () => {
      const state = PatchState.init({ initial });
      const fired: t.PatchChange<T>[] = [];
      const events = state.events();
      events.$.subscribe((e) => fired.push(e));
      events.dispose();
      state.change((draft) => (draft.label = 'hello'));
      expect(fired.length).to.eql(0);
    });

    it('dispose$ ← via observable', () => {
      const state = PatchState.init({ initial });
      const fired: t.PatchChange<T>[] = [];
      const dispose$ = rx.subject();
      const events = state.events(dispose$);
      events.$.subscribe((e) => fired.push(e));
      dispose$.next();
      state.change((draft) => (draft.label = 'hello'));
      expect(fired.length).to.eql(0);
    });
  });

  describe('events → injected', () => {
    type E = {
      disposed: boolean;
      change$: t.Observable<T>;
    };

    type TFactory = t.PatchStateEventFactory<T, E>;
    const exampleFactory: TFactory = ($, dispose$) => {
      const life = rx.lifecycle(dispose$);
      return {
        change$: $.pipe(rx.map((e) => e.to)),
        get disposed() {
          return life.disposed; // NB: typically you'd implement a complete [t.Lifecycle] interface.
        },
      };
    };

    it('init (via injected factory)', () => {
      let count = 0;
      const events: TFactory = ($, dispose$) => {
        count++;
        return exampleFactory($, dispose$);
      };

      const state = PatchState.init<T, E>({ initial, events });
      const res = state.events();

      expect(count).to.eql(1);
      expect(Is.observable(res.change$)).to.eql(true);
      expect(res.disposed).to.eql(false);

      expect(state.events()).to.not.equal(res); // NB: different instances.
      expect(state.events()).to.not.equal(res);
      expect(count).to.eql(3);
    });

    it('dispose', () => {
      const events: TFactory = ($, dispose$) => exampleFactory($, dispose$);
      const state = PatchState.init<T, E>({ initial, events });

      const dispose$ = rx.subject();
      const res = state.events(dispose$);

      expect(res.disposed).to.eql(false);
      dispose$.next();
      expect(res.disposed).to.eql(true);
    });

    it('change$', () => {
      const events: TFactory = ($, dispose$) => exampleFactory($, dispose$);
      const state = PatchState.init<T, E>({ initial, events });
      const res = state.events();

      const fired: T[] = [];
      res.change$.subscribe((e) => fired.push(e));

      state.change((d) => (d.label = 'hello'));
      expect(fired[0].label).to.eql('hello');
    });
  });
});
