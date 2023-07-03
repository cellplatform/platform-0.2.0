import { WebRtcState } from '..';
import { Crdt, Dev, WebRtc, expect, type t } from '../../test.ui';

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
      const { doc } = setup();
      const state = WebRtcState.init<N>(doc);
      const foo = state.props<T>('ns.foo', { count: 0 });

      expect(doc.current.network.props['ns.foo']).to.eql(undefined); // NB: not yet initialised.
      expect(doc.current.network.props['ns.bar']).to.eql(undefined);

      expect(foo.current).to.eql({ count: 0 });
      expect(doc.current.network.props['ns.foo']).to.eql({ count: 0 });
      expect(doc.current.network.props['ns.bar']).to.eql(undefined);

      const bar = state.props('ns.bar', { count: 888 });
      expect(bar.current).to.eql({ count: 888 });
      expect(doc.current.network.props['ns.foo']).to.eql({ count: 0 });
      expect(doc.current.network.props['ns.bar']).to.eql({ count: 888 });

      doc.dispose();
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

  e.describe('peer ← by "peer-id"', (e) => {
    e.it('create lens (self)', (e) => {
      const { doc } = setup();
      expect(doc.current.network.peers).to.eql({});

      const state = WebRtcState.init<N>(doc);
      const lens = state.peer('me', 'me');
      doc.dispose();
      expect(lens.current.id).to.eql('me');
      expect(doc.current.network.peers['me']).to.eql(lens.current);
    });

    e.it('create lens (remote)', (e) => {
      const { doc } = setup();
      const state = WebRtcState.init<N>(doc);
      const lens = state.peer('me', 'remote');
      doc.dispose();
      expect(lens.current.id).to.eql('remote');
      expect(doc.current.network.peers['remote']).to.eql(lens.current);
    });

    e.it('create lens ← {options}', (e) => {
      const { doc } = setup();
      const state = WebRtcState.init<N>(doc);
      const lens = state.peer('me', 'remote', { tx: 'foo', initiatedBy: 'bar' });
      doc.dispose();
      expect(lens.current.id).to.eql('remote');
      expect(lens.current.tx).to.eql('foo');
      expect(lens.current.initiatedBy).to.eql('bar');
    });

    e.it('change', (e) => {
      const { doc } = setup();
      const state = WebRtcState.init<N>(doc);
      const peer1 = state.peer('me', 'me');
      const peer2 = state.peer('me', 'remote');

      console.log('peer1', Crdt.toObject(peer1));

      expect(peer1.current.conns).to.eql({});
      expect(peer2.current.conns).to.eql({});

      peer1.change((d) => (d.conns.video = true));
      expect(peer1.current.conns).to.eql({ video: true });
      expect(peer2.current.conns).to.eql({});

      peer2.change((d) => (d.conns.mic = false));
      expect(peer1.current.conns).to.eql({ video: true });
      expect(peer2.current.conns).to.eql({ mic: false });

      doc.dispose();
    });

    e.it('dispose of lens', (e) => {
      const { doc } = setup();
      const state = WebRtcState.init<N>(doc);
      const peer1 = state.peer('me', 'me');
      const peer2 = state.peer('me', 'remote');

      expect(peer1.disposed).to.eql(false);
      expect(peer2.disposed).to.eql(false);

      peer1.dispose();
      expect(doc.disposed).to.eql(false);
      expect(peer1.disposed).to.eql(true);
      expect(peer2.disposed).to.eql(false);

      peer1.change((d) => (d.conns.video = true));
      peer2.change((d) => (d.conns.mic = false));

      expect(peer1.current.conns.video).to.eql(undefined); // NB: No change, already disposed.
      expect(peer2.current.conns.mic).to.eql(false);

      doc.dispose();
      expect(doc.disposed).to.eql(true);
      expect(peer1.disposed).to.eql(true);
      expect(peer2.disposed).to.eql(true);
    });
  });
});
