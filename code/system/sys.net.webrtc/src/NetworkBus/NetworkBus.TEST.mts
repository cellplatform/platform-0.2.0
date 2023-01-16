import { expect, Is, Time, rx, t, describe, it } from '../test';
import { NetworkBusMock } from './NetworkBus.Mock.mjs';
import { NetworkBus } from '.';

type E = { type: 'foo'; payload: { count?: number } };

describe('NetworkBus', () => {
  it('rx.instance(bus): "netbus.<Instance-ID>"', () => {
    const pump: t.NetworkPump<E> = { in: (fn) => null, out: (e) => null };
    const netbus = NetworkBus({ pump, local: async () => 'local', remotes: async () => [] });

    const id = rx.bus.instance(netbus);
    expect(id.startsWith('netbus.')).to.eql(true);
  });

  it('$ (observable)', () => {
    const bus = NetworkBusMock();
    expect(Is.observable(bus.$)).to.eql(true);
  });

  describe('uri', () => {
    it('local', async () => {
      const bus = NetworkBusMock({ local: 'foo' });
      const uri = await bus.uri();
      expect(uri.local).to.eql('foo');
    });

    it('no remotes', async () => {
      const bus = NetworkBusMock();
      const uri = await bus.uri();
      expect(uri.remotes).to.eql([]);
    });

    it('lists remotes', async () => {
      const bus = NetworkBusMock();
      bus.mock.remote('one');
      bus.mock.remote('two');
      const uri = await bus.uri();
      expect(uri.remotes).to.eql(['one', 'two']);
    });
  });

  describe('IO: pump/in', () => {
    it('fires incoming message from the network pump through the LOCAL observable ($)', () => {
      const bus = NetworkBusMock<E>();
      const fired: E[] = [];
      bus.$.subscribe((e) => fired.push(e));

      const event: E = { type: 'foo', payload: {} };
      bus.mock.in.next(event);

      expect(fired.length).to.eql(1);
      expect(fired[0]).to.eql(event);
    });
  });

  describe('IO: pump/out', () => {
    const remotes = ['uri:one', 'uri:two', 'uri:three'];

    describe('bus.fire (root)', () => {
      it('sends through LOCAL observable ($)', async () => {
        const bus = NetworkBusMock<E>();

        const fired: E[] = [];
        bus.$.subscribe((e) => fired.push(e));

        const event: E = { type: 'foo', payload: { count: 999 } };
        bus.fire(event);
        expect(fired.length).to.eql(0); // NB: Network events are always sent asynchronously.

        await Time.wait(0);
        expect(fired.length).to.eql(1);
        expect(fired[0]).to.eql(event);
      });

      it('sends to REMOTE targets (URIs)', async () => {
        const bus = NetworkBusMock<E>({ remotes });

        const event: E = { type: 'foo', payload: { count: 888 } };
        bus.fire(event);
        expect(bus.mock.out.length).to.eql(0); // NB: Network events are always sent asynchronously.

        await Time.wait(0);
        expect(bus.mock.out.length).to.eql(1);
        expect(bus.mock.out[0].targets).to.eql(remotes);
        expect(bus.mock.out[0].event).to.eql(event);
      });
    });

    describe('target', () => {
      const event: E = { type: 'foo', payload: { count: 123 } };

      it('bus.target.local: sends to LOCAL observable only ', async () => {
        const bus = NetworkBusMock<E>({ remotes });

        const fired: E[] = [];
        bus.$.subscribe((e) => fired.push(e));

        const wait = bus.target.local(event);
        expect(fired.length).to.eql(0); // NB: Network events are always sent asynchronously.

        const res = await wait;
        expect(fired).to.eql([event]); // Fired locally.
        expect(res.targetted).to.eql(['uri:me']);
        expect(bus.mock.out.length).to.eql(0);
      });

      it('bus.target.remote: sends to REMOTE targets only', async () => {
        const bus = NetworkBusMock<E>({ remotes });

        const fired: E[] = [];
        bus.$.subscribe((e) => fired.push(e));

        const res = await bus.target.remote(event);

        expect(fired.length).to.eql(0); // NB: Only sent to remote targets.

        expect(res.targetted).to.not.include('uri:me');
        expect(res.targetted).to.eql(remotes);

        expect(bus.mock.out.length).to.eql(1);
        expect(bus.mock.out[0].event).to.eql(event);
        expect(bus.mock.out[0].targets).to.eql(remotes);
      });

      describe('bus.target.node', () => {
        it('local target URI only ("uri:me")', async () => {
          const bus = NetworkBusMock<E>({ remotes });

          const fired: E[] = [];
          bus.$.subscribe((e) => fired.push(e));

          const target = 'uri:me';
          const res = await bus.target.node(target).fire(event);

          expect(fired).to.eql([event]); // Fired locally.

          expect(res.targetted).to.eql([target]);
          expect(res.event).to.eql(event);
          expect(bus.mock.out.length).to.eql(0);
        });

        it('single target remote URI', async () => {
          const bus = NetworkBusMock<E>({ remotes });

          const fired: E[] = [];
          bus.$.subscribe((e) => fired.push(e));

          const target = 'uri:one';
          const res = await bus.target.node(target).fire(event);

          expect(fired).to.eql([]); // NB: Only remote targets specified.

          expect(res.targetted).to.eql([target]);
          expect(res.event).to.eql(event);

          expect(bus.mock.out.length).to.eql(1);
          expect(bus.mock.out[0].targets).to.eql([target]);
        });

        it('multiple target URIs (local and remote)', async () => {
          const bus = NetworkBusMock<E>({ remotes });

          const fired: E[] = [];
          bus.$.subscribe((e) => fired.push(e));

          const res = await bus.target.node('uri:one', 'uri:three', 'uri:me').fire(event);

          expect(fired).to.eql([event]); // Fired locally.

          expect(res.targetted).to.eql(['uri:me', 'uri:one', 'uri:three']);
          expect(res.event).to.eql(event);

          expect(bus.mock.out.length).to.eql(1);
          expect(bus.mock.out[0].targets).to.eql(['uri:one', 'uri:three']);
        });

        it('given target URI does not exist in "remotes" (nothing broadcast)', async () => {
          const bus = NetworkBusMock<E>({ remotes });
          const res = await bus.target.node('foobar:404').fire(event);
          expect(res.targetted).to.eql([]);
          expect(bus.mock.out).to.eql([]);
        });

        it('no targets: broadcasts nothing', async () => {
          const bus = NetworkBusMock<E>({ remotes });
          const res = await bus.target.node().fire(event);
          expect(res.targetted).to.eql([]);
          expect(bus.mock.out).to.eql([]);
        });
      });

      describe('bus.target.filter', () => {
        it('filters on specific target URI(s)', async () => {
          const bus = NetworkBusMock<E>({ remotes });

          const fired: E[] = [];
          bus.$.subscribe((e) => fired.push(e));

          const res = await bus.target
            .filter((e) => e.uri === 'uri:me' || e.uri === 'uri:two')
            .fire(event);

          expect(fired).to.eql([event]); // Fired locally.

          expect(res.targetted).to.eql(['uri:me', 'uri:two']);
          expect(res.event).to.eql(event);

          expect(bus.mock.out.length).to.eql(1);
          expect(bus.mock.out[0].targets).to.eql(['uri:two']);
        });

        it('no filter: broadcasts everywhere (NB: edge-case, not an intended usage scenario)', async () => {
          const bus = NetworkBusMock<E>({ remotes });

          const fired: E[] = [];
          bus.$.subscribe((e) => fired.push(e));

          const res = await bus.target.filter().fire(event);

          expect(fired).to.eql([event]); // Fired locally.
          expect(res.targetted).to.eql(['uri:me', ...remotes]);

          expect(bus.mock.out.length).to.eql(1);
          expect(bus.mock.out[0].targets).to.eql(remotes);
        });
      });
    });
  });
});
