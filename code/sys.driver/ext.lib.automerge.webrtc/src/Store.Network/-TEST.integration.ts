import { Test, Time, expect, expectRoughlySame, type t, Doc } from '../test.ui';
import { setup, type TParts } from './-TEST';

type D = { count: number };

export default Test.describe('🍌 WebrtcStore ← NetworkAdapter', (e) => {
  e.timeout(5000);

  let self: TParts;
  let remote: TParts;
  const wait = (msecs = 500) => Time.wait(msecs);

  e.it('connect peer to network', async (e) => {
    self = await setup();
    await wait();
    remote = await setup();
    await wait();

    const shared = {
      self: self.network.shared.doc,
      remote: remote.network.shared.doc,
    } as const;

    expect(self.network.total.added).to.eql(0);
    expect(remote.network.total.added).to.eql(0);

    expect(shared.self.uri).to.not.eql(shared.remote.uri); // NB: the {shared} CRDT documents are have unique genesis'.
    expect(Object.keys(shared.self.current.sys.peers).length).to.eql(1);
    expect(Object.keys(shared.remote.current.sys.peers).length).to.eql(1);

    /**
     * →|← connect network
     */
    const res = await self.peer.connect.data(remote.peer.id);
    expect(res.error).to.eql(undefined);

    expect(self.network.total.added).to.eql(1);
    expect(remote.network.total.added).to.eql(1);

    // Events.
    expect(self.fired.added.length).to.eql(1);
    expect(remote.fired.added.length).to.eql(1);
    expect(self.fired.added[0].conn.id).to.eql(res.id);
    expect(self.fired.added[0].peer.local).to.eql(self.peer.id);
    expect(self.fired.added[0].peer.remote).to.eql(remote.peer.id);
  });

  e.it('sync document (webrtc / data)', async (e) => {
    const bytesBefore = {
      self: self.network.total.bytes,
      remote: remote.network.total.bytes,
    } as const;

    /**
     * Create a new document.
     */
    const docSelf = await self.generator();
    await wait();
    const docRemote = await remote.generator(docSelf.uri); // NB: knowledge of remote document URI.
    await wait();
    expect(docSelf.current).to.eql({ count: 0 });
    expect(docRemote.current).to.eql({ count: 0 });

    /**
     * Change the document and ensure it syncs over the network connection.
     */
    docRemote.change((d) => (d.count = 123));
    await wait(1000);
    expect(docSelf.current).to.eql({ count: 123 }, 'self synced');
    expect(docRemote.current).to.eql({ count: 123 }, 'remote synced');

    /**
     * Byte count (data transmitted).
     */
    const bytesAfter = {
      self: self.network.total.bytes,
      remote: remote.network.total.bytes,
    } as const;

    const expectGreater = (a: number, b: number, message?: string) => {
      expect(a).to.greaterThanOrEqual(b, message);
    };

    expectGreater(bytesAfter.self.in, bytesBefore.self.in, 'bytes-in (self)');
    expectGreater(bytesAfter.remote.in, bytesBefore.remote.in, 'bytes-in (remote)');
    expectGreater(bytesAfter.self.out, bytesBefore.self.out, 'bytes-out (self)');
    expectGreater(bytesAfter.remote.out, bytesBefore.remote.out, 'bytes-out (remote)');

    expectRoughlySame(bytesAfter.self.in, bytesAfter.remote.in, 0.3, 'bytes-in same(ish)');
    expectRoughlySame(bytesAfter.self.out, bytesAfter.remote.out, 0.3, 'bytes-out same(ish)');
  });

  e.it('shared (doc / state → namespace)', async (e) => {
    const shared = {
      self: self.network.shared,
      remote: remote.network.shared,
    } as const;

    // NB: property returns same instance.
    type N = 'tmp' | 'foo';
    type T = { count: number };
    expect(shared.self.ns).to.equal(shared.self.ns);
    expect(shared.self.ns.typed<N>()).to.equal(shared.self.ns);

    const namespace = shared.self.ns.typed<N>();
    const foo = namespace?.lens<T>('foo', { count: 0 });

    const ns = {
      self: shared.self.ns.typed<N>(),
      remote: shared.self.ns.typed<N>(),
    } as const;

    const tmp = {
      self: ns.self?.lens<T>('tmp', { count: 0 }),
      remote: ns.remote?.lens<T>('tmp', { count: 0 }),
    } as const;

    tmp.self?.change((d) => (d.count = 1234));
    await wait();
    expect(tmp.remote?.current.count).to.eql(1234);
  });

  e.it('ephemeral events', async (e) => {
    const selfDoc = await self.generator();
    await wait();
    const remoteDoc = await remote.generator(selfDoc.uri);
    await wait();

    type TData = { count: number; msg?: string };
    const listenToEphemeral = (doc: t.Doc<D>) => {
      const events = doc.events();
      const fired = {
        out$: [] as t.DocEphemeralOut<D>[],
        in$: [] as t.DocEphemeralIn<D>[],
        inTyped: [] as t.DocEphemeralIn<D, TData>[],
      };
      events.ephemeral.in$.subscribe((e) => fired.in$.push(e));
      events.ephemeral.out$.subscribe((e) => fired.out$.push(e));
      events.ephemeral
        .in<TData>()
        .filter((e) => e.message.count <= 10)
        .subscribe((e) => fired.inTyped.push(e));
      return fired;
    };

    const fired = {
      self: listenToEphemeral(selfDoc),
      remote: listenToEphemeral(remoteDoc),
    } as const;

    // Broadcast (self → remote).
    type H = t.DocWithHandle<D>;
    (selfDoc as H).handle.broadcast({ count: 0 });
    (selfDoc as H).handle.broadcast({ count: 10 });
    (selfDoc as H).handle.broadcast({ count: 999 });
    await wait(500);

    expect(fired.self.in$.length).to.eql(0);
    expect(fired.self.inTyped.length).to.eql(0);
    expect(fired.self.out$.length).to.eql(3);

    expect(fired.remote.in$.length).to.eql(3);
    expect(fired.remote.inTyped.length).to.eql(2);
    expect(fired.remote.out$.length).to.eql(0);

    expect(fired.remote.inTyped[0].message.count).to.eql(0);
    expect(fired.remote.inTyped[1].message.count).to.eql(10);
  });

  e.it('dispose', (e) => {
    self.dispose();
    remote.dispose();
  });
});
