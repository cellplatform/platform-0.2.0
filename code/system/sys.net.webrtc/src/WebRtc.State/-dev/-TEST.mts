import { WebRtcState } from '..';
import { UserAgent, Dev, expect, slug, t, WebRtc, Crdt, rx } from '../../test.ui';

export default Dev.describe('Network: State', (e) => {
  type N = 'ns.foo' | 'ns.bar';

  const setup = () => {
    const initial = WebRtc.NetworkSchema.initial.doc;
    const root = Crdt.Doc.ref<t.NetworkDocShared>('doc-id', initial);
    return { initial, root };
  };

  e.it('state: init', () => {
    const { root } = setup();
    expect(root.current.network.peers).to.eql({});
    expect(root.current.network.props).to.eql({});

    const state = WebRtcState.init(root);

    expect(state.kind).to.eql('WebRtc:State');
    expect(state.doc).to.equal(root);

    root.dispose();
  });

  e.describe('props (← by namespace)', (e) => {
    type T = { count: number; msg?: string };
    const initial: T = { count: 0 };

    e.it('create lens', (e) => {
      const { root } = setup();
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
      const { root } = setup();
      const state = WebRtcState.init<N>(root);
      const foo = state.props('ns.foo', initial);
      const bar = state.props('ns.bar', initial);

      foo.change((d) => (d.count = 123));
      expect(root.current.network.props['ns.foo']).to.eql({ count: 123 });
      expect(root.current.network.props['ns.bar']).to.eql(undefined); // NB: not yet initialised.
      expect(foo.current.count).to.eql(123);

      bar.change((d) => (d.count = 456));
      expect(root.current.network.props['ns.foo']).to.eql({ count: 123 });
      expect(root.current.network.props['ns.bar']).to.eql({ count: 456 });
      expect(bar.current.count).to.eql(456);
    });

    e.it('dispose of lens', (e) => {
      const { root } = setup();
      const state = WebRtcState.init<N>(root);
      const foo = state.props('ns.foo', initial);
      const bar = state.props('ns.bar', initial);

      expect(foo.disposed).to.eql(false);
      expect(bar.disposed).to.eql(false);

      foo.dispose();
      expect(root.disposed).to.eql(false);
      expect(foo.disposed).to.eql(true);
      expect(bar.disposed).to.eql(false);

      foo.change((d) => (d.count = 123));
      bar.change((d) => (d.count = 456));

      expect(foo.current.count).to.eql(0); // NB: No change, already disposed.
      expect(bar.current.count).to.eql(456);

      root.dispose();
      expect(root.disposed).to.eql(true);
      expect(foo.disposed).to.eql(true);
      expect(bar.disposed).to.eql(true);
    });
  });
});
