import { CrdtBus } from './index.mjs';
import { Automerge, cuid, expect, Is, Pkg, rx, t, describe, it } from '../test/index.mjs';

type Doc = { count: number; msg?: string };

describe('CrdtBus', (e) => {
  const bus = rx.bus();

  describe('is', () => {
    const is = CrdtBus.Events.is;

    it('is (static/instance)', () => {
      const events = CrdtBus.Events({ bus });
      expect(events.is).to.equal(is);
    });

    it('is.base', () => {
      const test = (type: string, expected: boolean) => {
        expect(is.base({ type, payload: {} })).to.eql(expected);
      };
      test('foo', false);
      test('sys.crdt/', true);
    });

    it('is.instance', () => {
      const type = 'sys.crdt/';
      expect(is.instance({ type, payload: { id: 'abc' } }, 'abc')).to.eql(true);
      expect(is.instance({ type, payload: { id: 'abc' } }, '123')).to.eql(false);
      expect(is.instance({ type: 'foo', payload: { id: 'abc' } }, 'abc')).to.eql(false);
    });
  });

  describe('controller', () => {
    it('id', async () => {
      const id = 'foo';
      const c1 = CrdtBus.Controller({ bus });
      const c2 = CrdtBus.Controller({ bus, id });
      expect(c1.id).to.eql('default-instance');
      expect(c2.id).to.eql(id);

      const fired = { e1: 0, e2: 0 };
      c1.events.$.subscribe((e) => fired.e1++);
      c2.events.$.subscribe((e) => fired.e2++);

      const info1 = await c1.events.info.get();
      expect(fired).to.eql({ e1: 2, e2: 0 }); // NB: 2 == req/res

      const info2 = await c2.events.info.get();
      expect(fired).to.eql({ e1: 2, e2: 2 }); // NB: 2 == req/res

      expect(info1.id).to.eql('default-instance');
      expect(info2.id).to.eql(id);

      c1.dispose();
      c2.dispose();
    });

    it('filter', async (e) => {
      let blockId = '';
      const c = CrdtBus.Controller({
        bus,
        id: 'foo',
        filter: (e) => (!blockId ? true : e.payload.id !== blockId),
      });

      const info1 = await c.events.info.get({ timeout: 5 });
      blockId = 'foo'; // NB: adjust dummy filter.
      const info2 = await c.events.info.get({ timeout: 5 });

      expect(info1.id).to.eql('foo');
      expect(info2.error).to.include('Timed out');

      c.dispose();
    });
  });

  describe('events (api)', () => {
    describe('events.info', () => {
      it('exists', async () => {
        const { dispose, events } = CrdtBus.Controller({ bus });
        const res = await events.info.get();
        dispose();

        expect(res.id).to.eql('default-instance');

        expect(res.info?.module.name).to.eql(Pkg.name);
        expect(res.info?.module.version).to.eql(Pkg.version);

        expect(res.info?.dataformat.name).to.eql('automerge');
        expect(res.info?.dataformat.version).to.eql(Pkg.dependencies?.automerge);
      });

      it('does not exist', async () => {
        const events = CrdtBus.Events({ bus });
        const res = await events.info.get({ timeout: 10 });
        expect(res.error).to.include('[info] Timed out');
      });
    });

    describe('events.ref (memory state)', () => {
      describe('initial', () => {
        it('does not exist', async () => {
          const { dispose, events } = CrdtBus.Controller({ bus });
          const id = cuid();
          const res = await events.ref.fire<Doc>({ id });
          dispose();

          expect(res.created).to.eql(false);
          expect(res.changed).to.eql(false);

          expect(res.doc.data).to.eql(undefined);
          expect(res.doc.id).to.eql(id);
          expect(res.exists).to.eql(false);
        });

        it('via plain { object }', async () => {
          const { dispose, events } = CrdtBus.Controller({ bus });
          const id = cuid();

          const res1 = await events.ref.fire<Doc>({ id, change: { count: 0 } });
          const res2 = await events.ref.fire<Doc>({ id });
          dispose();

          expect(res1.doc.id).to.eql(id);
          expect(res1.doc.data).to.eql({ count: 0 });
          expect(res1.exists).to.eql(true);
          expect(Is.automergeObject(res1.doc.data)).to.eql(true);

          expect(res1.changed).to.eql(false);
          expect(res1.error).to.eql(undefined);

          expect(res1.created).to.eql(true);
          expect(res2.created).to.eql(false); // NB: second call retrieves existing state.

          expect(res1.error).to.eql(undefined);
          expect(res2.error).to.eql(undefined);
        });

        it('via { Automerge } object', async () => {
          const { dispose, events } = CrdtBus.Controller({ bus });
          const id = cuid();

          const initial = Automerge.from<Doc>({ count: 0 });
          const res = await events.ref.fire<Doc>({ id, change: initial });
          dispose();

          expect(res.doc.id).to.eql(id);
          expect(res.doc.data).to.eql(initial);
          expect(res.exists).to.eql(true);
          expect(Is.automergeObject(res.doc.data)).to.eql(true);
          expect(res.error).to.eql(undefined);
        });

        it('fires "created" event', async () => {
          const { dispose, events } = CrdtBus.Controller({ bus });
          const id = cuid();
          const doc: Doc = { count: 0 };

          const fired: t.CrdtRefCreated[] = [];
          events.ref.created$.subscribe((e) => fired.push(e));

          await events.ref.fire<Doc>({ id, change: doc });
          await events.ref.fire<Doc>({ id, change: doc });
          await events.ref.fire<Doc>({ id, change: doc });
          dispose();

          expect(fired.length).to.eql(1);
          expect(fired[0].doc.id).to.eql(id);
        });
      });

      it('exists', async () => {
        const { dispose, events } = CrdtBus.Controller({ bus });
        const id = cuid();

        const test = async (exists: boolean) => {
          const res = await events.ref.exists.fire(id);
          expect(res.exists).to.eql(exists);
          expect(res.error).to.eql(undefined);
          expect(res.doc).to.eql({ id });
        };

        await test(false);

        await events.ref.fire<Doc>({ id, change: { count: 0 } });
        await test(true);

        await events.ref.remove.fire(id);
        await test(false);

        dispose();
      });

      describe('remove (memory ref)', () => {
        it('removes an existing reference', async () => {
          const { dispose, events } = CrdtBus.Controller({ bus });
          const id = cuid();

          const res1 = await events.ref.fire<Doc>({ id, change: { count: 0 } });
          const res2 = await events.ref.fire<Doc>({ id });

          expect(res1.created).to.eql(true);
          expect(res2.created).to.eql(false);
          expect((await events.ref.exists.fire(id)).exists).to.eql(true);

          events.ref.remove.fire(id);
          expect((await events.ref.exists.fire(id)).exists).to.eql(false);

          const res3 = await events.ref.fire<Doc>({ id, change: { count: 123 } });
          expect(res3.created).to.eql(true); // NB: Initialized again as the reference was removed from memory.

          dispose();
        });

        it('fires "removed" event', async () => {
          const { dispose, events } = CrdtBus.Controller({ bus });
          const id = cuid();

          const fired: t.CrdtRefRemoved[] = [];
          events.ref.remove.removed$.subscribe((e) => fired.push(e));

          await events.ref.fire<Doc>({ id, change: { count: 0 } });
          await events.ref.remove.fire(id);

          expect(fired.length).to.eql(1);
          expect(fired[0].doc.id).to.eql(id);

          dispose();
        });
      });

      describe('change', () => {
        it('change (function)', async () => {
          const { dispose, events } = CrdtBus.Controller({ bus });
          const id = cuid();

          const change = (doc: Doc) => {
            doc.count = 123;
            doc.msg = 'hello';
          };

          await events.ref.fire<Doc>({ id, change: { count: 0 } });
          const res = await events.ref.fire<Doc>({ id, change: change });

          expect(res.changed).to.eql(true);
          expect(res.doc.data?.count).to.eql(123);
          expect(res.doc.data?.msg).to.eql('hello');

          dispose();
        });

        it('change (replace { object })', async () => {
          const { dispose, events } = CrdtBus.Controller({ bus });
          const id = cuid();
          await events.ref.fire<Doc>({ id, change: { count: 0 } });

          const getDoc = async () => (await events.ref.fire({ id })).doc;

          const fired: t.CrdtRefChanged[] = [];
          events.ref.changed$.subscribe((e) => fired.push(e));

          const res1 = await events.ref.fire<Doc>({ id, change: { count: 123 } });
          expect(fired.length).to.eql(1);
          expect(fired[0].doc.next).to.eql({ count: 123 });

          expect(Is.automergeObject(res1.doc.data)).to.eql(true);
          expect(res1.doc.data).to.eql({ count: 123 });
          expect(await getDoc()).to.eql(res1.doc);

          // Make a change.
          if (res1.doc.data) {
            const replacement = Automerge.change<Doc>(res1.doc.data, (d) => (d.count = 999));
            expect((await getDoc()).data).to.not.eql(replacement);

            // Submit the change as a replacement.
            const res2 = await events.ref.fire<Doc>({ id, change: replacement });
            expect(res2.doc.data).to.eql(replacement);
            expect((await getDoc()).data).to.eql(replacement);

            expect(fired.length).to.eql(2);
            expect(fired[1].doc.next).to.eql(replacement);
          }

          dispose();
        });

        it('"changed" event', async () => {
          const { dispose, events } = CrdtBus.Controller({ bus });
          const id = cuid();
          await events.ref.fire<Doc>({ id, change: { count: 0 } });

          const changed: t.CrdtRefChanged[] = [];
          events.ref.changed$.subscribe((e) => changed.push(e));

          await events.ref.fire<Doc>({ id, change: (doc) => (doc.msg = 'foobar') });
          await events.ref.fire<Doc>({ id, change: (doc) => doc.count++ });

          expect(changed.length).to.eql(2);

          expect(changed[0].doc.prev).to.eql({ count: 0 });
          expect(changed[0].doc.next).to.eql({ msg: 'foobar', count: 0 });

          expect(changed[1].doc.prev).to.eql(changed[0].doc.next);
          expect(changed[1].doc.next).to.eql({ msg: 'foobar', count: 1 });

          dispose();
        });
      });

      it('error: change attempt on non-initialized document', async () => {
        const { dispose, events } = CrdtBus.Controller({ bus });
        const id = cuid();
        const res = await events.ref.fire<Doc>({
          id,
          change: (doc) => (doc.msg = 'foobar'),
        });
        dispose();

        expect(res.error).to.include('document has not been initialized');
      });
    });

    describe('events.doc', () => {
      it('from initial { object } and function', async () => {
        const { dispose, events } = CrdtBus.Controller({ bus });

        const res1 = await events.doc<Doc>({ id: '1', initial: { count: 123 } });
        const res2 = await events.doc<Doc>({ id: '2', initial: () => ({ count: 456 }) });
        dispose();

        expect(res1.id).to.eql('1');
        expect(res1.current).to.eql({ count: 123 });

        expect(res2.id).to.eql('2');
        expect(res2.current).to.eql({ count: 456 });

        expect(res1.current).to.not.equal(res2.current); // NB: Not the same document instance.
      });

      it('same document instance', async () => {
        const { dispose, events } = CrdtBus.Controller({ bus });

        const initial: Doc = { count: 123 };
        const res1 = await events.doc<Doc>({ id: '1', initial });
        const res2 = await events.doc<Doc>({ id: '1', initial });
        const res3 = await events.doc<Doc>({ id: '2', initial });
        dispose();

        expect(res1.current).to.equal(res2.current);
        expect(res1.current).to.not.equal(res3.current); // NB: Not the same document instance.
      });

      it('from initial [Automerge] object', async () => {
        const { dispose, events } = CrdtBus.Controller({ bus });
        const res1 = await events.doc<Doc>({ id: '1', initial: { count: 0 } });
        const res2 = await events.doc<Doc>({ id: '2', initial: res1.current });
        dispose();

        expect(res1.current).to.eql(res2.current);
        expect(res1.current).to.not.equal(res2.current);
      });

      it('change', async () => {
        const { dispose, events } = CrdtBus.Controller({ bus });
        const doc = await events.doc<Doc>({ id: '1', initial: { count: 0 } });

        expect(doc.current.count).to.eql(0);

        const fired: t.CrdtRefChanged[] = [];
        doc.changed$.subscribe((e) => fired.push(e));

        const res = await doc.change((draft) => draft.count++);

        dispose();
        expect(res).to.eql({ count: 1 });

        expect(fired.length).to.eql(1);
        expect(fired[0].doc.id).to.eql(doc.id);
        expect(fired[0].doc.prev).to.eql({ count: 0 });
        expect(fired[0].doc.next).to.eql({ count: 1 });
      });

      it('change registered between different instances', async () => {
        const { dispose, events } = CrdtBus.Controller({ bus });
        const initial: Doc = { count: 0 };
        const doc1 = await events.doc<Doc>({ id: '1', initial });
        const doc2 = await events.doc<Doc>({ id: '1', initial });

        expect(doc1.current).to.eql({ count: 0 });
        expect(doc2.current).to.eql({ count: 0 });

        doc1.change((d) => (d.count = 123));

        expect(doc1.current).to.eql({ count: 123 });
        expect(doc2.current).to.eql({ count: 123 });

        dispose();
      });
    });
  });

  //   describe.skip('sync', () => {
  //     const testNetwork = (total: number) => {
  //       const initial: Doc = { count: 0 };
  //       return TestNetwork<Doc>({ total, initial, debounce: 0 });
  //     };
  //
  //     it('syncs existing docs across NetworkBus ', async () => {
  //       const network = await testNetwork(3);
  //       const [peer1, peer2, peer3] = network.peers;
  //
  //       const id = 'id-abc';
  //       const doc1 = await peer1.doc(id);
  //       const doc2 = await peer2.doc(id);
  //       const doc3 = await peer3.doc(id);
  //
  //       doc1.change((d) => (d.msg = 'hello-1'));
  //       doc1.change((d) => (d.msg = 'hello-2')); // NB: debounce invokes on the second change.
  //
  //       await Time.wait(100);
  //       expect(doc1.current.msg).to.eql('hello-2');
  //       expect(doc2.current.msg).to.eql('hello-2');
  //       expect(doc3.current.msg).to.eql('hello-2');
  //
  //       network.dispose();
  //     });
  //
  //     it('syncs a new document "from nothing" on remote peers', async () => {
  //       const network = await testNetwork(2);
  //       const [peer1, peer2] = network.peers;
  //
  //       const id = 'id-abc';
  //       const doc1 = await peer1.doc(id);
  //       doc1.change((d) => (d.msg = 'foobar'));
  //
  //       await Time.wait(100);
  //       const doc2 = await peer2.doc(id); // NB: The document had not been created on the peer prior to the sync kicking off.
  //       expect(doc1.current.msg).to.eql('foobar');
  //       expect(doc2.current.msg).to.eql('foobar');
  //
  //       network.dispose();
  //     });
  //   });
});
