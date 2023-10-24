import { Webrtc } from '.';
import { Test, Time, expect, rx } from '../test.ui';

export default Test.describe('Webrtc → peer connect', (e) => {
  e.timeout(9999);

  e.it('start data connection', async (e) => {
    const peerA = Webrtc.peer();
    await Time.wait(300);
    const peerB = Webrtc.peer();
    expect(peerA.id).to.not.eql(peerB.id);

    const eventsA = peerA.events();
    const eventsB = peerB.events();

    const result = {
      $: rx.subject<string>(),
      value: '',
    };

    eventsB.cmd.data$.subscribe((e) => {
      result.value = e.data as string;
      result.$.next(result.value);
    });

    await Time.wait(500);

    const res = await peerA.connect.data(peerB.id);
    const conn = peerA.get.dataConnection(res.id)!;
    expect(conn).to.equal(res.conn);

    conn.send('👋 hello');

    await rx.asPromise.first(result.$);
    expect(result.value).to.eql('👋 hello');
    console.log('result.value', result.value);

    /**
     * Test disposal.
     */
    peerA.dispose();
    peerB.dispose();
    expect(peerA.disposed).to.eql(true);
    expect(peerB.disposed).to.eql(true);

    expect(eventsA.disposed).to.eql(true);
    expect(eventsB.disposed).to.eql(true);
  });
});
