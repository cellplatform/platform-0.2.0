import { CrdtLens } from '..';
import { Crdt, Test, expect, type t } from '../../test.ui';

export default Test.describe('Lens', (e) => {
  type TChild = { count: number; child?: TChild };
  type D = { child?: TChild };

  const setup = () => {
    const initial: D = { child: { count: 0 } };
    const root = Crdt.Doc.ref<D>('foo-id', initial);
    return { initial, root };
  };

  const getDesendent: t.CrdtLensDescendent<D, TChild> = (doc) => {
    // NB: If the child does not exist, it is written onto the object.
    //     Required for the CRDT to register the {root} subject
    //     prior to be handed to the lens mutator function
    return doc.child || (doc.child = { count: 0 });
  };

  e.describe('create', (e) => {
    e.it('CrdtLens.init', () => {
      const { root } = setup();
      const lens = CrdtLens.init<D, TChild>(root, getDesendent);

      expect(lens.kind).to.eql('Crdt:Lens');
      expect(lens.root).to.equal(root);
      expect(lens.current).to.eql({ count: 0 });

      root.dispose();
    });

    e.it('Crdt.lens (← exposed as library entry)', () => {
      const { root } = setup();
      const lens = Crdt.lens<D, TChild>(root, getDesendent);
      expect(lens.root).to.equal(root);
      root.dispose();
    });
  });

  e.describe('dispose', (e) => {
    e.it('disposes when root disposes', (e) => {
      const { root } = setup();
      const lens = CrdtLens.init<D, TChild>(root, getDesendent);

      expect(lens.disposed).to.eql(false);
      expect(root.disposed).to.eql(false);

      root.dispose();

      expect(lens.disposed).to.eql(true);
      expect(root.disposed).to.eql(true);
    });

    e.it('disposes without effecting root', (e) => {
      const { root } = setup();
      const lens = CrdtLens.init<D, TChild>(root, getDesendent);

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
      const root = Crdt.Doc.ref<D>('foo-id', { child: { count: 0 } });
      const lens = CrdtLens.init<D, TChild>(root, getDesendent);

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
      const root = Crdt.Doc.ref<D>('foo-id', {});
      const lens = CrdtLens.init<D, TChild>(root, getDesendent);

      const res = lens.change((child) => (child.count = 123));
      expect(res).to.equal(lens);

      expect(lens.current.count).to.eql(123);
      expect(root.current.child?.count).to.eql(123);
      expect(root.history.length).to.eql(2);

      root.dispose();
    });

    e.it('with/without message', (e) => {
      const root = Crdt.Doc.ref<D>('foo-id', {});
      const lens = CrdtLens.init<D, TChild>(root, getDesendent);

      lens.change('hello', (child) => (child.count = 123));
      lens.change((child) => (child.count = 456));

      const history = root.history;
      expect(history.length).to.eql(3);

      expect(history[1].change.message).to.eql('hello');
      expect(history[2].change.message).to.eql(null);

      root.dispose();
    });
  });

  e.it('$ (change events → descendent)', (e) => {
    const root = Crdt.Doc.ref<D>('foo-id', {});
    const lens = CrdtLens.init<D, TChild>(root, getDesendent);

    const fired: t.CrdtLensChange<D, TChild>[] = [];
    lens.$.subscribe((e) => fired.push(e));

    lens.change((d) => (d.count = 123));

    expect(fired.length).to.eql(1);
    expect(fired[0].doc.child?.count).to.eql(123);
    expect(fired[0].lens.count).to.eql(123);

    root.dispose();
  });

  e.describe('sub lens', (e) => {
    e.it('init', (e) => {
      const root = Crdt.Doc.ref<D>('foo-id', {});
      const lens1 = CrdtLens.init<D, TChild>(root, getDesendent);
      const lens2 = lens1.lens(getDesendent);

      expect(root.current).to.eql({}); // NB: Lazy initialization.

      expect(lens2.current).to.eql({ count: 0 }); // NB: reading current forces initialization of the tree.
      expect(root.current.child?.count).to.eql(0);
      expect(root.current.child?.child?.count).to.eql(0);

      root.dispose();
    });

    e.it('change', (e) => {
      const root = Crdt.Doc.ref<D>('foo-id', {});
      const lens1 = CrdtLens.init<D, TChild>(root, getDesendent);
      const lens2 = lens1.lens(getDesendent);

      lens2.change((d) => (d.count = 123));

      expect(root.current.child?.count).to.eql(0);
      expect(root.current.child?.child?.count).to.eql(123);
      expect(lens2.current.count).to.eql(123);

      root.dispose();
    });

    e.it('dispose', (e) => {
      const root = Crdt.Doc.ref<D>('foo-id', {});
      const lens1 = CrdtLens.init<D, TChild>(root, getDesendent);
      const lens2 = CrdtLens.init<D, TChild>(root, getDesendent);
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
