import { Webrtc } from '.';
import { Test, Time, expect, rx } from '../test.ui';

export default Test.describe('Webrtc.Peer → connect', (e) => {
  e.timeout(9999);
  e.it('skipped', (e) => {});

  e.it.skip('start data connection', async (e) => {
    const peer1 = Webrtc.Peer.create();
    await Time.wait(300);
    const peer2 = Webrtc.Peer.create();
    expect(peer1.id).to.not.eql(peer2.id);

    const result = {
      $: rx.subject<string>(),
      value: '',
    };

    peer2.on('connection', (conn) => {
      conn.on('data', (data) => {
        result.value = data as string;
        result.$.next(result.value);
      });
    });

    await Time.wait(500);

    const conn = peer1.connect(peer2.id);
    conn.on('open', () => conn.send('👋 hello'));

    await rx.asPromise.first(result.$);
    expect(result.value).to.eql('👋 hello');
  });
});
