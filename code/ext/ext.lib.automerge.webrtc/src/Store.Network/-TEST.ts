import { WebrtcStore } from '.';
import { Peer, Test, TestDb, WebStore, expect, rx, type t } from '../test.ui';

type D = { count: number };
export type TParts = Awaited<ReturnType<typeof setup>>;
export const setup = async (debugLabel?: string) => {
  const peer = Peer.init();
  const events = peer.events();
  const storage = TestDb.Unit.name;
  const store = WebStore.init({ storage, network: [] });
  const generator = store.doc.factory<D>((d) => (d.count = 0));

  const index = await WebStore.index(store);
  const network = await WebrtcStore.init(peer, store, index, { debugLabel });

  const added: t.WebrtcStoreAdapterAdded[] = [];
  const messages: t.WebrtcMessageAlert[] = [];
  network.added$.subscribe((e) => added.push(e));
  network.message$.subscribe((e) => messages.push(e));

  const dispose = () => {
    peer.dispose();
    store.dispose();
    network.dispose();
  };

  return {
    peer,
    events,
    store,
    generator,
    network,
    fired: { added, messages },
    dispose,
  } as const;
};

export default Test.describe('WebrtcStore', (e) => {
  e.timeout(5000);

  e.it('init', async (e) => {
    const { dispose, network, store, peer } = await setup();
    expect(network.total.added).to.eql(0);
    expect(network.store).to.equal(store);
    expect(network.peer).to.equal(peer);
    dispose();
  });

  e.describe('dispose', (e) => {
    e.it('when Peer disposes', async (e) => {
      const { peer, dispose, network } = await setup();
      expect(network.disposed).to.eql(false);
      peer.dispose();
      expect(network.disposed).to.eql(true);
      dispose();
    });

    e.it('when Store disposes', async (e) => {
      const { store, dispose, network } = await setup();
      expect(network.disposed).to.eql(false);
      store.dispose();
      expect(network.disposed).to.eql(true);
      dispose();
    });
  });

  e.describe('events ($)', (e) => {
    e.it('init', async (e) => {
      const { dispose, network } = await setup();
      const events = network.events();
      expect(rx.isObservable(events.$)).to.eql(true);
      dispose();
    });

    e.describe('dispose', (e) => {
      e.it('events().dispose() ← method', async (e) => {
        const { dispose, network } = await setup();
        const events = network.events();
        expect(events.disposed).to.eql(false);
        events.dispose();
        expect(events.disposed).to.eql(true);
        dispose();
      });

      e.it('events({ dispose$ }) ← param', async (e) => {
        const { dispose, network } = await setup();
        const life = rx.lifecycle();
        const events = network.events(life.dispose$);
        expect(events.disposed).to.eql(false);
        life.dispose();
        expect(events.disposed).to.eql(true);
        dispose();
      });

      e.it('on parent store disposal', async (e) => {
        const { dispose, network } = await setup();
        const events = network.events();
        expect(events.disposed).to.eql(false);
        dispose();
        expect(events.disposed).to.eql(true);
      });
    });
  });
});
