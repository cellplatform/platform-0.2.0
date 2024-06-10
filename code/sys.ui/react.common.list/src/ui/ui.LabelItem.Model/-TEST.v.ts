import { Model } from '.';
import { Time, describe, expect, it, rx, slug, type t } from '../../test';

describe('LabelItem.Model', () => {
  describe('Model.Item.state', () => {
    describe('init', () => {
      it('init: defaults', () => {
        const state = Model.Item.state();
        expect(state.current).to.eql({});

        state.change((d) => (d.label = 'hello'));
        expect(state.current.label).to.eql('hello'); // NB: initial value.
      });

      it('init: {initial}', () => {
        const state = Model.Item.state({ label: 'foo' });
        expect(state.current.label).to.eql('foo'); // NB: initial value.
      });

      it('init: <type>', () => {
        const typename = 'foo.bar';
        const state1 = Model.Item.state({});
        const state2 = Model.Item.state({}, { typename });
        expect(state1.typename).to.eql(undefined);
        expect(state2.typename).to.eql(typename);
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
        expect(fired[0].before.label).to.eql('foo');
        expect(fired[0].after.label).to.eql('hello');

        events.dispose();
        state.change((d) => (d.label = 'foobar'));
        expect(fired.length).to.eql(1); // NB: no change because disposed.
      });

      it('init: state({ dispose$ })', () => {
        const { dispose, dispose$ } = rx.disposable();
        const state = Model.Item.state({ label: 'foo' }, { dispose$ });
        const events = state.events();
        expect(events.disposed).to.eql(false);
        dispose();
        expect(events.disposed).to.eql(true);
      });

      it('init: events(dispose$})', () => {
        const { dispose, dispose$ } = rx.disposable();
        const state = Model.Item.state({ label: 'foo' });
        const events = state.events(dispose$);
        expect(events.disposed).to.eql(false);
        dispose();
        expect(events.disposed).to.eql(true);
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

      it('events.item( id ).selected$', () => {
        const { dispose$, dispose } = rx.disposable();
        const array = Model.List.array({});
        const list = Model.List.state({ total: 3, getItem: array.getItem });
        const events = list.events();
        const foo = events.item('foo', dispose$);

        const fired: boolean[] = [];
        const firedDetail: t.LabelListEventsActiveChange[] = [];
        foo.selected$.subscribe((e) => fired.push(e));
        events.active.selected$.subscribe((e) => firedDetail.push(e));

        list.change((d) => (d.selected = 'foo'));
        list.change((d) => (d.selected = 'foo'));

        expect(fired[0]).to.eql(true);
        expect(firedDetail[0].selected).to.eql('foo');

        list.change((d) => (d.selected = 'bar'));
        expect(fired[1]).to.eql(false);
        expect(firedDetail[1].selected).to.eql('bar');

        dispose();
        list.change((d) => (d.selected = 'foo'));
        expect(fired.length).to.eql(2); // NB: no change
      });

      it('events.item( id ).focused$', () => {
        const { dispose$, dispose } = rx.disposable();
        const array = Model.List.array({});
        const list = Model.List.state({ total: 3, getItem: array.getItem });
        const events = list.events();
        const foo = events.item('foo', dispose$);

        const fired: boolean[] = [];
        const firedDetail: t.LabelListEventsActiveChange[] = [];
        foo.focused$.subscribe((e) => fired.push(e));
        events.active.focused$.subscribe((e) => firedDetail.push(e));

        list.change((d) => (d.selected = 'foo'));
        list.change((d) => (d.selected = 'foo'));

        expect(fired.length).to.eql(1);
        expect(fired[0]).to.eql(false);
        expect(firedDetail[0].focused).to.eql(false);

        list.change((d) => (d.focused = true));
        expect(fired[1]).to.eql(true);
        expect(firedDetail[1].focused).to.eql(true);

        list.change((d) => (d.selected = 'bar'));
        expect(fired[2]).to.eql(false);
        expect(firedDetail[2]).to.eql(undefined); // NB: global list focus state NOT changed.

        dispose();
      });
    });
  });

  describe('Model.List.state', () => {
    describe('init', () => {
      it('init: defaults', () => {
        const state = Model.List.state();
        expect(state.current.total).to.eql(0);
      });

      it('init: {initial}', () => {
        const getItem: t.GetLabelItem = (index) => [undefined, -1];
        const state = Model.List.state({ total: 123, getItem });
        expect(state.current).to.eql({ total: 123, getItem });
      });

      it('init: <type>', () => {
        const initial = { total: 0 };
        const typename = 'foo.bar';
        const state1 = Model.List.state(initial);
        const state2 = Model.List.state(initial, { typename });
        expect(state1.typename).to.eql(undefined);
        expect(state2.typename).to.eql(typename);
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

      it('getItem ← target: [index]', () => {
        const array = Model.List.array();
        const [item, index] = array.getItem(0);
        expect(item).to.equal(array.items[0]);
        expect(index).to.equal(0);
      });

      it('getItem ← target: "id"', () => {
        const array = Model.List.array();
        const [itemA, indexA] = array.getItem(0);
        const [itemB, indexB] = array.getItem(itemA?.instance ?? '');
        expect(itemA).to.equal(itemB);
        expect(indexA).to.eql(indexB);
      });

      it('getItem ← target: <undefined>', () => {
        const array = Model.List.array();
        const [item, index] = array.getItem(undefined);
        expect(item).to.eql(undefined);
        expect(index).to.eql(-1);
      });

      it('prop: first', () => {
        const array = Model.List.array();
        expect(array.first).to.eql(undefined);
        const [item] = array.getItem(0);
        expect(array.first).to.equal(item);
      });

      it('prop: last', () => {
        const array = Model.List.array();
        expect(array.last).to.eql(undefined);
        const [item] = array.getItem(9);
        expect(array.last).to.equal(item);
      });

      it('prop: length', () => {
        const array = Model.List.array();
        expect(array.length).to.eql(0);
        array.getItem(9);
        expect(array.length).to.eql(10);
      });

      it('map', () => {
        const array = Model.List.array();
        const res1 = array.map((item, index) => ({ item, index }));
        expect(res1).to.eql([]);

        array.getItem(2); // NB: expand the array to 3 items.
        const res2 = array.map((item) => item.instance);
        expect(res2.length).to.eql(3);
        expect(res2).to.eql(array.items.map((item) => item.instance));
      });

      it('fill', () => {
        const test = (total: number, expected = total) => {
          const array = Model.List.array().fill(total);
          const res = array.items.map((item) => item.instance).filter(Boolean);
          expect(res.length).to.eql(expected);
          expect(res).to.eql(array.items.map((item) => item.instance));
        };
        test(-1, 0);
        test(0);
        test(3);
      });

      describe('remove', () => {
        it('remove( <undefined> )', () => {
          const array = Model.List.array().fill(2);
          expect(array.length).to.eql(2);
          array.remove(undefined);
          expect(array.length).to.eql(2); // NB: no change.
        });

        it('remove: by [index]', () => {
          const array = Model.List.array().fill(5);
          expect(array.length).to.eql(5);
          const ids = array.map((item) => item.instance);

          array.remove(0);
          expect(array.length).to.eql(4);
          expect(array.getItem(0)[0]?.instance).to.eql(ids[1]);

          array.remove(2);
          expect(array.length).to.eql(3);
          expect(array.getItem(1)[0]?.instance).to.eql(ids[2]);
        });

        it('remove: by "id"', () => {
          const array = Model.List.array().fill(5);
          expect(array.length).to.eql(5);
          const ids = array.map((item) => item.instance);

          array.remove(ids[0]);
          expect(array.length).to.eql(4);
          expect(array.getItem(0)[0]?.instance).to.eql(ids[1]);

          array.remove(ids[2]);
          expect(array.length).to.eql(3);
          expect(array.getItem(0)[0]?.instance).to.eql(ids[1]);
        });
      });
    });

    describe('Model.List.getItem', () => {
      it('returns nothing: no getter function', () => {
        const state = Model.List.state();
        expect(state.current.getItem).to.eql(undefined);
        expect(Model.List.getItem(state, 0)).to.eql([undefined, -1]);
        expect(Model.List.getItem(state.current, 0)).to.eql([undefined, -1]);
      });

      it('returns nothing: no state param', () => {
        expect(Model.List.getItem(undefined, 0)).to.eql([undefined, -1]);
      });

      it('returns item from getter function: index', () => {
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

      it('returns item from getter function: ID (string)', () => {
        const { getItem } = Model.List.array();
        const state = Model.List.state({ total: 2, getItem });

        const [itemA, indexA] = Model.List.getItem(state, 0);
        const [itemB, indexB] = Model.List.getItem(state, itemA?.instance ?? '');

        expect(itemA).to.equal(itemB);
        expect(indexA).to.eql(indexB);
      });

      it('out of bounds', () => {
        const { items, getItem } = Model.List.array();
        const state = Model.List.state({ total: 1, getItem });
        expect(Model.List.getItem(state, -1)).to.eql([undefined, -1]);
        expect(Model.List.getItem(state, 2)).to.eql([undefined, -1]);
        expect(items).to.eql([]); // NB: no models instantiated.
      });
    });

    describe('Model.List.get', () => {
      const { items, getItem } = Model.List.array();
      const list = Model.List.state({ total: 3, getItem });
      const get = Model.List.get(list);
      Model.List.map(list, () => null); // NB: Ensure the list is populated.

      describe('get.item', () => {
        it('get.item ← from Index', () => {
          const test = (index: number, expected?: t.LabelItemState) => {
            expect(get.item(index)).to.equal(expected);
          };
          test(-1, undefined);
          test(0, items[0]);
          test(1, items[1]);
          test(2, items[2]);
          test(99, undefined);
        });

        it('get.item ← from "First" | "Last" (edge)', () => {
          const test = (input: t.LabelListEdge | undefined, expected?: t.LabelItemState) => {
            expect(get.item(input)).to.equal(expected);
          };
          test(undefined, undefined);
          test('First', items[0]);
          test('Last', items[2]);
        });

        it('get.item ← from "id" string', () => {
          const test = (input: string | undefined, expected?: t.LabelItemState) => {
            expect(get.item(input)).to.equal(expected);
          };
          test(undefined, undefined);
          test(items[0].instance, items[0]);
          test(items[1].instance, items[1]);
        });

        it('get.item ← from state (NB: completeness)', () => {
          expect(get.item(items[0])).to.eql(items[0]);
          expect(get.item(items[99])).to.eql(undefined);
        });

        it('get.item ← <nothing>', () => {
          expect(get.item(undefined)).to.eql(undefined);
          expect(get.item(null as any)).to.eql(undefined);
          expect(get.item('foobar')).to.eql(undefined);
          expect(get.item(999)).to.eql(undefined);
        });
      });

      describe('get.index', () => {
        it('get.index ← from [Item]', () => {
          const test = (input: t.LabelItemState | undefined, expected: number) => {
            expect(get.index(input)).to.equal(expected);
          };
          test(undefined, -1);
          test(items[0], 0);
          test(items[1], 1);
        });

        it('get.index ← from item "id" string', () => {
          const test = (input: string | undefined, expected: number) => {
            expect(get.index(input)).to.equal(expected);
          };
          test(undefined, -1);
          test(items[0].instance, 0);
          test(items[1].instance, 1);
        });

        it('get.index ← from "First" | "Last" (edge)', () => {
          const test = (input: t.LabelListEdge | undefined, expected: number) => {
            expect(get.index(input)).to.equal(expected);
          };
          test(undefined, -1);
          test('First', 0);
          test('Last', 2);
        });

        it('get.index ← from index (NB: completeness)', () => {
          expect(get.index(-1)).to.eql(-1);
          expect(get.index(0)).to.eql(0);
          expect(get.index(1)).to.eql(1);
        });

        it('get.index ← <nothing>', () => {
          expect(get.index(undefined)).to.eql(-1);
          expect(get.index(null as any)).to.eql(-1);
          expect(get.index('foobar')).to.eql(-1);
        });
      });

      it('throw: not an interger', () => {
        const err = /Index is not an integer/;
        expect(() => get.item(0.1)).to.throw(err);
        expect(() => get.index(0.1)).to.throw(err);
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
        expect(fired[0].before.selected).to.eql(undefined);
        expect(fired[0].after.selected).to.eql('abc');

        events.dispose();
        state.change((d) => (d.selected = '...def'));
        expect(fired.length).to.eql(1); // NB: no change because disposed.
      });

      it('init: state({ dispose$ })', () => {
        const { dispose, dispose$ } = rx.disposable();
        const state = Model.List.state(undefined, { dispose$ });
        const events = state.events();
        expect(events.disposed).to.eql(false);
        dispose();
        expect(events.disposed).to.eql(true);
      });

      it('init: events(dispose$})', () => {
        const { dispose, dispose$ } = rx.disposable();
        const state = Model.List.state();
        const events = state.events(dispose$);
        expect(events.disposed).to.eql(false);
        dispose();
        expect(events.disposed).to.eql(true);
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

      it('events.cmd.$ (custom commands)', async () => {
        const state = Model.List.state();
        const dispatch = Model.List.commands(state);
        const events = state.events();

        type Event = FooEvent | BarEvent;
        type FooEvent = { type: 'foo'; payload: { count: number } };
        type BarEvent = { type: 'bar'; payload: { msg?: string } };

        const fired1: t.LabelListCmd[] = [];
        const fired2: t.Event[] = [];
        const fired3: t.Event[] = [];
        events.cmd.$.subscribe((e) => fired1.push(e));
        events.cmd.filter<Event>((e) => e.type === 'bar').subscribe((e) => fired2.push(e));
        events.cmd.filter<Event>().subscribe((e) => fired3.push(e));

        const foo: FooEvent = { type: 'foo', payload: { count: 123 } };
        const bar: BarEvent = { type: 'bar', payload: { msg: 'hello' } };

        dispatch.cmd<Event>(foo);
        expect(state.current.cmd).to.eql(foo);
        await Time.wait(0);
        expect(state.current.cmd).to.eql(undefined);

        expect(fired1.length).to.eql(1);
        expect(fired2.length).to.eql(0); // NB: filtered.
        expect(fired3.length).to.eql(1);
        expect(fired1[0]).to.eql(foo);

        dispatch.cmd<Event>(bar);
        expect(fired2.length).to.eql(1); // NB: filtered.
        expect(fired3.length).to.eql(2);
        expect(fired2[0]).to.eql(bar);
        expect(fired3[0]).to.eql(foo);
        expect(fired3[1]).to.eql(bar);

        events.dispose();
      });
    });

    describe('map items', () => {
      it('empty | nothing', () => {
        const { getItem } = Model.List.array();
        const state = Model.List.state({ total: 0, getItem });
        const res1 = Model.List.map(state, (item, index) => ({ item, index }));
        const res2 = Model.List.map(undefined, (item, index) => ({ item, index }));
        expect(res1.length).to.eql(0);
        expect(res2.length).to.eql(0);
      });

      it('maps items (from state)', () => {
        const { items, getItem } = Model.List.array();
        const state = Model.List.state({ total: 2, getItem });
        expect(state.current.total).to.eql(2);

        const res = Model.List.map(state, (item, index, total) => ({ item, index, total }));
        expect(res.map(({ index }) => index)).to.eql([0, 1]);
        expect(res[0].total).to.equal(2);
        expect(res[0].item).to.equal(items[0]);
        expect(res[1].item).to.equal(items[1]);
      });

      it('maps items (from state.current)', () => {
        const { getItem } = Model.List.array();
        const state = Model.List.state({ total: 2, getItem });
        const res = Model.List.map(state.current, (item, index) => ({ item, index }));
        expect(res.map(({ index }) => index)).to.eql([0, 1]);
      });

      it('returns smaller result when [getItem] returns nothing', () => {
        const { items, getItem } = Model.List.array();
        const state = Model.List.state({
          total: 3,
          getItem(target) {
            if (target === 1) return [undefined, -1];
            return getItem(target);
          },
        });
        const res = Model.List.map(state, (item, index, total) => ({ item, index, total }));
        expect(state.current.total).to.eql(3);
        expect(res.length).to.eql(2);
        expect(res[0].total).to.equal(3); // NB: reports the total abstract list amount, not the lesser map size.
        expect(res[0].item).to.equal(items[0]);
        expect(res[1].item).to.equal(items[2]);
      });
    });
  });

  describe('Model.action', () => {
    type A = 'foo' | 'bar' | 'baz';

    it('exposed on Model and Model.Item', () => {
      expect(Model.action).to.be.a('function');
      expect(Model.action).to.equal(Model.Item.action);
    });

    it('no actions', () => {
      const item = Model.Item.state<A>();
      const res = Model.action(item, 'foo');
      expect(res).to.eql([]);
    });

    it('gets action', () => {
      const test = (input: t.LabelItem<A> | t.LabelItemState<A>) => {
        const foo = Model.action(input, 'foo');
        const bar = Model.action(input, 'bar');
        const baz = Model.action(input, 'baz');
        expect(foo).to.eql([{ kind: 'foo', enabled: false }, { kind: 'foo' }]);
        expect(bar).to.eql([{ kind: 'bar' }]);
        expect(baz).to.eql([]);
      };

      const item = Model.Item.state<A>({
        left: { kind: 'foo', enabled: false },
        right: [{ kind: 'foo' }, { kind: 'bar' }],
      });

      test(item);
      test(item.current);
    });

    it('within [change] function', () => {
      const item = Model.Item.state<A>({
        left: { kind: 'foo', enabled: false },
        right: [{ kind: 'foo' }, { kind: 'bar' }],
      });

      item.change((d) => {
        const [fooLeft, fooRight] = Model.action(d, 'foo');
        fooLeft.enabled = true;
        fooRight.spinning = true;
        Model.action(d, 'bar')[0].width = 350;
      });

      expect(item.current.left).to.eql({ kind: 'foo', enabled: true });
      expect(item.current.right).to.eql([
        { kind: 'foo', spinning: true },
        { kind: 'bar', width: 350 },
      ]);
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

  describe('Model.Is', () => {
    it('Is.state', () => {
      const state = Model.Item.state();
      expect(Model.Is.state(state)).to.eql(true);
      expect(Model.Is.state(state.current)).to.eql(false);
      [null, undefined, '', 123, false, [], {}].forEach((value) => {
        expect(Model.Is.state(value)).to.eql(false);
      });
    });

    it('Is.type', () => {
      const typename = 'foo.bar';

      const item1 = Model.Item.state();
      const item2 = Model.Item.state({}, { typename });
      const list1 = Model.List.state({ total: 0 });
      const list2 = Model.List.state({ total: 0 }, { typename });

      expect(Model.Is.type(item1, typename)).to.eql(false);
      expect(Model.Is.type(item2, typename)).to.eql(true);
      expect(Model.Is.type(list1, typename)).to.eql(false);
      expect(Model.Is.type(list2, typename)).to.eql(true);

      [null, undefined, '', 123, false, [], {}].forEach((value) => {
        expect(Model.Is.type(value, typename)).to.eql(false);
      });
    });
  });
});
