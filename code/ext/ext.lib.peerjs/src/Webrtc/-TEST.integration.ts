import { Webrtc, PeerModel } from '.';
import { Test, Time, expect, rx } from '../test.ui';

export default Test.describe('Webrtc → peer connect', (e) => {
  e.timeout(9999);

  e.it('start data connection', async (e) => {
    const modelA = PeerModel.init();
    await Time.wait(300);
    const modelB = PeerModel.init();
    expect(modelA.id).to.not.eql(modelB.id);

    const eventsA = modelA.events();
    const eventsB = modelB.events();

    const result = {
      $: rx.subject<string>(),
      value: '',
    };

    eventsB.cmd.data$.subscribe((e) => {
      result.value = e.data as string;
      result.$.next(result.value);
    });

    await Time.wait(500);

    const connid = await modelA.connect.data(modelB.id);
    const conn = modelA.get.dataConnection(connid)!;
    conn.send('👋 hello');

    await rx.asPromise.first(result.$);
    expect(result.value).to.eql('👋 hello');
    console.log('result.value', result.value);

    /**
     * Test disposal.
     */
    modelA.dispose();
    modelB.dispose();
    expect(modelA.disposed).to.eql(true);
    expect(modelB.disposed).to.eql(true);

    expect(eventsA.disposed).to.eql(true);
    expect(eventsB.disposed).to.eql(true);
  });
});
