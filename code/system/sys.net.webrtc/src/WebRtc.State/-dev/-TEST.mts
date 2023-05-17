import { WebRtcState } from '..';
import { UserAgent, Dev, expect, slug, t, WebRtc, Crdt, rx } from '../../test.ui';

export default Dev.describe('Network: State', (e) => {
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
  });

  e.it('state: dispose', () => {
    const { root } = setup();

    const state1 = WebRtcState.init(root);
    const state2 = WebRtcState.init(root);

    expect(root.disposed).to.eql(false);
    expect(state1.disposed).to.eql(false);
    expect(state2.disposed).to.eql(false);

    state1.dispose();
    expect(root.disposed).to.eql(false);
    expect(state1.disposed).to.eql(true);
    expect(state2.disposed).to.eql(false);

    root.dispose();
    expect(root.disposed).to.eql(true);
    expect(state1.disposed).to.eql(true);
    expect(state2.disposed).to.eql(true);
  });
});
