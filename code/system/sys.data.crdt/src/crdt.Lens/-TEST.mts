import { CrdtLens } from '.';
import { Automerge, Crdt, Test, expect, type t } from '../test.ui';

export default Test.describe('Lens', (e) => {
  type TRoot = { msg?: string; child?: TChild };
  type TChild = { count: number; child?: TChild };

  const setup = () => {
    const initial: TRoot = {};
    const root = Crdt.Doc.ref<TRoot>('foo-id', initial);
    return { initial, root };
  };

  const getDesendent: t.CrdtLensDescendent<TRoot, TChild> = (doc) => {
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
      const root = Crdt.Doc.ref<TRoot>('foo-id', { child: { count: 0 } });
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
      const root = Crdt.Doc.ref<TRoot>('foo-id', {});
      const lens = CrdtLens.init<TRoot, TChild>(root, getDesendent);

      const res = lens.change((child) => (child.count = 123));
      expect(res).to.equal(lens);

      expect(lens.current.count).to.eql(123);
      expect(root.current.child?.count).to.eql(123);
      expect(root.history.length).to.eql(2);

      root.dispose();
    });

    e.it('with/without message', (e) => {
      const root = Crdt.Doc.ref<TRoot>('foo-id', {});
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
      const root = Crdt.Doc.ref<TRoot>('foo-id', {});
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
      const root = Crdt.Doc.ref<TRoot>('foo-id', {});
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

    e.it('change on different lens', (e) => {
      const root = Crdt.Doc.ref<TRoot>('foo-id', {});
      const lens1 = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      const lens2 = CrdtLens.init<TRoot, TChild>(root, getDesendent);

      const fired1: t.CrdtLensChange<TRoot, TChild>[] = [];
      const fired2: t.CrdtLensChange<TRoot, TChild>[] = [];
      lens1.$.subscribe((e) => fired1.push(e));
      lens2.$.subscribe((e) => fired2.push(e));

      lens1.change((d) => d.count++);
      expect(fired2.length).to.eql(1);
      expect(fired2).to.eql(fired1);

      root.dispose();
    });

    e.it('root replace', (e) => {
      const root = Crdt.Doc.ref<TRoot>('foo-id', {});
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

  e.describe('sub lens', (e) => {
    e.it('init', (e) => {
      const root = Crdt.Doc.ref<TRoot>('foo-id', {});
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
      const root = Crdt.Doc.ref<TRoot>('foo-id', {});
      const lens1 = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      const lens2 = lens1.lens(getDesendent);

      lens2.change((d) => (d.count = 123));

      expect(root.current.child?.count).to.eql(0);
      expect(root.current.child?.child?.count).to.eql(123);
      expect(lens2.current.count).to.eql(123);

      root.dispose();
    });

    e.it('dispose', (e) => {
      const root = Crdt.Doc.ref<TRoot>('foo-id', {});
      const lens1 = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      const lens2 = CrdtLens.init<TRoot, TChild>(root, getDesendent);
      const lens3 = lens2.lens(getDesendent);

      lens2.dispose();
      expect(root.disposed).to.eql(false);
      expect(lens1.disposed).to.eql(false);
      expect(lens2.disposed).to.eql(true);
      expect(lens3.disposed).to.eql(true);

      root.dispose();
      expect(root.disposed).to.eql(true);
      expect(lens1.disposed).to.eql(true);
      expect(lens2.disposed).to.eql(true);
      expect(lens3.disposed).to.eql(true);
    });
  });
});
