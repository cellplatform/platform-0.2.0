import { Automerge, Crdt, Is, Test, expect, rx, type t } from '../test.ui';

export default Test.describe('Lens Namespace', (e) => {
  type TFoo = { ns?: t.CrdtNsMap };
  type TRoot = { ns?: t.CrdtNsMap; foo?: TFoo };
  type TDoc = { count: number };
  type TError = { message?: string };

  const setup = () => {
    const initial: TRoot = {};
    const doc = Crdt.ref<TRoot>('foo', initial);
    return { initial, doc } as const;
  };

  e.describe('container', (e) => {
    e.it('namespace.container: { document } root', (e) => {
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

  e.describe('$ ← (namespace container)', (e) => {
    type N = 'foo' | 'bar';

    e.it('same observable instance', (e) => {
      const { doc } = setup();
      const ns = Crdt.Lens.namespace<TRoot, N>(doc, (d) => d.ns ?? (d.ns = {}));

      expect(Is.observable(ns.$)).to.eql(true);
      expect(ns.$).to.equal(ns.$);

      doc.dispose();
    });

    e.it('change events', (e) => {
      const { doc } = setup();
      const ns = Crdt.Lens.namespace<TRoot, N>(doc, (d) => d.ns ?? (d.ns = {}));

      const events: t.CrdtNsChange<TRoot, N>[] = [];
      ns.$.subscribe((e) => events.push(e));

      const foo = ns.lens<TDoc>('foo', { count: 0 });
      expect(events.length).to.eql(1);
      expect(events[0].lens.foo).to.eql({ count: 0 });
      expect(events[0].lens.bar).to.eql(undefined);

      const bar = ns.lens<TDoc>('bar', { count: 123 });
      expect(events.length).to.eql(2);
      expect(events[1].lens.foo).to.eql({ count: 0 });
      expect(events[1].lens.bar).to.eql({ count: 123 });

      foo.change((d) => d.count++);
      expect(events.length).to.eql(3);
      expect(events[2].lens.foo).to.eql({ count: 1 });
      expect(events[2].lens.bar).to.eql({ count: 123 });

      doc.dispose();
    });

    e.it('no longer fires after dispose', (e) => {
      const { doc } = setup();
      const ns = Crdt.Lens.namespace<TRoot, N>(doc, (d) => d.ns ?? (d.ns = {}));

      const events: t.CrdtNsChange<TRoot, N>[] = [];
      ns.$.subscribe((e) => events.push(e));

      const foo = ns.lens<TDoc>('foo', { count: 0 });
      foo.change((d) => d.count++);
      expect(events.length).to.eql(2);

      ns.dispose();
      foo.change((d) => d.count++);
      foo.change((d) => d.count++);
      expect(events.length).to.eql(2);

      doc.dispose();
    });
  });

  e.describe('lens', (e) => {
    e.it('namespace.lens: from { document } root', (e) => {
      const { doc } = setup();
      const namespace = Crdt.Lens.namespace<TRoot>(doc);
      expect(namespace.kind).to.eql('Crdt:Namespace');

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
      expect(doc.current.ns).to.eql({});

      const ns1 = namespace.lens<TDoc>('foo', { count: 0 });
      const ns2 = namespace.lens<TError>('bar', {});

      type NS = t.CrdtNsMap; // NB: generic string as namespace key.
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
      type NS = t.CrdtNsMap<N>;
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
    const getMap: t.CrdtNsMapGetLens<TRoot> = (d) => d.ns || (d.ns = {});

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

    e.it('doc.dispose ← root document', (e) => {
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

    e.it('dispose clears { container } → { }', (e) => {
      const { doc } = setup();

      const namespace = Crdt.Lens.namespace<TRoot>(doc, getMap);
      namespace.lens<TDoc>('foo', { count: 0 });
      namespace.lens<TError>('bar', {});

      const keys1 = Object.keys(namespace.container);
      doc.dispose();
      const keys2 = Object.keys(namespace.container);

      expect(keys1).to.eql(['foo', 'bar']);
      expect(keys2).to.eql([]);
    });

    e.it('dispose → 🌳 generate (new instance) → container:{ <empty> }', (e) => {
      const { doc } = setup();

      const generate = () => Crdt.Lens.namespace<TRoot>(doc, getMap);

      const ns1 = generate();
      ns1.lens<TDoc>('foo', { count: 0 });
      ns1.lens<TError>('bar', {});

      expect(Object.keys(ns1.container).length).to.eql(2);
      doc.dispose();
      expect(Object.keys(ns1.container).length).to.eql(0);

      /**
       * TODO 🐷
       */

      const ns2 = generate();
      expect(Object.keys(ns2.container).length).to.eql(0);
    });
  });
});
