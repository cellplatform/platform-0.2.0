import { PeerNetbus } from '.';
import { cuid, Dev, expect, rx, t, Time, WebRuntimeBus } from '../test.ui';

export default Dev.describe('PeerNetbus', (e) => {
  e.it('init (default)', () => {
    const self = cuid();
    const bus = rx.bus();
    const netbus = PeerNetbus({ bus, self });

    expect(netbus.self).to.eql(self);
    expect(netbus.connections).to.eql([]);
  });

  e.it('fire locally', async () => {
    const self = cuid();
    const bus = rx.bus();
    const netbus = PeerNetbus({ bus, self });

    const fired: t.Event[] = [];
    netbus.$.subscribe((e) => fired.push(e));

    const event: t.Event = { type: 'foo', payload: { count: 0 } };
    netbus.fire(event);

    await Time.wait(0);
    expect(fired).to.eql([event]);
  });

  e.describe('WebRuntime', (e) => {
    e.it('retrieve [netbus] via event', async () => {
      const bus = rx.bus();
      const netbus = PeerNetbus({ bus, self: cuid() });

      const instance = { bus };
      const runtime = WebRuntimeBus.Controller({ instance, netbus });
      const events = WebRuntimeBus.Events({ instance });

      const res1 = await runtime.netbus.get({});
      const res2 = await events.netbus.get();

      runtime.dispose();
      events.dispose();

      expect(res1.exists).to.eql(true);
      expect(res2.exists).to.eql(true);

      expect(res1.netbus).to.equal(netbus);
      expect(res2.netbus).to.equal(netbus);
    });
  });
});
