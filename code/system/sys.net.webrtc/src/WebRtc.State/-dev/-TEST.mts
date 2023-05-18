import { WebRtcState } from '..';
import { Crdt, Dev, WebRtc, expect, t } from '../../test.ui';

export default Dev.describe('Network: State', (e) => {
  type N = 'ns.foo' | 'ns.bar';

  const setup = () => {
    const initial = WebRtc.NetworkSchema.initial.doc;
    const doc = Crdt.Doc.ref<t.NetworkDocShared>('doc-id', initial);
    return { initial, doc: doc };
  };

  e.it('WebRtcState.init', () => {
    const { doc } = setup();
    expect(doc.current.network.peers).to.eql({});
    expect(doc.current.network.props).to.eql({});

    const state = WebRtcState.init(doc);
    expect(state.kind).to.eql('WebRtc:State');
    expect(state.doc).to.equal(doc);
    expect(state.current).to.eql(doc.current);

    doc.dispose();
  });

  e.it('WebRtc.state ← init from library root', (e) => {
    const { doc } = setup();

    const state = WebRtc.state(doc);
    expect(state.kind).to.eql('WebRtc:State');
    expect(state.doc).to.equal(doc);

    doc.dispose();
  });

  e.describe('props ← by "namespace"', (e) => {
    type T = { count: number; msg?: string };
    const initial: T = { count: 0 };

    e.it('create lens', (e) => {
      const { doc: root } = setup();
      const state = WebRtcState.init<N>(root);
      const foo = state.props<T>('ns.foo', { count: 0 });

      expect(root.current.network.props['ns.foo']).to.eql(undefined); // NB: not yet initialised.
      expect(root.current.network.props['ns.bar']).to.eql(undefined);

      expect(foo.current).to.eql({ count: 0 });
      expect(root.current.network.props['ns.foo']).to.eql({ count: 0 });
      expect(root.current.network.props['ns.bar']).to.eql(undefined);

      const bar = state.props('ns.bar', { count: 888 });
      expect(bar.current).to.eql({ count: 888 });
      expect(root.current.network.props['ns.foo']).to.eql({ count: 0 });
      expect(root.current.network.props['ns.bar']).to.eql({ count: 888 });

      root.dispose();
    });

    e.it('change', (e) => {
      const { doc } = setup();
      const state = WebRtcState.init<N>(doc);
      const foo = state.props('ns.foo', initial);
      const bar = state.props('ns.bar', initial);

      foo.change((d) => (d.count = 123));
      expect(doc.current.network.props['ns.foo']).to.eql({ count: 123 });
      expect(doc.current.network.props['ns.bar']).to.eql(undefined); // NB: not yet initialised.
      expect(foo.current.count).to.eql(123);

      bar.change((d) => (d.count = 456));
      expect(doc.current.network.props['ns.foo']).to.eql({ count: 123 });
      expect(doc.current.network.props['ns.bar']).to.eql({ count: 456 });
      expect(bar.current.count).to.eql(456);
    });

    e.it('dispose of lens', (e) => {
      const { doc } = setup();
      const state = WebRtcState.init<N>(doc);
      const foo = state.props('ns.foo', initial);
      const bar = state.props('ns.bar', initial);

      expect(foo.disposed).to.eql(false);
      expect(bar.disposed).to.eql(false);

      foo.dispose();
      expect(doc.disposed).to.eql(false);
      expect(foo.disposed).to.eql(true);
      expect(bar.disposed).to.eql(false);

      foo.change((d) => (d.count = 123));
      bar.change((d) => (d.count = 456));

      expect(foo.current.count).to.eql(0); // NB: No change, already disposed.
      expect(bar.current.count).to.eql(456);

      doc.dispose();
      expect(doc.disposed).to.eql(true);
      expect(foo.disposed).to.eql(true);
      expect(bar.disposed).to.eql(true);
    });
  });
});
