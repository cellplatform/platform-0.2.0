import { describe, expect, it, slug, type t } from '../../test';

import { Model } from '.';

describe('LabelItem: Model', () => {
  describe('Model.item', () => {
    it('init', () => {
      const state = Model.item({ label: 'foo' });
      expect(state.current.label).to.eql('foo'); // NB: initial value.

      state.change((d) => (d.label = 'hello'));
      expect(state.current.label).to.eql('hello'); // NB: initial value.
    });

    describe('events', () => {
      it('init', () => {
        const state = Model.item({ label: 'foo' });
        const events = state.events();
        expect(state.current.label).to.eql('foo'); // NB: initial value.

        const fired: t.PatchChange<t.LabelItem>[] = [];
        events.$.subscribe((e) => fired.push(e));

        state.change((d) => (d.label = 'hello'));
        expect(fired.length).to.eql(1);
        expect(fired[0].from.label).to.eql('foo');
        expect(fired[0].to.label).to.eql('hello');

        events.dispose();
        state.change((d) => (d.label = 'foobar'));
        expect(fired.length).to.eql(1); // NB: no change because disposed.
      });

      it('events.cmd$ (command stream)', () => {
        const state = Model.item({ label: 'foo' });
        const dispatch = Model.commands(state);
        const events = state.events();

        const fired: t.LabelItemCommand[] = [];
        events.cmd.$.subscribe((e) => fired.push(e));

        const tx = slug();
        state.change((d) => (d.cmd = { type: 'Item:Clipboard', payload: { action: 'Copy', tx } }));
        expect(fired.length).to.eql(1);
        expect(state.current.cmd).to.eql({
          type: 'Item:Clipboard',
          payload: { action: 'Copy', tx },
        });

        dispatch.clipboard('Paste');
        expect(fired.length).to.eql(2);
        expect((state.current.cmd?.payload as t.LabelItemClipboard).action).to.eql('Paste');

        events.dispose();
      });
    });
  });

  describe('State.data', () => {
    it('undefined (by default)', () => {
      const state = Model.item();
      expect(state.current.data).to.eql(undefined);
    });

    it('no mutation ← read a non-proxy', () => {
      type T = { count?: number };
      const state = Model.item();
      const res1 = Model.data<T>(state.current);
      const res2 = Model.data<T>(state.current, { count: 123 });

      expect(state.current.data).to.eql(undefined); // NB: no chance to underlying object.
      expect(res1).to.eql({});
      expect(res2).to.eql({ count: 123 });
    });

    it('no mutation ← convert from [ItemState] → [Item]', () => {
      type T = { count?: number };
      const state = Model.item();
      state.change((d) => (d.data = { count: 123 }));
      expect(state.current.data).to.eql({ count: 123 });

      const res = Model.data<T>(state);
      expect(res).to.eql({ count: 123 });
    });

    it('mutates: State.data', () => {
      type T = { count?: number };
      const state = Model.item();

      state.change((d) => Model.data<T>(d));
      expect(state.current.data).to.eql({});

      state.change((d) => (Model.data<T>(d).count = 123));
      expect(state.current.data?.count).to.eql(123);
    });

    it('mutates: State.data → default {object}', () => {
      type T = { count: number };
      const initial: T = { count: 0 };
      const state1 = Model.item();
      const state2 = Model.item();

      state1.change((d) => Model.data<T>(d, initial));
      state2.change((d) => (Model.data<T>(d, initial).count = 123));

      expect(state1.current.data?.count).to.eql(0);
      expect(state2.current.data?.count).to.eql(123);
    });

    it('throw: input not object', () => {
      const inputs = [null, undefined, '', 123, false, []];
      inputs.forEach((value) => {
        const fn = () => Model.data(value as any);
        expect(fn).to.throw(/Not an object/);
      });
    });
  });
});
