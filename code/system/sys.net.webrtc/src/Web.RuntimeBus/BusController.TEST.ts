import { WebRuntimeBus } from '.';
import { expect, rx, Dev, slug, NetworkBusMock } from '../test.ui';
import { DEFAULT } from './common';

export default Dev.describe('Web.RuntimeBus', (e) => {
  e.describe('controller/events', (e) => {
    e.it('instance', async () => {
      const bus = rx.bus();
      const id = `foo.${slug()}`;

      const env1 = WebRuntimeBus.Controller({ instance: { bus } });
      const env2 = WebRuntimeBus.Controller({ instance: { bus, id } });

      expect(env1.instance.bus).to.eql(rx.bus.instance(bus));
      expect(env2.instance.bus).to.eql(rx.bus.instance(bus));

      expect(env1.instance.id).to.eql(DEFAULT.instance);
      expect(env2.instance.id).to.eql(id);
    });

    e.it('info', async () => {
      const instance = { bus: rx.bus() };
      const controller = WebRuntimeBus.Controller({ instance });
      const events = WebRuntimeBus.Events({ instance });

      const res = await events.info.get();
      controller.dispose();
      events.dispose();

      expect(res.exists).to.eql(true);
      expect(res.info?.module.name).to.eql('sys.runtime.web');
    });

    e.describe('netbus', (e) => {
      e.it('exists: false', async () => {
        const instance = { bus: rx.bus() };
        const runtime = WebRuntimeBus.Controller({ instance });

        const res = await runtime.netbus.get({ timeout: 10 });
        runtime.dispose();

        expect(res.exists).to.eql(false);
        expect(res.netbus).to.eql(undefined);
        expect(res.error).to.eql(undefined);
      });

      e.it('exists: true', async () => {
        const instance = { bus: rx.bus() };
        const netbus = NetworkBusMock();
        const runtime = WebRuntimeBus.Controller({ instance, netbus });

        const res = await runtime.netbus.get({ timeout: 10 });
        runtime.dispose();

        expect(res.exists).to.eql(true);
        expect(res.netbus).to.equal(netbus);
        expect(res.error).to.eql(undefined);
      });
    });
  });
});
