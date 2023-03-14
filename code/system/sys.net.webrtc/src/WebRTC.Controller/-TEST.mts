import { t, Dev, expect } from '../test.ui';
import { WebRtcController } from '.';

export default Dev.describe('WebRtc.Controller', (e) => {
  e.timeout(1000 * 15);

  /**
   * Mutation helpers.
   */
  e.describe('Mutate', (e) => {
    const Mutate = WebRtcController.Mutate;

    const sampleState = () => {
      const data: t.NetworkState = { peers: {} }; // NB: tests when the child "peers" property is missing (auto inserted).
      return { data };
    };

    e.describe('addPeer', (e) => {
      e.it('add a remote peer', (e) => {
        const { data } = sampleState();
        const res = Mutate.addPeer(data, 'a', 'b');

        expect(res.existing).to.eql(false);
        expect(res.isSelf).to.eql(false);
        expect(res.peer.initiatedBy).to.eql(undefined);
        expect(res.peer).to.eql(data.peers.b);
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
        expect(res.peer.meta.useragent).to.eql(navigator.userAgent);
      });

      e.it('initiatedBy', (e) => {
        const { data } = sampleState();
        const res = Mutate.addPeer(data, 'a', 'b', { initiatedBy: 'a' });
        expect(res.peer.initiatedBy).to.eql('a');
      });

      e.it('existing peer', (e) => {
        const { data } = sampleState();
        const res1 = Mutate.addPeer(data, 'a', 'b');
        const res2 = Mutate.addPeer(data, 'a', 'b');
        expect(res1.existing).to.eql(false);
        expect(res2.existing).to.eql(true);
      });
    });

    e.describe('remotePeer', (e) => {});
  });
});
