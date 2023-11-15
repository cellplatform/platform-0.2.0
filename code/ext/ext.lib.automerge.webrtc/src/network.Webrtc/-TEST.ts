import { expect, rx, Test, Time, WebStore, Webrtc } from '../test.ui';
import { WebrtcNetworkAdapter } from '.';

type D = { count: number };

export default Test.describe('WebrtcNetworkAdapter (Integration)', (e) => {
  e.timeout(9999);

  const testSetup = () => {
    const store = WebStore.init({ network: [] });
    const generator = store.doc.factory<D>((d) => (d.count = 0));
    const peer = Webrtc.peer();
    const events = peer.events();

    let addedCount = 0;

    events.cmd.conn$
      .pipe(
        rx.filter((e) => e.kind === 'data'),
        rx.filter((e) => e.action === 'ready'),
      )
      .subscribe((e) => {
        const conn = peer.get.conn.obj.data(e.connection?.id);
        const adapter = new WebrtcNetworkAdapter(conn!);
        store.repo.networkSubsystem.addNetworkAdapter(adapter);
        addedCount += 1;
      });

    const dispose = () => {
      peer.dispose();
      store.dispose();
    };

    return {
      peer,
      events,
      store,
      generator,
      dispose,
      count: {
        get added() {
          return addedCount;
        },
      },
    } as const;
  };

  e.it('connects and sync over WebRTC', async (e) => {
    const wait = (msecs = 350) => Time.wait(msecs);

    const self = testSetup();
    await wait();
    const remote = testSetup();
    await wait();

    const res = await self.peer.connect.data(remote.peer.id);
    expect(res.error).to.eql(undefined);

    expect(self.count.added).to.eql(1);
    expect(remote.count.added).to.eql(1);

    const docSelf = await self.generator();
    await wait();
    const docRemote = await remote.generator(docSelf.uri);
    await wait();
    expect(docSelf.current).to.eql({ count: 0 });
    expect(docRemote.current).to.eql({ count: 0 });

    docRemote.change((d) => (d.count = 123));
    await wait(500);
    expect(docSelf.current).to.eql({ count: 123 });
    expect(docRemote.current).to.eql({ count: 123 });
  });
});
