import { Dev, expect, expectError, rx, type t, TestNetwork, Time, WebRtc } from '../../test.ui';

export default Dev.describe('WebRTC: connection → data', (e) => {
  e.timeout(1000 * 15);

  let peerA: t.Peer;
  let peerB: t.Peer;

  e.it('init: create peers A ⇔ B', async (e) => {
    const [a, b] = await TestNetwork.peers(2);
    peerA = a;
    peerB = b;
  });

  e.it('open data connection between two peers', async (e) => {
    const { dispose, dispose$ } = rx.disposable();

    const firedA: t.PeerConnectionChanged[] = [];
    const firedB: t.PeerConnectionChanged[] = [];

    peerA.connections$.pipe(rx.takeUntil(dispose$)).subscribe((e) => firedA.push(e));
    peerB.connections$.pipe(rx.takeUntil(dispose$)).subscribe((e) => firedB.push(e));

    // Open the connection.
    const conn = await peerA.data(peerB.id);
    expect(conn.kind).to.eql('data');
    expect(conn.metadata.initiatedBy).to.eql(peerA.id);
    expect(conn.peer.local).to.eql(peerA.id);
    expect(conn.peer.remote).to.eql(peerB.id);
    expect(conn).to.eql(peerA.connections.data[0]);

    expect(peerA.connections.length).to.eql(1);
    await Time.wait(500);
    expect(peerB.connections.length).to.eql(1);
    expect(peerA.connections.data.length).to.eql(1);
    expect(peerB.connections.data.length).to.eql(1);

    expect(peerA.connections.data[0].isOpen).to.eql(true);
    expect(peerB.connections.data[0].isOpen).to.eql(true);
    expect(peerB.connections.data[0].metadata.initiatedBy).to.eql(peerA.id);

    expect(peerA.connectionsByPeer[0].peer.local).to.eql(peerA.id);
    expect(peerA.connectionsByPeer[0].peer.remote).to.eql(peerB.id);
    expect(peerB.connectionsByPeer[0].peer.local).to.eql(peerB.id);
    expect(peerB.connectionsByPeer[0].peer.remote).to.eql(peerA.id);

    expect(firedA.length).to.eql(1);
    expect(firedB.length).to.eql(1);
    expect(firedA[0].action).to.eql('added');
    expect(firedB[0].action).to.eql('added');

    dispose();
  });

  e.it('send JSON between peers', async (e) => {
    const { dispose, dispose$ } = rx.disposable();

    const a = peerA.connections.data[0];
    const b = peerB.connections.data[0];

    const incomingA: t.PeerDataPayload[] = [];
    const incomingB: t.PeerDataPayload[] = [];
    a.in$.pipe(rx.takeUntil(dispose$)).subscribe((e) => incomingA.push(e));
    b.in$.pipe(rx.takeUntil(dispose$)).subscribe((e) => incomingB.push(e));

    type E = { type: 'foo'; payload: { msg: string } };
    const payloadA = a.send<E>({ type: 'foo', payload: { msg: 'from-A' } });
    const payloadB = b.send<E>({ type: 'foo', payload: { msg: 'from-B' } });

    expect(WebRtc.Util.isType.PeerDataPayload(payloadA)).to.eql(true);
    expect(WebRtc.Util.isType.PeerDataPayload(payloadB)).to.eql(true);

    await Time.wait(500);

    expect(incomingA.length).to.eql(1, 'message received by A');
    expect(incomingB.length).to.eql(1, 'message received by B');

    expect(incomingA[0].event.payload.msg).to.eql('from-B');
    expect(incomingB[0].event.payload.msg).to.eql('from-A');

    dispose();
  });

  e.it('send binary data [Uint8Array] between peers', async (e) => {
    const a = peerA.connections.data[0];
    const b = peerB.connections.data[0];

    type E = { type: 'foo'; payload: { data: Uint8Array } };
    const data = new Uint8Array([1, 2, 3, 4, 999]);
    a.send<E>({ type: 'foo', payload: { data } });

    const received = (await rx.firstValueFrom(b.in$)).event as E;
    expect(new Uint8Array(received.payload.data)).to.eql(data);
  });

  e.it('send via an event-bus (aka. "netbus")', async (e) => {
    type E = { type: 'foo'; payload: { count?: number } };

    const a = peerA.connections.data[0];
    const b = peerB.connections.data[0];

    const busA = a.bus<E>();
    const busB = b.bus<E>();

    const firedA: E[] = [];
    const firedB: E[] = [];
    busA.$.subscribe((e) => firedA.push(e));
    busB.$.subscribe((e) => firedB.push(e));

    const event: E = { type: 'foo', payload: { count: 1234 } };
    busA.fire(event);

    await Time.wait(300);
    expect(firedA).to.eql([]);
    expect(firedB).to.eql([event]);
  });

  e.it('error: remote peer does not exist', async (e) => {
    const { dispose, dispose$ } = rx.disposable();

    const errors: t.PeerError[] = [];
    peerA.error$.pipe(rx.takeUntil(dispose$)).subscribe((e) => errors.push(e));

    const errorMessage = 'Could not connect to peer FOO-404';
    await expectError(
      // Attempt to connect to a peer that does not exist.
      () => peerA.data('FOO-404'),
      errorMessage,
    );

    expect(errors.length).to.eql(1);
    expect(errors[0].type === 'peer-unavailable').to.eql(true);
    expect(errors[0].message).to.eql(errorMessage);

    dispose();
  });

  e.it('dispose: data connections (close A.data | B.data)', async (e) => {
    type E = { type: 'foo'; payload: { msg: string } };
    const { dispose, dispose$ } = rx.disposable();

    const a = peerA.connections.data[0];
    const b = peerB.connections.data[0];

    expect(a.isOpen).to.eql(true);
    expect(b.isOpen).to.eql(true);

    const changedA: t.PeerConnectionChanged[] = [];
    const changedB: t.PeerConnectionChanged[] = [];

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
    expect(a.isDisposed).to.eql(true);
    await Time.wait(500);

    expect(a.isOpen).to.eql(false);
    expect(b.isOpen).to.eql(false);

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
