import { Webrtc } from '.';
import { Test, Time, expect, rx, type t } from '../test.ui';

export default Test.describe('Webrtc → peer connect', (e) => {
  e.timeout(9999);

  e.it('start data connection', async (e) => {
    console.info('🌳 Starting');

    const peerA = Webrtc.peer();
    await Time.wait(300);
    const peerB = Webrtc.peer();
    expect(peerA.id).to.not.eql(peerB.id);

    const eventsA = peerA.events();
    const eventsB = peerB.events();

    type M = t.PeerConnectMetadata & { foo: number };
    const firedBeforeA: t.PeerModelBeforeOutgoingCmdArgs[] = [];
    eventsA.cmd.beforeOutgoing$.subscribe((e) => {
      e.metadata<M>((data) => (data.foo = 1234)); // Example usage: adding a shared ephemeral Doc URI.
      firedBeforeA.push(e);
    });

    const result = {
      $: rx.subject<string>(),
      value: '',
    };

    eventsB.cmd.data$.subscribe((e) => {
      result.value = e.data as string;
      result.$.next(result.value);
    });

    console.info('🌳 Peers Setup');

    await Time.wait(500);

    const res = await peerA.connect.data(peerB.id);
    const conn = res.conn;
    expect(conn).to.equal(peerA.get.conn.obj(res.id)!);
    expect(conn).to.equal(peerA.get.conn.obj.data(res.id)!);

    expect(firedBeforeA.length).to.eql(1);
    expect(firedBeforeA[0].kind === 'data').to.be.true;
    expect((conn.metadata as M).foo).to.eql(1234);
    console.info('conn.metadata', conn.metadata);

    conn.send('👋 hello');
    await rx.asPromise.first(result.$);
    expect(result.value).to.eql('👋 hello');
    console.info('sent data:', result.value);

    /**
     * Test disposal.
     */
    peerA.dispose();
    peerB.dispose();
    expect(peerA.disposed).to.eql(true);
    expect(peerB.disposed).to.eql(true);

    expect(eventsA.disposed).to.eql(true);
    expect(eventsB.disposed).to.eql(true);

    console.info('🌳 Done');
  });
});
