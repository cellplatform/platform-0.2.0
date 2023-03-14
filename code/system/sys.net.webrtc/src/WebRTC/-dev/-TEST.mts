import { cuid, Dev, expect, t, TEST, TestNetwork, Time, WebRtc } from '../../test.ui';

export default Dev.describe('WebRtc', (e) => {
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

  e.describe('connection: media', async (e) => {
    let peerA: t.Peer;
    let peerB: t.Peer;

    const Media = WebRtc.Media.singleton();
    const getStream = Media.getStream;
    const getMediaStatus = async () => Media.events.status(Media.ref.camera).get();

    e.it('init: create peers A ⇔ B', async (e) => {
      const [a, b] = await TestNetwork.peers(2, { getStream });
      peerA = a;
      peerB = b;
    });

    e.it(
      'open [media:camera/data] connection → close (last) data-connection → auto closes media-connection',
      async (e) => {
        const status1 = await getMediaStatus();
        expect(status1.stream).to.eql(undefined);

        const data1 = await peerA.data(peerB.id);
        const data2 = await peerA.data(peerB.id);
        const media = await peerA.media(peerB.id, 'camera');

        await Time.wait(300);

        expect(data1.isOpen).to.eql(true);
        expect(data2.isOpen).to.eql(true);
        expect(media.isOpen).to.eql(true);

        const status2 = await getMediaStatus();
        expect(status2.stream?.media instanceof MediaStream).to.eql(true);

        expect(peerA.connections.data.length).to.eql(2);
        expect(peerB.connections.data.length).to.eql(2);

        expect(peerA.connections.media.length).to.eql(1);
        expect(peerB.connections.media.length).to.eql(1);

        /**
         * Close the first data-connection.
         * This should have no effect on the media connection.
         */
        data1.dispose();
        await Time.wait(300);
        const status3 = await getMediaStatus();

        expect(status3.stream?.media instanceof MediaStream).to.eql(true);
        expect(peerA.connections.media.length).to.eql(1);
        expect(peerB.connections.media.length).to.eql(1);

        /**
         * Close the first data-connection.
         * This should auto-close the media connection.
         */
        data2.dispose();
        await Time.wait(300);
        const status4 = await getMediaStatus();

        expect(status4.stream?.media).to.eql(undefined);
        expect(peerA.connections.length).to.eql(0);
        expect(peerB.connections.length).to.eql(0);

        expect(data1.isOpen).to.eql(false);
        expect(data2.isOpen).to.eql(false);
        expect(media.isOpen).to.eql(false);
      },
    );

    e.it('dispose: peers (A | B)', async (e) => {
      peerA.dispose();
      peerB.dispose();
      expect(peerA.disposed).to.eql(true);
      expect(peerB.disposed).to.eql(true);
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
});
