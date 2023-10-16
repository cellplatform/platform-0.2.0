import { Model } from '.';
import { describe, expect, it, slug, type t } from '../../test';

describe('LabelItem.Model', () => {
  describe('Model.Item.state', () => {
    describe('init', () => {
      it('defaults', () => {
        const state = Model.Item.state();
        expect(state.current).to.eql({});

        state.change((d) => (d.label = 'hello'));
        expect(state.current.label).to.eql('hello'); // NB: initial value.
      });

      it('{initial}', () => {
        const state = Model.Item.state({ label: 'foo' });
        expect(state.current.label).to.eql('foo'); // NB: initial value.
      });
    });

    describe('events', () => {
      it('init', () => {
        const state = Model.Item.state({ label: 'foo' });
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

      it('events.cmd.$ (command stream)', () => {
        const state = Model.Item.state({ label: 'foo' });
        const dispatch = Model.Item.commands(state);
        const events = state.events();

        const fired: t.LabelItemCmd[] = [];
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

  describe('Model.List.state', () => {
    describe('init', () => {
      it('defaults', () => {
        const state = Model.List.state();
        expect(state.current).to.eql({ total: 0 });
      });

      it('{initial}', () => {
        const getItem: t.GetLabelItem = (index) => [undefined, -1];
        const state = Model.List.state({ total: 123, getItem });
        expect(state.current).to.eql({ total: 123, getItem });
      });
    });

    describe('Model.List.array (helper)', () => {
      it('init ← {initial}', () => {
        const array1 = Model.List.array();
        const array2 = Model.List.array({ label: 'foo' });
        expect(array1.getItem(0)[0]?.current).to.eql({});
        expect(array2.getItem(0)[0]?.current).to.eql({ label: 'foo' });
      });

      it('init ← factory function', () => {
        const array = Model.List.array(() => Model.Item.state({ label: 'hello' }));
        expect(array.getItem(0)[0]?.current).to.eql({ label: 'hello' });
      });

      it('getItem ← from index', () => {
        const array = Model.List.array();
        const [item, index] = array.getItem(0);
        expect(item).to.equal(array.items[0]);
        expect(index).to.equal(0);
      });

      it('getItem ← from id', () => {
        const array = Model.List.array();
        const [itemA, indexA] = array.getItem(0);
        const [itemB, indexB] = array.getItem(itemA?.instance ?? '');
        expect(itemA).to.equal(itemB);
        expect(indexA).to.eql(indexB);
      });

      describe('helper props', () => {
        it('first', () => {
          const array = Model.List.array();
          expect(array.first).to.eql(undefined);
          const [item] = array.getItem(0);
          expect(array.first).to.equal(item);
        });

        it('last', () => {
          const array = Model.List.array();
          expect(array.last).to.eql(undefined);
          const [item] = array.getItem(9);
          expect(array.last).to.equal(item);
        });

        it('length', () => {
          const array = Model.List.array();
          expect(array.length).to.eql(0);
          array.getItem(9);
          expect(array.length).to.eql(10);
        });
      });
    });

    describe('items (fn)', () => {
      it('returns nothing: no getter function', () => {
        const state = Model.List.state();
        expect(state.current.getItem).to.eql(undefined);
        expect(Model.List.getItem(state, 0)).to.eql([undefined, -1]);
        expect(Model.List.getItem(state.current, 0)).to.eql([undefined, -1]);
      });

      it('returns nothing: no state param', () => {
        expect(Model.List.getItem(undefined, 0)).to.eql([undefined, -1]);
      });

      it('returns item from getter function', () => {
        const { items, getItem } = Model.List.array();
        const state = Model.List.state({ total: 2, getItem });

        const [itemA, indexA] = Model.List.getItem(state, 0);
        const [itemB, indexB] = Model.List.getItem(state.current, 1);

        expect(itemA).to.equal(items[0]);
        expect(itemB).to.equal(items[1]);
        expect([indexA, indexB]).to.eql([0, 1]);

        // NB: same instance (repeat call).
        expect(Model.List.getItem(state.current, 0)[0]).to.equal(itemA);
        expect(Model.List.getItem(state, 1)[0]).to.equal(itemB);
      });

      it('out of bounds', () => {
        const { items, getItem } = Model.List.array();
        const state = Model.List.state({ total: 1, getItem });
        expect(Model.List.getItem(state, -1)).to.eql([undefined, -1]);
        expect(Model.List.getItem(state, 2)).to.eql([undefined, -1]);
        expect(items).to.eql([]); // NB: no models instantiated.
      });
    });

    describe('events', () => {
      it('init', () => {
        const state = Model.List.state();
        const events = state.events();

        const fired: t.PatchChange<t.LabelList>[] = [];
        events.$.subscribe((e) => fired.push(e));

        state.change((d) => (d.selected = 'abc'));
        expect(fired.length).to.eql(1);
        expect(fired[0].from.selected).to.eql(undefined);
        expect(fired[0].to.selected).to.eql('abc');

        events.dispose();
        state.change((d) => (d.selected = '...def'));
        expect(fired.length).to.eql(1); // NB: no change because disposed.
      });

      it('events.cmd.$ (command stream)', () => {
        const state = Model.List.state();
        const dispatch = Model.List.commands(state);
        const events = state.events();

        const fired: t.LabelListCmd[] = [];
        events.cmd.$.subscribe((e) => fired.push(e));

        const payload = { focus: true, tx: slug() };
        state.change((d) => (d.cmd = { type: 'List:Focus', payload }));
        expect(fired.length).to.eql(1);
        expect(state.current.cmd).to.eql({ type: 'List:Focus', payload });

        dispatch.focus();
        expect(fired.length).to.eql(2);

        events.dispose();
      });
    });
  });

  describe('Model.data', () => {
    type StateRef = t.ImmutableRef<any, any>;

    it('field undefined (by default)', () => {
      const item = Model.Item.state();
      const list = Model.List.state();
      expect(item.current.data).to.eql(undefined);
      expect(list.current.data).to.eql(undefined);
    });

    it('no mutation ← read a non-proxy', () => {
      const test = (state: StateRef) => {
        type T = { count?: number };
        const res1 = Model.data<T>(state.current);
        const res2 = Model.data<T>(state.current, { count: 123 });
        const res3 = Model.data<T>(state, { count: 123 });
        expect(state.current.data).to.eql(undefined); // NB: no chance to underlying object.
        expect(res1).to.eql({});
        expect(res2).to.eql({ count: 123 });
        expect(res3).to.eql({ count: 123 });
      };

      test(Model.Item.state());
      test(Model.List.state());
    });

    it('no mutation ← convert from [ItemState] → [Item]', () => {
      const test = (state: StateRef) => {
        type T = { count?: number };
        state.change((d) => (d.data = { count: 123 }));
        expect(state.current.data).to.eql({ count: 123 });
        expect(Model.data<T>(state)).to.eql({ count: 123 });
      };

      test(Model.Item.state());
      test(Model.List.state());
    });

    it('mutates: State.data', () => {
      const test = (state: StateRef) => {
        type T = { count?: number };
        state.change((d) => Model.data<T>(d));
        expect(state.current.data).to.eql({});

        state.change((d) => (Model.data<T>(d).count = 123));
        expect(state.current.data?.count).to.eql(123);
      };

      test(Model.Item.state());
      test(Model.List.state());
    });

    it('mutates: State.data → default {object}', () => {
      const test = (state1: StateRef, state2: StateRef) => {
        type T = { count: number };
        const initial: T = { count: 0 };

        state1.change((d) => Model.data<T>(d, initial));
        state2.change((d) => (Model.data<T>(d, initial).count = 123));

        expect(state1.current.data?.count).to.eql(0);
        expect(state2.current.data?.count).to.eql(123);
      };

      test(Model.Item.state(), Model.Item.state());
      test(Model.List.state(), Model.List.state());
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
