import { Crdt, expect, t, Test, toObject } from '../../test.ui';

import { CrdtLens } from '..';

export default Test.describe('Lens', (e) => {
  type TChild = { count: number };
  type D = {
    child?: TChild;
  };

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

});
