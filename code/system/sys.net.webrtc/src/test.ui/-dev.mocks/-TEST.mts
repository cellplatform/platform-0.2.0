import { expect, type t, Test, Time } from '../../test.ui';
import { Mock } from './Mock.mjs';

export default Test.describe('mocking (helpers)', (e) => {
  e.describe('MockDataConnection', (e) => {
    e.describe('single edge', (e) => {
      e.it('default properties', (e) => {
        const mock = Mock.DataConnection.edge();
        const conn = mock.conn;
        expect(conn.id.startsWith('dc_')).to.eql(true);
        expect(conn.kind).to.eql('data');
        expect(conn.isOpen).to.eql(true);
        expect(conn.peer.local.length).to.greaterThan(10);
        expect(conn.peer.remote.length).to.greaterThan(10);
      });

      e.it('overridden properties (initial)', (e) => {
        const id = 'my-id';
        const metadata: t.PeerMetaData = {};
        const peer = { local: 'a', remote: 'b' };
        const mock = Mock.DataConnection.edge({ id, metadata, peer });
        const conn = mock.conn;
        expect(conn.id).to.eql(id);
        expect(conn.kind).to.eql('data');
        expect(conn.metadata).to.eql(metadata);
        expect(conn.isOpen).to.eql(true);
        expect(conn.peer).to.eql(peer);
        mock.dispose();
      });

      e.it('unique peer-ids', (e) => {
        const mock1 = Mock.DataConnection.edge();
        const mock2 = Mock.DataConnection.edge();
        expect(mock1.conn.id).to.not.eql(mock2.conn.id);
        mock1.dispose();
        mock2.dispose();
      });

      e.it('next', async (e) => {
        const mock = Mock.DataConnection.edge();
        const conn = mock.conn;

        let _inFired = 0;
        let _outFired = 0;
        conn.in$.subscribe(() => _inFired++);
        conn.out$.subscribe(() => _outFired++);

        type E = { type: 'foo'; payload: { count: number } };
        const event: E = { type: 'foo', payload: { count: 1234 } };
        const res = conn.send<E>(event);

        expect(res.source.peer).to.eql(conn.peer.local);
        expect(res.source.connection).to.eql(conn.id);
        expect(res.event).to.eql(event);

        expect(_inFired).to.eql(0);
        expect(_outFired).to.eql(1);

        mock.dispose();
        mock.conn.send(event);
        expect(_outFired).to.eql(1); // NB: No change.

        mock.dispose();
      });

      e.it('dispose', (e) => {
        const mock = Mock.DataConnection.edge();
        const conn = mock.conn;
        expect(conn.isDisposed).to.eql(false);
        expect(conn.isOpen).to.eql(true);

        let _disposeFire = 0;
        let _$Fire = 0;
        conn.dispose$.subscribe(() => _disposeFire++);
        conn.in$.subscribe(() => _$Fire++);

        conn.dispose();
        conn.dispose();
        conn.dispose();

        expect(_disposeFire).to.eql(1);
        expect(conn.isDisposed).to.eql(true);
        expect(conn.isOpen).to.eql(false);

        conn.send({ type: 'foo', payload: {} });
        expect(_$Fire).to.eql(0);
      });

      e.it('dispose on root mock', (e) => {
        const mock = Mock.DataConnection.edge();
        expect(mock.conn.isDisposed).to.eql(false);

        mock.dispose();
        expect(mock.conn.isDisposed).to.eql(true);
      });
    });

    e.describe('connect (two-sided)', (e) => {
      e.it('edge ids (a, b)', (e) => {
        const { a, b } = Mock.DataConnection.connect();
        expect(a.id).to.eql(b.id);
        expect(a.peer.local).to.eql(b.peer.remote);
        expect(a.peer.remote).to.eql(b.peer.local);
      });

      e.it('fire between peers', async (e) => {
        const { a, b } = Mock.DataConnection.connect();

        const inA: t.PeerDataPayload[] = [];
        const inB: t.PeerDataPayload[] = [];
        a.in$.subscribe((e) => inA.push(e));
        b.in$.subscribe((e) => inB.push(e));

        a.send({ type: 'foo', payload: { msg: 'hello' } });

        // NB: Async (no immediate change)
        expect(inA).to.eql([]);
        expect(inB).to.eql([]);

        await Time.wait(10);

        expect(inA.length).to.eql(0);
        expect(inB.length).to.eql(1);
        expect(inB[0].source.peer).to.eql(a.peer.local);
        expect(inB[0].source.connection).to.eql(a.id);
        expect(inB[0].source.connection).to.eql(b.id);
        expect(inB[0].event).to.eql({ type: 'foo', payload: { msg: 'hello' } });

        b.send({ type: 'foo', payload: { msg: 'goodbye' } });
        await Time.wait(10);

        expect(inA.length).to.eql(1);
        expect(inB.length).to.eql(1); // NB: no change.
        expect(inA[0].event).to.eql({ type: 'foo', payload: { msg: 'goodbye' } });
      });

      e.it('fire between peers: via event-bus', async (e) => {
        type E = { type: 'foo'; payload: { count: number } };

        const mock = Mock.DataConnection.connect();
        const busA = mock.a.bus<E>();
        const busB = mock.b.bus<E>();

        const busFiredA: E[] = [];
        const busFiredB: E[] = [];
        busA.$.subscribe((e) => busFiredA.push(e));
        busB.$.subscribe((e) => busFiredB.push(e));

        const inFiredA: E[] = [];
        const inFiredB: E[] = [];
        mock.a.in$.subscribe((e) => inFiredA.push(e.event as E));
        mock.b.in$.subscribe((e) => inFiredB.push(e.event as E));

        busA.fire({ type: 'foo', payload: { count: 1 } });
        await Time.wait(10);

        expect(inFiredA).to.eql([]);
        expect(inFiredB).to.eql([{ type: 'foo', payload: { count: 1 } }]);

        busB.fire({ type: 'foo', payload: { count: 999 } });
        await Time.wait(10);
        expect(inFiredA).to.eql([{ type: 'foo', payload: { count: 999 } }]);
        expect(inFiredB).to.eql([{ type: 'foo', payload: { count: 1 } }]); // NB: no change.

        mock.dispose();
      });

      e.it('disposed mocks do not send', async (e) => {
        const { a, b } = Mock.DataConnection.connect();

        const inA: t.PeerDataPayload[] = [];
        const inB: t.PeerDataPayload[] = [];
        a.in$.subscribe((e) => inA.push(e));
        b.in$.subscribe((e) => inB.push(e));

        const event = { type: 'foo', payload: { msg: 'hello' } };
        a.dispose();
        a.send(event);

        await Time.wait(10);
        expect(inA).to.eql([]);
        expect(inB).to.eql([]);

        b.send(event);
        await Time.wait(10);
        expect(inA).to.eql([]);
        expect(inB).to.eql([]);
      });
    });
  });
});
