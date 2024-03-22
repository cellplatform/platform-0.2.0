import { Dev, UserAgent, expect, slug, type t } from '../../test.ui';
import { WebRtcState } from '../State.mjs';

export default Dev.describe('State.Mutate', (e) => {
  e.timeout(1000 * 15);
  const Mutate = WebRtcState.Mutate;

  /**
   * Mutation helpers.
   */
  e.describe('mutate (should be done within CRDT immutable change handler)', (e) => {
    const sampleState = () => {
      const data: t.NetworkState = { peers: {}, props: {} }; // NB: tests when the child "peers" property is missing (auto inserted).
      return { data };
    };

    e.describe('addPeer', (e) => {
      e.it('add a remote peer', (e) => {
        const { data } = sampleState();
        const res = Mutate.addPeer(data, 'a', 'b');

        expect(res.existing).to.eql(false);
        expect(res.isSelf).to.eql(false);
        expect(res.peer.initiatedBy).to.eql(undefined);
        expect(res.peer.tx).to.eql(undefined);
        expect(res.peer).to.eql(data.peers.b);
        expect(res.peer.conns).to.eql({});
      });

      e.it('handles incomplete starting document', (e) => {
        const { data } = sampleState();

        delete (data as any).peers;

        const res = Mutate.addPeer(data, 'a', 'b');
        expect(res.peer).to.eql(data.peers.b);
      });

      e.it('add local peer (self)', (e) => {
        const { data } = sampleState();
        const res = Mutate.addPeer(data, 'a', 'a');

        expect(res.existing).to.eql(false);
        expect(res.isSelf).to.eql(true);
        expect(res.peer.initiatedBy).to.eql(undefined);
        expect(res.peer).to.eql(data.peers.a);
      });

      e.it('context: initiatedBy', (e) => {
        const { data } = sampleState();
        const res = Mutate.addPeer(data, 'a', 'b', { initiatedBy: 'a' });
        expect(res.peer.initiatedBy).to.eql('a');
      });

      e.it('context: tx', (e) => {
        const { data } = sampleState();
        const tx = slug();
        const res = Mutate.addPeer(data, 'a', 'b', { tx });
        expect(res.peer.tx).to.eql(tx);
      });

      e.it('existing peer', (e) => {
        const { data } = sampleState();
        const res1 = Mutate.addPeer(data, 'a', 'b');
        const res2 = Mutate.addPeer(data, 'a', 'b');
        expect(res1.existing).to.eql(false);
        expect(res2.existing).to.eql(true);
      });
    });

    e.describe('removePeer', (e) => {
      e.it('removes peer from object tree', (e) => {
        const { data } = sampleState();

        const res1 = Mutate.addPeer(data, 'a', 'b');
        expect(data.peers.b).to.exist;

        const res2 = Mutate.removePeer(data, 'b');
        expect(data.peers.b).to.not.exist;
        expect(res2.existing).to.eql(true);
        expect(res2.peer).to.equal(res1.peer);

        const res3 = Mutate.removePeer(data, 'b');
        expect(res3.existing).to.eql(false);
        expect(res3.peer).to.eql(undefined);
      });

      e.it('does nothing when specified peer does not exist', (e) => {
        const { data } = sampleState();
        const res = Mutate.removePeer(data, 'a');
        expect(res.existing).to.eql(false);
        expect(res.peer).to.eql(undefined);
        expect(data.peers).to.eql({});
      });
    });

    e.describe('update meta-data', (e) => {
      e.it('updateLocalMetadata', (e) => {
        const { data } = sampleState();

        Mutate.addPeer(data, 'a', 'a');
        expect(data.peers.a.device).to.eql({});

        Mutate.updateLocalMetadata(data, 'a');
        expect(data.peers.a.device.userAgent).to.eql(UserAgent.current);
      });
    });
  });
});
