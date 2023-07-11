import { CrdtLens } from '.';
import { Automerge, Crdt, Test, expect, type t } from '../test.ui';

export default Test.describe('Lens', (e) => {
  type TRoot = { msg?: string; child?: TChild };
  type TChild = { count: number; child?: TChild };

  const setup = () => {
    const initial: TRoot = {};
    const root = Crdt.ref<TRoot>('foo', initial);
    return { initial, root } as const;
  };

  const getDesendent: t.CrdtLensGetDescendent<TRoot, TChild> = (doc) => {
    // NB: If the child does not exist, it is written onto the object.
    //     Required for the CRDT to register the {root} subject
    //     prior to be handed to the lens mutator function
    return doc.child || (doc.child = { count: 0 });
  };

  e.describe('create', (e) => {
    e.it('CrdtLens.init', () => {
      const { root } = setup();
      const lens = CrdtLens.init<TRoot, TChild>(root, getDesendent);

      expect(lens.kind).to.eql('Crdt:Lens');
      expect(lens.root).to.equal(root);
      expect(lens.current).to.eql({ count: 0 });

      root.dispose();
    });

    e.it('Crdt.lens (← exposed as library entry)', () => {
      const { root } = setup();
      const lens = Crdt.lens<TRoot, TChild>(root, getDesendent);
      expect(lens.root).to.equal(root);
      root.dispose();
    });

    e.it('toObject', (e) => {
      const { root } = setup();
      const lens = Crdt.lens<TRoot, TChild>(root, getDesendent);

      expect(lens.toObject()).to.eql(lens.current);
      expect(lens.toObject()).to.not.equal(lens.current);
    });
  });

  e.describe('dispose', (e) => {
    e.it('disposes when root disposes', (e) => {
      const { root } = setup();
      const lens = CrdtLens.init<TRoot, TChild>(root, getDesendent);

      expect(lens.disposed).to.eql(false);
      expect(root.disposed).to.eql(false);

      root.dispose();

      expect(lens.disposed).to.eql(true);
      expect(root.disposed).to.eql(true);
    });

    e.it('disposes without effecting root', (e) => {
      const { root } = setup();
      const lens = CrdtLens.init<TRoot, TChild>(root, getDesendent);

      expect(lens.disposed).to.eql(false);
      expect(root.disposed).to.eql(false);

      lens.dispose();

      expect(lens.disposed).to.eql(true);
      expect(root.disposed).to.eql(false);

      root.dispose();
    });
  });

  e.describe('change', (e) => {
    e.it('lens descendent object does initially exist', () => {
      const root = Crdt.ref<TRoot>('foo', { child: { count: 0 } });
      const lens = CrdtLens.init<TRoot, TChild>(root, getDesendent);

      const res = lens.change((child) => (child.count = 123));
      expect(res).to.equal(lens);

      expect(lens.current.count).to.eql(123);
      expect(root.current.child?.count).to.eql(123);
      expect(root.history.length).to.eql(2);

      lens.change((child) => (child.count = 456));
      expect(lens.current.count).to.eql(456);
      expect(root.current.child?.count).to.eql(456);
      expect(root.history.length).to.eql(3);

      root.dispose();
    });

    e.it('lens descendent object does not initially exist (factory generated)', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      const lens = CrdtLens.init<TRoot, TChild>(root, getDesendent);

      const res = lens.change((child) => (child.count = 123));
      expect(res).to.equal(lens);

      expect(lens.current.count).to.eql(123);
      expect(root.current.child?.count).to.eql(123);
      expect(root.history.length).to.eql(2);

      root.dispose();
    });

    e.it('with/without message', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      const lens = CrdtLens.init<TRoot, TChild>(root, getDesendent);

      lens.change('hello', (child) => (child.count = 123));
      lens.change((child) => (child.count = 456));

      const history = root.history;
      expect(history.length).to.eql(3);

      expect(history[1].change.message).to.eql('hello');
      expect(history[2].change.message).to.eql(null);

      root.dispose();
    });
  });

  e.describe('$ (change)', (e) => {
    e.it('change events → descendent', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      const lens = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      const fired: t.CrdtLensChange<TRoot, TChild>[] = [];
      lens.$.subscribe((e) => fired.push(e));

      lens.change((d) => (d.count = 123));

      expect(fired.length).to.eql(1);
      expect(fired[0].doc.child?.count).to.eql(123);
      expect(fired[0].lens.count).to.eql(123);

      root.dispose();
    });

    e.it('change on root', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      const lens = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      const fired: t.CrdtLensChange<TRoot, TChild>[] = [];
      lens.$.subscribe((e) => fired.push(e));

      root.change((d) => (d.msg = 'hello root'));
      expect(fired.length).to.eql(0); // NB: no change within the lens child - event not fired.

      root.change((d) => {
        d.child || (d.child = { count: 0 });
        d.child.count = 1234;
      });

      expect(fired.length).to.eql(1);
      expect(fired[0].doc.child?.count).to.eql(1234);
      expect(fired[0].lens.count).to.eql(1234);
      expect(root.current.child?.count).to.eql(1234);

      lens.change((d) => (d.count = 888));
      expect(fired.length).to.eql(2);

      root.dispose();
    });

    e.it('change on same descendent → different lens', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      const lens1 = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      const lens2 = CrdtLens.init<TRoot, TChild>(root, getDesendent);

      const fired1: t.CrdtLensChange<TRoot, TChild>[] = [];
      const fired2: t.CrdtLensChange<TRoot, TChild>[] = [];
      lens1.$.subscribe((e) => fired1.push(e));
      lens2.$.subscribe((e) => fired2.push(e));

      expect(lens1.current.count).to.eql(0);
      expect(lens2.current.count).to.eql(0);

      lens1.change((d) => d.count++);

      expect(fired1.length).to.eql(1);
      expect(fired2.length).to.eql(1);
      expect(fired2[0]).to.eql(fired1[0]);

      expect(lens1.current.count).to.eql(1);
      expect(lens2.current.count).to.eql(1);

      root.dispose();
    });

    e.it('no-change: lens on different sub-trees', (e) => {
      type T = {
        A: { count: number };
        B: { child: { count: number } };
      };

      const root = Crdt.ref<T>('foo', { A: { count: 0 }, B: { child: { count: 0 } } });

      const lens1 = CrdtLens.init<T, T['A']>(root, (doc) => doc.A);
      const lens2 = CrdtLens.init<T, T['B']>(root, (doc) => doc.B);

      const fired1: t.CrdtLensChange<T, T['A']>[] = [];
      const fired2: t.CrdtLensChange<T, T['B']>[] = [];
      lens1.$.subscribe((e) => fired1.push(e));
      lens2.$.subscribe((e) => fired2.push(e));

      lens1.change((d) => d.count++);
      expect(lens1.current.count).to.eql(1);
      expect(fired1.length).to.eql(1);
      expect(fired2.length).to.eql(0); // No change on lens2 sub-tree.

      lens2.change((d) => (d.child.count = 1234));
      expect(lens2.current.child.count).to.eql(1234);
      expect(fired1.length).to.eql(1); // No change (new) on lens1 sub-tree.
      expect(fired2.length).to.eql(1);

      root.dispose();
    });

    e.it('lens nested within lens (same root) ← events', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      const lens1 = CrdtLens.init<TRoot, TChild>(root, (doc) => {
        const d1 = doc.child || (doc.child = { count: 0 });
        return d1;
      });

      const lens2 = CrdtLens.init<TRoot, TChild>(root, (doc) => {
        const d1 = doc.child || (doc.child = { count: 0 });
        const d2 = d1.child || (d1.child = { count: 0 });
        return d2;
      });

      type C = t.CrdtLensChange<TRoot, TChild>;
      const fired1: C[] = [];
      const fired2: C[] = [];
      lens1.$.subscribe((e) => fired1.push(e));
      lens2.$.subscribe((e) => fired2.push(e));

      lens2.change((d) => (d.count = 1234));
      expect(lens1.current.count).to.eql(0);
      expect(lens1.current.child?.count).to.eql(1234);
      expect(lens2.current.count).to.eql(1234);

      expect(fired1.length).to.eql(1);
      expect(fired2.length).to.eql(1);
    });

    e.it('root replace ← events', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      const lens = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      expect(lens.current.count).to.eql(0);

      const fired: t.CrdtLensChange<TRoot, TChild>[] = [];
      lens.$.subscribe((e) => fired.push(e));

      // NB: This simulates a change coming in from the network.
      root.replace(
        Automerge.change(root.current, (doc) => {
          getDesendent(doc);
          doc.child!.count = 1234;
        }),
      );
      expect(root.current.child?.count).to.eql(1234);

      expect(fired.length).to.eql(1);
      expect(lens.current.count).to.eql(1234);
      expect(fired[0].lens.count).to.eql(1234);

      // Make another change that does not impact the lens.
      root.replace(Automerge.change(root.current, (doc) => (doc.msg = 'hello')));
      expect(root.current.msg).to.eql('hello');
      expect(fired.length).to.eql(1); // NB: no change.

      root.dispose();
    });
  });

  e.describe('sub-lens ← lens.lens(...)', (e) => {
    e.it('init', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      expect(root.current).to.eql({});

      const lens1 = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      expect(root.current).to.eql({ child: { count: 0 } });
      expect(lens1.current).to.eql({ count: 0 });

      const lens2 = lens1.lens(getDesendent);
      expect(root.current).to.eql({ child: { count: 0, child: { count: 0 } } });
      expect(lens2.current).to.eql({ count: 0 });

      root.dispose();
    });

    e.it('change', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      const lens1 = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      const lens2 = lens1.lens(getDesendent);
      const lens3 = lens2.lens(getDesendent);
      const lens4 = lens3.lens(getDesendent);

      expect(lens1.current).to.eql({
        count: 0,
        child: { count: 0, child: { count: 0, child: { count: 0 } } },
      });
      expect(lens4.current).to.eql({ count: 0 });

      lens4.change((d) => (d.count = 4));

      expect(lens4.current.count).to.eql(4);
      expect(lens1.current).to.eql({
        count: 0,
        child: { count: 0, child: { count: 0, child: { count: 4 } } },
      });

      root.dispose();
    });

    e.it('dispose', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      const lens1 = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      const lens2 = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      const lens3 = lens2.lens(getDesendent);

      lens2.dispose();
      expect(root.disposed).to.eql(false);
      expect(lens1.disposed).to.eql(false);
      expect(lens2.disposed).to.eql(true);
      expect(lens3.disposed).to.eql(true); // NB: sub-lens of lens2 is auto disposed.

      root.dispose();
      expect(root.disposed).to.eql(true);
      expect(lens1.disposed).to.eql(true);
      expect(lens2.disposed).to.eql(true);
      expect(lens3.disposed).to.eql(true);
    });
  });

  e.describe('Lens Registry', (e) => {
    const Registry = Crdt.Lens.Registry;

    e.it('does not exist (get, total)', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      expect(Registry.get(root)).to.eql(undefined);
      expect(Registry.total(root)).to.eql(0);
    });

    e.it('add', (e) => {
      const root = Crdt.ref<TRoot>('foo', {});
      const res1 = Registry.add(root);
      const res2 = Registry.add(root);
      expect(res1.total).to.eql(1);
      expect(res2.total).to.eql(2);
      expect(Registry.get(root)?.total).to.eql(2);
      expect(Registry.total(root)).to.eql(2);
    });

    e.it('remove', (e) => {
      const root1 = Crdt.ref<TRoot>('foo', {});
      const root2 = Crdt.ref<TRoot>('foo', {});

      Registry.add(root1);
      Registry.add(root1);
      expect(Registry.total(root1)).to.eql(2);

      Registry.remove(root1);
      expect(Registry.total(root1)).to.eql(1);

      Registry.remove(root2);
      expect(Registry.total(root1)).to.eql(1);

      Registry.remove(root1);
      Registry.remove(root1);
      Registry.remove(root1);
      expect(Registry.total(root1)).to.eql(0);
      expect(Registry.get(root1)).to.eql(undefined);
    });

    e.it('lens → add → dispose → remove', (e) => {
      const root1 = Crdt.ref<TRoot>('foo', {});
      const root2 = Crdt.ref<TRoot>('foo', {});

      expect(Registry.total(root1)).to.eql(0);

      const lens1 = CrdtLens.init<TRoot, TChild>(root1, getDesendent);
      const lens2 = CrdtLens.init<TRoot, TChild>(root1, getDesendent);
      const lens3 = lens2.lens(getDesendent);
      const lens4 = CrdtLens.init<TRoot, TChild>(root2, getDesendent); // NB: not the same root doc.

      expect(Registry.total(root1)).to.eql(3);

      lens1.dispose();
      expect(Registry.total(root1)).to.eql(2);

      lens2.dispose();
      expect(Registry.total(root1)).to.eql(0); // NB: lens3 is disposed because it is a sub-lens of lens2.

      expect(lens1.disposed).to.eql(true);
      expect(lens2.disposed).to.eql(true);
      expect(lens3.disposed).to.eql(true);
      expect(lens4.disposed).to.eql(false);
    });
  });
});
