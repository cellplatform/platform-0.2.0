import { Dev, expect, t, TestNetwork, Time, WebRtc } from '../../test.ui';

export default Dev.describe('WebRtc.Util', (e) => {
  e.timeout(1000 * 15);

  e.describe('isAlive', (e) => {
    let peerA: t.Peer;
    let peerB: t.Peer;

    e.it('init: create peers A ⇔ B', async (e) => {
      const [a, b] = await TestNetwork.peers(2);
      peerA = a;
      peerB = b;
    });

    e.it('remote peer does not exist', async (e) => {
      const res = await WebRtc.Util.isAlive(peerA, 'no-exist');
      expect(res).to.eql(false);
    });

    e.it('has existing connection to remote peer (fast)', async (e) => {
      const conn = await peerA.data(peerB.id);
      const res = await WebRtc.Util.isAlive(peerA, peerB.id);
      conn.dispose();
      expect(res).to.eql(true);
    });

    e.it(
      'no existing connection to remote peer: establish new transient test data connection',
      async (e) => {
        expect(peerA.connections.length).to.eql(0);
        expect(peerB.connections.length).to.eql(0);

        const fired: t.PeerConnectionChanged[] = [];
        peerA.connections$.subscribe((e) => fired.push(e));

        const res = await WebRtc.Util.isAlive(peerA, peerB.id);
        expect(res).to.eql(true);

        expect(peerA.connections.length).to.eql(0);
        expect(peerB.connections.length).to.eql(0);

        expect(fired.length).to.eql(2);
        expect(fired[0].action).to.eql('added');
        expect(fired[1].action).to.eql('removed');

        const conn = fired[0].connections[0] as t.PeerDataConnection;
        expect(conn.metadata.label).to.eql('test:isAlive');
      },
    );

    e.it('remote peer disposed', async (e) => {
      peerB.dispose();
      const res = await WebRtc.Util.isAlive(peerA, peerB.id);
      expect(res).to.eql(false);
    });

    e.it('dispose: peers (A | B)', async (e) => {
      // NB: Self - (alive, when not disposed)
      expect(await WebRtc.Util.isAlive(peerA, peerA.id)).to.eql(true);
      expect(await WebRtc.Util.isAlive(peerB, peerB.id)).to.eql(false); // Already disposed ^

      peerA.dispose();
      peerB.dispose();
      expect(peerA.disposed).to.eql(true);
      expect(peerB.disposed).to.eql(true);

      // NB: Self - disposed.
      expect(await WebRtc.Util.isAlive(peerA, peerA.id)).to.eql(false);
      expect(await WebRtc.Util.isAlive(peerB, peerB.id)).to.eql(false);

      await Time.wait(500);
    });
  });
});
