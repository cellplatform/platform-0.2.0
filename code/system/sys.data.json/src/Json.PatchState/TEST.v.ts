import { describe, expect, it, type t, rx } from '../test';
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

  describe('events', () => {
    it('distinct instances', () => {
      const state = PatchState.init({ initial });
      const events1 = state.events();
      const events2 = state.events();
      expect(events1).to.not.equal(events2);
    });

    it('fires change event', () => {
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
});
