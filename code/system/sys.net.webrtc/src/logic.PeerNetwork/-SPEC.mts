import { PeerNetwork } from '.';
import { cuid, expect, rx, TEST, Dev, Time } from '../test.ui';

const signal = TEST.signal;
const timeout = 1000 * 15;

const MockNetworks = async (options: { length?: number } = {}) => {
  const { length = 2 } = options;

  const start = async () => {
    const bus = rx.bus();
    return (await PeerNetwork.start({ bus, signal, timeout })).network;
  };

  const wait = Array.from({ length }).map((_, i) => start());
  const clients = await Promise.all(wait);

  return {
    clients,
    dispose: () => Promise.all(clients.map((client) => client.dispose())),
  };
};

export default Dev.describe('PeerNetwork', (e) => {
  e.timeout(timeout);

  e.describe('`PeerNetwork.start()` - initialize network client "peer"', (e) => {
    e.it('generate "self" <peer-id>', async () => {
      const bus = rx.bus();
      const res = await PeerNetwork.start({ bus, signal });
      expect(res.error).to.eql(undefined);

      const { network } = res;
      expect(network.self).to.eql(network.netbus.self);

      const self = network.netbus.self;
      expect(self.length).to.greaterThan(10);
      await network.dispose();
    });

    e.it('use given "self" <peer-id>', async () => {
      const self = cuid();
      const res = await PeerNetwork.start({ bus: rx.bus(), self, signal });
      expect(res.error).to.eql(undefined);

      const { network } = res;
      expect(network.netbus.self).to.eql(self);
      expect(network.self).to.eql(self);
      await network.dispose();
    });

    e.it('error: timeout', async () => {
      const self = cuid();
      const timeout = 50;
      const res = await PeerNetwork.start({ bus: rx.bus(), self, signal, timeout });
      const error = res.error;

      expect(error?.message).to.include(self);
      expect(error?.message).to.include(`"${signal}"`);
      expect(error?.message).to.include('Timeout (50ms): Failed to initialize local peer');
    });

    e.describe('network.events', (e) => {
      e.it('peer (example: `peer.status`)', async () => {
        const { network } = await PeerNetwork.start({ bus: rx.bus(), signal });
        const self = network.netbus.self;
        const status = await network.events.peer.status(self).get();
        const { netbus } = await network.events.runtime.netbus.get();

        expect(netbus).to.equal(netbus);
        expect(status.exists).to.eql(true);
        expect(status.peer?.connections).to.eql([]);

        await network.dispose();
      });
    });
  });

  e.it('TMP', async (e) => {
    const bus = rx.bus();
    const { dispose$ } = rx.disposable();

    bus.$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
      console.log('bus', e.payload);
    });

    bus.fire({
      type: 'foo',
      payload: { foo: 'bar' },
    });
  });

  e.describe('network connections', (e) => {
    e.it('data (connect → talk over EventBus)', async () => {
      const mock = await MockNetworks();
      const [a, b] = mock.clients;
      const connector = a.events.peer.connection(a.netbus.self, b.netbus.self);

      const status = await a.events.peer.status(a.netbus.self).object();
      expect(status.current.connections).to.eql([]);

      expect(await connector.isConnected()).to.eql(false);
      const res = await connector.open.data({ isReliable: true });
      expect(await connector.isConnected()).to.eql(true);

      expect(res.kind).to.eql('data');
      expect(res.self).to.eql(a.self);
      expect(res.remote).to.eql(b.self);
      expect(res.existing).to.eql(false);
      expect(res.direction).to.eql('outgoing');
      expect(res.connection?.peer.self).to.eql(a.self);
      expect(res.connection?.peer.remote.id).to.eql(b.self);

      const connections = status.current.connections;
      expect(connections.length).to.eql(1);

      const first = connections[0];
      expect(first.kind).to.eql('data');
      expect(first.direction).to.eql('outgoing');
      expect(first.peer.self).to.eql(a.self);
      expect(first.peer.remote.id).to.eql(b.self);

      b.netbus.$.pipe().subscribe((e) => {
        console.log('b', e);
      });

      console.log('res', res);

      await a.netbus.target.remote({ type: 'foo', payload: { msg: 'from a' } });

      await Time.wait(200);

      await mock.dispose();
    });

    e.it.skip('media connection', async () => {
      const mock = await MockNetworks();
      const [a, b] = mock.clients;

      const connector = a.events.peer.connection(a.netbus.self, b.netbus.self);

      /**
       * TODO 🐷
       */

      await mock.dispose();
    });
  });
});
