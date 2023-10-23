import { Webrtc } from '.';
import { Test, Time, expect, rx } from '../test.ui';

export default Test.describe('Webrtc.Peer → connect', (e) => {
  e.timeout(9999);
  e.it('skipped', (e) => {});

  e.it('start data connection', async (e) => {
    const peerA = Webrtc.Peer.create();
    await Time.wait(300);
    const peerB = Webrtc.Peer.create();
    expect(peerA.id).to.not.eql(peerB.id);

    const result = {
      $: rx.subject<string>(),
      value: '',
    };

    peerB.on('connection', (conn) => {
      conn.on('data', (data) => {
        console.log('data', data);
        result.value = data as string;
        result.$.next(result.value);
      });
    });

    await Time.wait(500);

    const conn = peerA.connect(peerB.id);
    conn.on('open', () => {
      console.log('open');
      conn.send('👋 hello');
    });

    await rx.asPromise.first(result.$);

    expect(result.value).to.eql('👋 hello');
    peerA.destroy();
    peerB.destroy();
  });
});
