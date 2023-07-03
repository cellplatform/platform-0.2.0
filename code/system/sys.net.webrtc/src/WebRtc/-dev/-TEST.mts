import { cuid, Dev, expect, type t, TEST, TestNetwork, Time, WebRtc } from '../../test.ui';

export default Dev.describe('WebRTC', (e) => {
  e.timeout(1000 * 15);
  const signal = TEST.signal;

  e.describe('peer: initial state', (e) => {
    const endpoint = `${signal.host}/${signal.path}`;

    e.it('trims HTTP from host', async (e) => {
      const host = signal.host;
      const peer1 = await WebRtc.peer({ ...signal, host: ` http://${host} ` }); // NB: Trims the HTTP prefix.
      const peer2 = await WebRtc.peer({ ...signal, host: ` https://${host} ` });

      expect(peer1.signal).to.eql(endpoint);
      expect(peer2.signal).to.eql(endpoint);

      peer1.dispose();
      peer2.dispose();
    });

    e.it('generates a unique peer-id', async (e) => {
      const peer = await WebRtc.peer(signal);
      expect(peer.id).to.be.a('string');
      expect(peer.id.length).to.greaterThan(10);
      expect(peer.kind).to.eql('local:peer');
      expect(peer.signal).to.eql(endpoint);
      peer.dispose();
    });

    e.it('uses a specific peer-id', async (e) => {
      const id1 = cuid();
      const id2 = cuid();
      const peer1 = await WebRtc.peer(signal, { id: id1 });
      const peer2 = await WebRtc.peer(signal, { id: `peer:${id2}` });

      expect(peer1.id).to.eql(id1);
      expect(peer2.id).to.eql(id2); // NB: Trims the "peer:" URI prefix.

      peer1.dispose();
      peer2.dispose();
    });

    e.it('generates a unique "tx" lifetime identifier (in-memory peer instance)', async (e) => {
      const peer1 = await WebRtc.peer(signal, { id: cuid() });
      const peer2 = await WebRtc.peer(signal, {});

      expect(peer1.tx).to.match(/^peer\.tx\./);
      expect(peer2.tx).to.match(/^peer\.tx\./);
      expect(peer1.tx).to.not.eql(peer2.tx);
    });

    e.it('exposes lists as immutable', async (e) => {
      const peer = await WebRtc.peer(signal);

      expect(peer.connections.all).to.eql([]);
      expect(peer.connections.data).to.eql([]);
      expect(peer.connections.media).to.eql([]);

      expect(peer.connections.all).to.not.equal(peer.connections.all);
      expect(peer.connections.data).to.not.equal(peer.connections.data);
      expect(peer.connections.media).to.not.equal(peer.connections.media);

      peer.dispose();
    });
  });

  e.describe('WebRtc.Util', (e) => {
    e.describe('isAlive', (e) => {
      let peerA: t.Peer;
      let peerB: t.Peer;

      e.it('init: create peers A ⇔ B', async (e) => {
        const [a, b] = await TestNetwork.peers(2);
        peerA = a;
        peerB = b;
      });

      e.it('remote peer does not exist', async (e) => {
        const res = await WebRtc.Util.isAlive(peerA, 'FOO-404');
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
});
