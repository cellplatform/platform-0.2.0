import { NetworkBusMock, NetworkBusMocks } from '.';
import { expect, Time, Is, t, rx, describe, it } from '../test';

type E = { type: 'foo'; payload: { count?: number } };

describe('NetworkBusMock', () => {
  it('rx.instance(bus): "netbus.<Instance-ID>:mock"', () => {
    const bus = NetworkBusMock();
    const id = rx.bus.instance(bus);
    expect(id.startsWith('netbus.')).to.eql(true);
    expect(id.endsWith(':mock')).to.eql(true);
  });

  it('defaults', () => {
    const netbus = NetworkBusMock<E>();
    expect(netbus.mock.local).to.eql('uri:me');
    expect(netbus.mock.out).to.eql([]);
    expect(netbus.mock.remotes).to.eql([]);
  });

  it('options', () => {
    const remotes: t.NetworkBusUri[] = ['uri:one', 'uri:two'];
    const netbus = NetworkBusMock<E>({ local: 'foo', remotes });
    expect(netbus.mock.local).to.eql('foo');
    expect(netbus.mock.remotes.map(({ uri }) => uri)).to.eql(remotes);
  });

  describe('remotes', () => {
    it('add mock', () => {
      const bus = NetworkBusMock<E>();
      const netbus = NetworkBusMock<E>();
      expect(netbus.mock.remotes).to.eql([]);

      const res1 = netbus.mock.remote('uri:foo', bus);
      expect(res1.uri).to.eql('uri:foo');
      expect(res1.bus).to.equal(bus);
      expect(res1.fired).to.eql([]);

      const res2 = netbus.mock.remote('uri:bar');
      expect(res2.uri).to.eql('uri:bar');
      expect(Is.observable(res2.bus.$)).to.equal(true);
      expect(res2.fired).to.eql([]);

      expect(netbus.mock.remotes.map(({ uri }) => uri)).to.eql(['uri:foo', 'uri:bar']);
    });

    it('fire: local to remotes', async () => {
      const netbus = NetworkBusMock<E>({ memorylog: true });
      const r1 = netbus.mock.remote('1');
      const r2 = netbus.mock.remote('2');

      netbus.target.remote({ type: 'foo', payload: {} });
      expect(r1.fired).to.eql([]);
      expect(r2.fired).to.eql([]);

      await Time.wait(10);
      expect(r1.fired).to.eql([{ type: 'foo', payload: {} }]);
      expect(r2.fired).to.eql([{ type: 'foo', payload: {} }]);

      netbus.target.node('2').fire({ type: 'foo', payload: { count: 123 } });
      await Time.wait(10);
      expect(r1.fired).to.eql([{ type: 'foo', payload: {} }]);
      expect(r2.fired).to.eql([
        { type: 'foo', payload: {} },
        { type: 'foo', payload: { count: 123 } },
      ]);
    });

    it('fire: mock.in.next (remote to local)', async () => {
      const netbus = NetworkBusMock<E>();

      const fired: E[] = [];
      netbus.$.subscribe((e) => fired.push(e));

      const event: E = { type: 'foo', payload: {} };
      netbus.mock.in.next(event);
      expect(fired).to.eql([event]);
    });
  });
});

describe('NetworkBusMockMesh', () => {
  it('3 nodes', async () => {
    const [p1, p2, p3] = NetworkBusMocks(3, { memorylog: true });

    const event: E = { type: 'foo', payload: { count: 123 } };
    p2.target.remote(event);
    await Time.wait(10);

    expect(p1.mock.fired).to.eql([event]);
    expect(p2.mock.fired).to.eql([]);
    expect(p3.mock.fired).to.eql([event]);
  });
});
