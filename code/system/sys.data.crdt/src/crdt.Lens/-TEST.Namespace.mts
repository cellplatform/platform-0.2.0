import { CrdtLens } from '.';
import { Automerge, Crdt, Test, expect, rx, type t } from '../test.ui';
import { DEFAULTS } from './common';

export default Test.describe('Lens Namespace', (e) => {
  type TRoot = { ns?: Record<string, {}> };
  type TDoc = { count: number };
  type TError = { message?: string };

  const setup = () => {
    const initial: TRoot = {};
    const doc = Crdt.ref<TRoot>('foo', initial);
    return { initial, doc } as const;
  };

  e.describe('container', (e) => {
    e.it('namespace.lens: { document } root', (e) => {
      const { doc } = setup();
      const namespace = Crdt.Lens.namespace<TRoot>(doc);
      const res1 = namespace.container;
      const res2 = namespace.container;

      expect(res1).to.eql({});
      expect(res2).to.eql({});
      expect(res1).to.not.equal(res2); // NB: different object instances.

      expect(Automerge.isAutomerge(res1)).to.eql(false);

      const lens = namespace.lens<TDoc>('foo', { count: 0 });
      lens.change((d) => d.count++);

      const res3 = namespace.container;
      expect(res1).to.eql({});
      expect(res3).to.eql({ foo: { count: 1 } });

      doc.dispose();
    });

    e.it('namespace.container: from sub-tree (get container → ƒ)', (e) => {
      const { doc } = setup();
      type N = 'foo' | 'bar';
      const ns = Crdt.Lens.namespace<TRoot, N>(doc, (d) => d.ns ?? (d.ns = {}));

      expect(ns.container).to.eql({});
      expect(ns.container).to.not.equal(ns.container);
      expect(Automerge.isAutomerge(ns.container)).to.eql(false);

      const foo = ns.lens<TDoc>('foo', { count: 0 });
      const bar = ns.lens<TError>('bar', {});
      expect(ns.container.foo).to.eql({ count: 0 });

      foo.change((d) => d.count++);
      expect(ns.container.foo).to.eql({ count: 1 });
      expect(ns.container.bar).to.eql({});

      bar.change((d) => (d.message = '👋'));
      expect(ns.container.foo).to.eql({ count: 1 });
      expect(ns.container.bar).to.eql({ message: '👋' });

      doc.dispose();
    });
  });

  e.describe('lens', (e) => {
    e.it('namespace.lens: from { document } root', (e) => {
      const { doc } = setup();
      const namespace = Crdt.Lens.namespace<TRoot>(doc);

      const ns1 = namespace.lens<TDoc>('foo', { count: 123 });
      const ns2 = namespace.lens('foo', { count: 0 });
      const ns3 = namespace.lens<TDoc>('bar', { count: 456 });

      expect(doc.current.ns).to.eql(undefined);
      expect((doc.current as any).foo).to.eql({ count: 123 }); // NB: initial count from first call.
      expect((doc.current as any).bar).to.eql({ count: 456 });

      ns2.change((d) => (d.count = 888));
      ns3.change((d) => (d.count = 999));

      expect(ns1.current).to.eql({ count: 888 });
      expect(namespace.lens('foo', { count: 0 }).current).to.eql({ count: 888 });
      expect((doc.current as any).foo).to.eql({ count: 888 });
      expect((doc.current as any).bar).to.eql({ count: 999 });

      doc.dispose();
    });

    e.it('namespace.lens: from sub-tree (get container → ƒ)', (e) => {
      const { doc } = setup();
      const namespace = Crdt.Lens.namespace<TRoot>(doc, (d) => d.ns || (d.ns = {}));
      expect(doc.current.ns).to.eql(undefined);

      const ns1 = namespace.lens<TDoc>('foo', { count: 0 });
      const ns2 = namespace.lens<TError>('bar', {});

      type NS = t.CrdtNamespaceMap; // NB: generic string as namespace key.
      expect((doc.current.ns as NS).foo).to.eql({ count: 0 });
      expect((doc.current.ns as NS).bar).to.eql({});

      ns1.change((d) => (d.count = 123));
      ns2.change((d) => (d.message = 'hello'));

      expect((doc.current.ns as NS).foo).to.eql({ count: 123 });
      expect((doc.current.ns as NS).bar).to.eql({ message: 'hello' });

      expect(ns1.current).to.eql({ count: 123 });
      expect(ns2.current).to.eql({ message: 'hello' });

      doc.dispose();
    });

    e.it('strongly typed namespace "names" (string | union)', (e) => {
      type N = 'foo.bar' | 'foo.baz';
      type NS = t.CrdtNamespaceMap<N>;
      const { doc } = setup();
      const namespace = Crdt.Lens.namespace<TRoot, N>(doc, (d) => d.ns || (d.ns = {}));

      const ns1 = namespace.lens<TDoc>('foo.bar', { count: 0 });
      const ns2 = namespace.lens<TError>('foo.baz', {});

      ns1.change((d) => (d.count = 123));
      ns2.change((d) => (d.message = 'hello'));

      expect((doc.current.ns as NS)['foo.bar']).to.eql({ count: 123 });
      expect((doc.current.ns as NS)['foo.baz']).to.eql({ message: 'hello' });

      doc.dispose();
    });
  });

  e.describe('dispose', (e) => {
    const getMap: t.CrdtNamespaceMapLens<TRoot> = (d) => d.ns || (d.ns = {});

    e.it('{ dispose$ } ← as param', (e) => {
      const { doc } = setup();
      const { dispose, dispose$ } = rx.disposable();
      const namespace = Crdt.Lens.namespace<TRoot>(doc, getMap, { dispose$ });
      const ns1 = namespace.lens<TDoc>('foo', { count: 0 });
      const ns2 = namespace.lens<TError>('bar', {});

      expect(namespace.disposed).to.eql(false);
      expect(ns2.disposed).to.eql(false);
      expect(ns1.disposed).to.eql(false);

      dispose();

      expect(namespace.disposed).to.eql(true);
      expect(ns2.disposed).to.eql(true);
      expect(ns1.disposed).to.eql(true);
    });

    e.it('namespace.dispose() ← method ', (e) => {
      const { doc } = setup();

      const namespace = Crdt.Lens.namespace<TRoot>(doc, getMap);
      const ns1 = namespace.lens<TDoc>('foo', { count: 0 });
      const ns2 = namespace.lens<TError>('bar', {});

      expect(namespace.disposed).to.eql(false);
      expect(ns2.disposed).to.eql(false);
      expect(ns1.disposed).to.eql(false);

      namespace.dispose();

      expect(namespace.disposed).to.eql(true);
      expect(ns2.disposed).to.eql(true);
      expect(ns1.disposed).to.eql(true);
    });

    e.it('doc.dispose (root document)', (e) => {
      const { doc } = setup();

      const namespace = Crdt.Lens.namespace<TRoot>(doc, getMap);
      const ns1 = namespace.lens<TDoc>('foo', { count: 0 });
      const ns2 = namespace.lens<TError>('bar', {});

      expect(doc.disposed).to.eql(false);
      expect(namespace.disposed).to.eql(false);
      expect(ns2.disposed).to.eql(false);
      expect(ns1.disposed).to.eql(false);

      doc.dispose();

      expect(doc.disposed).to.eql(true);
      expect(namespace.disposed).to.eql(true);
      expect(ns2.disposed).to.eql(true);
      expect(ns1.disposed).to.eql(true);
    });
  });

  e.describe('Namespace on a lens (as root)', (e) => {
    /**
     * TODO 🐷
     */
    e.it.skip('TMP', async (e) => {});
  });
});
