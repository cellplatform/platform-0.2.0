import { Lens } from '.';
import { Doc } from '../Doc';
import { Store } from '../Store';
import { describe, expect, it, type t } from '../test';
import { Registry } from './Lens.Registry';

describe('Doc.Lens', () => {
  type TRoot = { msg?: string; child?: TChild };
  type TChild = { count: number; child?: TChild };

  const store = Store.init();
  const setup = async (options: { store?: t.Store } = {}) => {
    const root = await (options.store ?? store).doc.getOrCreate<TRoot>((d) => null);
    const dispose = async () => {};
    return { root, dispose } as const;
  };

  const getDesendent: t.LensGetDescendent<TRoot, TChild> = (doc) => {
    // NB: If the child does not exist, it is written onto the object.
    //     Required for the CRDT to register the {root} subject
    //     prior to be handed to the lens mutator function
    return doc.child || (doc.child = { count: 0 });
  };

  it('API references', () => {
    expect(Doc.Lens).to.equal(Lens);
    expect(Doc.lens).to.eql(Lens.init);
    expect(Doc.Lens.Registry).to.equal(Registry);
  });

  describe('create', () => {
    it('Doc.Lens.init', async () => {
      const { root, dispose } = await setup();
      expect(root.current).to.eql({});

      const lens = Doc.Lens.init<TRoot, TChild>(root, getDesendent);
      expect(lens.root).to.equal(root);
      expect(lens.current).to.eql({ count: 0 });

      await dispose();
    });

    it('Doc.lens (← exposed as library entry)', async () => {
      const { root, dispose } = await setup();
      const lens = Doc.lens<TRoot, TChild>(root, getDesendent);
      expect(lens.root).to.equal(root);

      await dispose();
    });

    it('toObject', async () => {
      const { root, dispose } = await setup();
      const lens = Doc.lens<TRoot, TChild>(root, getDesendent);

      expect(lens.toObject()).to.eql(lens.current);
      expect(lens.toObject()).to.not.equal(lens.current);

      await dispose();
    });
  });

  describe('dispose', () => {
    it('disposes when store disposes', async () => {
      const store = Store.init();
      const { root, dispose } = await setup({ store });

      const lens = Doc.lens<TRoot, TChild>(root, getDesendent);
      expect(Registry.exists(root)).to.eql(true);

      expect(lens.disposed).to.eql(false);
      expect(store.disposed).to.eql(false);

      store.dispose();
      expect(Registry.exists(root)).to.eql(false);

      expect(lens.disposed).to.eql(true);
      expect(store.disposed).to.eql(true);

      await dispose();
    });

    it('disposes when deleted from store', async () => {
      const { root, dispose } = await setup();
      const timeout = 10;
      const lens = Doc.lens<TRoot, TChild>(root, getDesendent);

      expect(lens.disposed).to.eql(false);
      expect(await store.doc.exists(root.uri, { timeout })).to.eql(true);

      await store.doc.delete(root.uri);
      expect(lens.disposed).to.eql(true);
      expect(await store.doc.exists(root.uri, { timeout })).to.eql(false);

      await dispose();
    });

    it('disposes lens without effecting root', async () => {
      const { root, dispose } = await setup();
      const timeout = 10;
      const lens = Doc.lens<TRoot, TChild>(root, getDesendent);

      expect(lens.disposed).to.eql(false);
      expect(store.disposed).to.eql(false);
      expect(await store.doc.exists(root.uri, { timeout })).to.eql(true);

      lens.dispose();
      expect(lens.disposed).to.eql(true);
      expect(store.disposed).to.eql(false);
      expect(await store.doc.exists(root.uri, { timeout })).to.eql(true); // NB: no change.

      await dispose();
    });
  });

  describe('change', () => {
    it('lens descendent object does initially exist', async () => {
      const { root, dispose } = await setup();
      const lens = Doc.lens<TRoot, TChild>(root, getDesendent);

      const res = lens.change((child) => (child.count = 123));
      expect(res).to.equal(lens);

      expect(lens.current.count).to.eql(123);
      expect(root.current.child?.count).to.eql(123);

      lens.change((child) => (child.count = 456));
      expect(lens.current.count).to.eql(456);
      expect(root.current.child?.count).to.eql(456);

      await dispose();
    });

    it('lens descendent object does not initially exist (factory generated)', async (e) => {
      const { root, dispose } = await setup();
      const lens = Doc.lens<TRoot, TChild>(root, getDesendent);

      const res = lens.change((child) => (child.count = 123));
      expect(res).to.equal(lens);

      expect(lens.current.count).to.eql(123);
      expect(root.current.child?.count).to.eql(123);

      await dispose();
    });
  });

  describe('$ (change)', () => {
    it('change events → descendent', async () => {
      const { root, dispose } = await setup();
      const lens = Doc.lens<TRoot, TChild>(root, getDesendent);

      const fired: t.LensChange<TRoot, TChild>[] = [];
      lens.$.subscribe((e) => fired.push(e));

      lens.change((d) => (d.count = 123));
      expect(fired.length).to.eql(1);
      expect(fired[0].doc.child?.count).to.eql(123);
      expect(fired[0].lens.count).to.eql(123);

      await dispose();
    });

    it('change on root', async () => {
      const { root, dispose } = await setup();
      const lens = Doc.lens<TRoot, TChild>(root, getDesendent);

      const fired: t.LensChange<TRoot, TChild>[] = [];
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

      await dispose();
    });

    it('change on same descendent → different lens', async () => {
      const { root, dispose } = await setup();
      const lens1 = Doc.lens<TRoot, TChild>(root, getDesendent);
      const lens2 = Doc.lens<TRoot, TChild>(root, getDesendent);

      const fired1: t.LensChange<TRoot, TChild>[] = [];
      const fired2: t.LensChange<TRoot, TChild>[] = [];
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

      await dispose();
    });

    it('no-change: lens on different sub-trees', async () => {
      type T = {
        A: { count: number };
        B: { child: { count: number } };
      };

      const root = await store.doc.getOrCreate<T>((d) => {
        d.A = { count: 0 };
        d.B = { child: { count: 0 } };
      });

      const lens1 = Doc.lens<T, T['A']>(root, (doc) => doc.A);
      const lens2 = Doc.lens<T, T['B']>(root, (doc) => doc.B);

      const fired1: t.LensChange<T, T['A']>[] = [];
      const fired2: t.LensChange<T, T['B']>[] = [];
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
    });

    it('lens nested within lens (same root) ← events', async () => {
      const { root, dispose } = await setup();

      const lens1 = Doc.lens<TRoot, TChild>(root, (doc) => {
        const d1 = doc.child || (doc.child = { count: 0 });
        return d1;
      });

      const lens2 = Doc.lens<TRoot, TChild>(root, (doc) => {
        const d1 = doc.child || (doc.child = { count: 0 });
        const d2 = d1.child || (d1.child = { count: 0 });
        return d2;
      });

      type C = t.LensChange<TRoot, TChild>;
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

      await dispose();
    });

    //     it('root replace ← events', async () => {
    //       const { root, dispose } = await setup();
    //
    //       const lens = Doc.lens<TRoot, TChild>(root, getDesendent);
    //       expect(lens.current.count).to.eql(0);
    //
    //       const fired: t.CrdtLensChange<TRoot, TChild>[] = [];
    //       lens.$.subscribe((e) => fired.push(e));
    //
    //       // NB: This simulates a change coming in from the network.
    //       root.replace(
    //         Automerge.change(root.current, (doc) => {
    //           getDesendent(doc);
    //           doc.child!.count = 1234;
    //         }),
    //       );
    //       expect(root.current.child?.count).to.eql(1234);
    //
    //       expect(fired.length).to.eql(1);
    //       expect(lens.current.count).to.eql(1234);
    //       expect(fired[0].lens.count).to.eql(1234);
    //
    //       // Make another change that does not impact the lens.
    //       root.replace(Automerge.change(root.current, (doc) => (doc.msg = 'hello')));
    //       expect(root.current.msg).to.eql('hello');
    //       expect(fired.length).to.eql(1); // NB: no change.
    //
    //       root.dispose();
    //     });
  });

  describe('sub-lens ← lens.lens(...)', () => {
    it('init', async (e) => {
      const { root, dispose } = await setup();
      expect(root.current).to.eql({});

      const lens1 = Doc.lens<TRoot, TChild>(root, getDesendent);
      expect(root.current).to.eql({ child: { count: 0 } });
      expect(lens1.current).to.eql({ count: 0 });

      const lens2 = lens1.lens(getDesendent);
      expect(root.current).to.eql({ child: { count: 0, child: { count: 0 } } });
      expect(lens2.current).to.eql({ count: 0 });

      await dispose();
    });

    it('change', async () => {
      const { root, dispose } = await setup();

      const lens1 = Doc.lens<TRoot, TChild>(root, getDesendent);
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

      await dispose();
    });

    it('dispose', async () => {
      const store = Store.init();
      const { root, dispose } = await setup({ store });
      const events = root.events();

      const lens1 = Doc.lens<TRoot, TChild>(root, getDesendent);
      const lens2 = Doc.lens<TRoot, TChild>(root, getDesendent);
      const lens3 = lens2.lens(getDesendent);

      lens2.dispose();
      expect(store.disposed).to.eql(false);
      expect(events.disposed).to.eql(false);
      expect(lens1.disposed).to.eql(false);
      expect(lens2.disposed).to.eql(true);
      expect(lens3.disposed).to.eql(true); // NB: sub-lens of lens2 is auto disposed.

      store.dispose();
      expect(store.disposed).to.eql(true);
      expect(events.disposed).to.eql(true);
      expect(lens1.disposed).to.eql(true);
      expect(lens2.disposed).to.eql(true);
      expect(lens3.disposed).to.eql(true);

      await dispose();
    });
  });

  it('done (clean up)', () => {
    store.dispose();
  });
});
