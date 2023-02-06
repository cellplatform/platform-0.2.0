import { WebRTC } from '.';
import { TEST, cuid, Dev, expect, rx, t, Time } from '../test.ui';

export default Dev.describe('WebRTC', (e) => {
  e.timeout(10 * 10000);
  const signal = TEST.signal;

  const peers = async (length: number, getStream?: t.PeerGetMediaStream) => {
    return await Promise.all(Array.from({ length }).map(() => WebRTC.peer({ signal, getStream })));
  };

  e.describe('peer: initial state', (e) => {
    e.it('trims HTTP from host', async (e) => {
      const peer1 = await WebRTC.peer({ signal: `  http://${signal}  ` }); // NB: Trims the HTTP prefix.
      const peer2 = await WebRTC.peer({ signal: `  https://${signal}  ` });

      expect(peer1.signal).to.eql(signal);
      expect(peer2.signal).to.eql(signal);

      peer1.dispose();
      peer2.dispose();
    });

    e.it('generates peer-id', async (e) => {
      const peer = await WebRTC.peer({ signal });
      expect(peer.id).to.be.a('string');
      expect(peer.id.length).to.greaterThan(10);
      expect(peer.kind).to.eql('local:peer');
      expect(peer.signal).to.eql(signal);
      peer.dispose();
    });

    e.it('specific peer-id', async (e) => {
      const id1 = cuid();
      const id2 = cuid();
      const peer1 = await WebRTC.peer({ signal, id: id1 });
      const peer2 = await WebRTC.peer({ signal, id: `peer:${id2}` });

      expect(peer1.id).to.eql(id1);
      expect(peer2.id).to.eql(id2); // NB: Trims the "peer:" URI prefix.

      peer1.dispose();
      peer2.dispose();
    });

    e.it('immutable lists', async (e) => {
      const peer = await WebRTC.peer({ signal });

      expect(peer.connections).to.eql([]);
      expect(peer.dataConnections).to.eql([]);
      expect(peer.mediaConnections).to.eql([]);

      expect(peer.connections).to.not.equal(peer.connections);
      expect(peer.dataConnections).to.not.equal(peer.dataConnections);
      expect(peer.mediaConnections).to.not.equal(peer.mediaConnections);

      peer.dispose();
    });
  });

  e.describe('peer.data', async (e) => {
    let peerA: t.Peer;
    let peerB: t.Peer;

    e.it('initialize: create peers A ⇔ B', async (e) => {
      const [a, b] = await peers(2);
      peerA = a;
      peerB = b;
    });

    e.it('open data connection between two peers', async (e) => {
      const { dispose, dispose$ } = rx.disposable();

      const firedA: t.PeerConnectionChange[] = [];
      const firedB: t.PeerConnectionChange[] = [];

      peerA.connections$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
        firedA.push(e);
      });
      peerB.connections$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
        firedB.push(e);
      });

      // Open the connection.
      const a = await peerA.data(peerB.id);
      expect(a.kind).to.eql('data');
      expect(a.peer.local).to.eql(peerA.id);
      expect(a.peer.remote).to.eql(peerB.id);
      expect(a).to.eql(peerA.dataConnections[0]);

      expect(peerA.connections.length).to.eql(1);
      await Time.wait(500);
      expect(peerB.connections.length).to.eql(1);
      expect(peerA.dataConnections.length).to.eql(1);
      expect(peerB.dataConnections.length).to.eql(1);

      expect(peerA.dataConnections[0].open).to.eql(true);
      expect(peerB.dataConnections[0].open).to.eql(true);

      expect(peerA.connectionsByPeer[0].peer).to.eql(peerB.id);
      expect(peerB.connectionsByPeer[0].peer).to.eql(peerA.id);

      expect(firedA.length).to.eql(1);
      expect(firedB.length).to.eql(1);
      expect(firedA[0].action).to.eql('added');
      expect(firedB[0].action).to.eql('added');

      dispose();
    });

    e.it('send JSON between peers', async (e) => {
      const { dispose, dispose$ } = rx.disposable();

      const a = peerA.dataConnections[0];
      const b = peerB.dataConnections[0];

      const incomingA: t.PeerDataPayload[] = [];
      const incomingB: t.PeerDataPayload[] = [];
      a.in$.pipe(rx.takeUntil(dispose$)).subscribe((e) => incomingA.push(e));
      b.in$.pipe(rx.takeUntil(dispose$)).subscribe((e) => incomingB.push(e));

      type E = { type: 'foo'; payload: { msg: string } };
      const payloadA = a.send<E>({ type: 'foo', payload: { msg: 'from-A' } });
      const payloadB = b.send<E>({ type: 'foo', payload: { msg: 'from-B' } });

      expect(WebRTC.Util.isType.PeerDataPayload(payloadA)).to.eql(true);
      expect(WebRTC.Util.isType.PeerDataPayload(payloadB)).to.eql(true);

      await Time.wait(500);

      expect(incomingA.length).to.eql(1, 'message received by A');
      expect(incomingB.length).to.eql(1, 'message received by B');

      expect(incomingA[0].event.payload.msg).to.eql('from-B');
      expect(incomingB[0].event.payload.msg).to.eql('from-A');

      dispose();
    });

    e.it('send binary data [Uint8Array] between peers', async (e) => {
      const a = peerA.dataConnections[0];
      const b = peerB.dataConnections[0];

      type E = { type: 'foo'; payload: { data: Uint8Array } };
      const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      a.send<E>({ type: 'foo', payload: { data } });

      const received = (await rx.firstValueFrom(b.in$)).event as E;
      expect(new Uint8Array(received.payload.data)).to.eql(data);
    });

    e.it('dispose: data connections (close A.data | B.data)', async (e) => {
      type E = { type: 'foo'; payload: { msg: string } };
      const { dispose, dispose$ } = rx.disposable();

      const a = peerA.dataConnections[0];
      const b = peerB.dataConnections[0];

      const changedA: t.PeerConnectionChange[] = [];
      const changedB: t.PeerConnectionChange[] = [];

      peerA.connections$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
        changedA.push(e);
      });
      peerB.connections$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
        changedB.push(e);
      });

      const incomingB: t.PeerDataPayload[] = [];
      b.in$.pipe(rx.takeUntil(dispose$)).subscribe((e) => incomingB.push(e));

      // Close the connection on the initiating side (A).
      a.dispose();
      expect(a.disposed).to.eql(true);
      await Time.wait(500);

      expect(changedA.length).to.eql(1);
      expect(changedB.length).to.eql(1);
      expect(changedA[0].action).to.eql('removed');
      expect(changedB[0].action).to.eql('removed');
      expect(peerA.connections.length).to.eql(0);
      expect(peerB.connections.length).to.eql(0);

      // Will no-longer transmit data after being disposed.
      a.send<E>({ type: 'foo', payload: { msg: 'from-A' } });
      await Time.wait(300);
      expect(incomingB.length).to.eql(0, 'no longer transmits data');

      b.dispose();
      dispose();
    });

    e.it('dispose: peers (A | B)', async (e) => {
      expect(peerA.disposed).to.eql(false);
      expect(peerB.disposed).to.eql(false);

      peerA.dispose();
      peerB.dispose();

      expect(peerA.disposed).to.eql(true);
      expect(peerB.disposed).to.eql(true);

      await Time.wait(500);
    });
  });

  e.describe('peer.media', async (e) => {
    let peerA: t.Peer;
    let peerB: t.Peer;

    const Media = WebRTC.Media.singleton();
    const getMediaStatus = async () => Media.events.status(Media.ref).get();

    e.it('initialize: create peers A ⇔ B', async (e) => {
      const [a, b] = await peers(2, Media.getStream);
      peerA = a;
      peerB = b;
    });

    e.it(
      'open [media/data] connection → close (last) data-connection → auto closes media-connection',
      async (e) => {
        const status1 = await getMediaStatus();
        expect(status1.stream).to.eql(undefined);

        const data1 = await peerA.data(peerB.id);
        const data2 = await peerA.data(peerB.id);
        const media = await peerA.media(peerB.id);

        await Time.wait(300);

        expect(data1.open).to.eql(true);
        expect(data2.open).to.eql(true);
        expect(media.open).to.eql(true);

        const status2 = await getMediaStatus();
        expect(status2.stream?.media instanceof MediaStream).to.eql(true);

        expect(peerA.dataConnections.length).to.eql(2);
        expect(peerB.dataConnections.length).to.eql(2);

        expect(peerA.mediaConnections.length).to.eql(1);
        expect(peerB.mediaConnections.length).to.eql(1);

        /**
         * Close the first data-connection.
         * This should have no effect on the media connection.
         */
        data1.dispose();
        await Time.wait(300);
        const status3 = await getMediaStatus();

        expect(status3.stream?.media instanceof MediaStream).to.eql(true);
        expect(peerA.mediaConnections.length).to.eql(1);
        expect(peerB.mediaConnections.length).to.eql(1);

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
      },
    );

    e.it('dispose: peers (A | B)', async (e) => {
      peerA.dispose();
      peerB.dispose();
      expect(peerA.disposed).to.eql(true);
      expect(peerB.disposed).to.eql(true);
    });
  });
});
