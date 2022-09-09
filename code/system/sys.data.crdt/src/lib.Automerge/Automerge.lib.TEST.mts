import { AutomergeDoc } from './index.mjs';
import { Automerge, rx, t } from '../common/index.mjs';
import { expect, describe, it } from '../TEST/index.mjs';

/**
 * https://github.com/automerge/automerge
 * https://github.com/automerge/automerge/blob/main/SYNC.md
 */
describe('Automerge (CRDT)', () => {
  type Card = { title: string; done: boolean };
  type Doc = {
    name?: string;
    cards: Automerge.List<Card>; // NB: An [Array] type with extension methods (eg. insertAt)
    json?: any;
  };

  // const PATH = TestFilesystem.PATH;
  const bus = rx.bus();
  let fs: t.Fs;

  function createTestDoc() {
    return AutomergeDoc.init<Doc>((doc) => (doc.cards = []));
  }

  describe('data manipulation', () => {
    it('create `.init` (frozen)', () => {
      const doc = Automerge.init();
      expect(doc).to.eql({});
      expect(Object.isFrozen(doc)).to.eql(true); // Frozen by default.
    });

    it('create `.from` with initial state', () => {
      const initial: Doc = { cards: [] };
      const doc = Automerge.from<Doc>(initial);
      expect(doc).to.eql(initial);
      expect(doc).to.not.equal(initial); // NB: Different instance.
      expect(Object.isFrozen(doc)).to.eql(false); // Not frozen by default.
    });

    it('create `.from` (frozen)', () => {
      const doc = Automerge.from<Doc>({ cards: [] }, { freeze: true });
      expect(Object.isFrozen(doc)).to.eql(true);
    });

    describe('actorId', () => {
      it('getActorId', () => {
        const doc = Automerge.from<Doc>({ cards: [] });
        const id = Automerge.getActorId(doc);
        expect(id.length).to.greaterThan(25);
        expect(typeof id).to.eql('string');
      });

      it('custom id (via `.init`)', () => {
        const actorId = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        const doc = Automerge.init(actorId);
        expect(Automerge.getActorId(doc)).to.eql(actorId);
      });

      it('custom id (via `.from`)', () => {
        const initial: Doc = { cards: [] };
        const actorId = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        const doc = Automerge.from<Doc>(initial, actorId);
        expect(doc).to.eql(initial);
        expect(Automerge.getActorId(doc)).to.eql(actorId);
      });
    });

    describe('change (immutable mutation)', () => {
      it('named change "add card"', () => {
        const doc1 = Automerge.from<Doc>({ cards: [] });
        const doc2 = Automerge.change<Doc>(doc1, 'Add card', (doc) => {
          doc.cards.push({ title: 'hello', done: false });
        });

        expect(doc2).to.not.equal(doc1); // NB: Different instance.

        expect(doc1).to.eql({ cards: [] });
        expect(doc2).to.eql({ cards: [{ title: 'hello', done: false }] });
      });

      it('`.getChanges` retrieves change-set (Uint8Array)', () => {
        const doc1 = Automerge.from<Doc>({ cards: [] });
        const doc2 = Automerge.change<Doc>(doc1, 'Add card', (doc) => {
          doc.cards.push({ title: 'hello', done: false });
        });

        const changes = Automerge.getChanges<Doc>(doc1, doc2);
        expect(changes[0] instanceof Uint8Array).to.eql(true);
        expect(changes[0].length).to.eql(139);
      });

      it('`delete obj.prop` => undefined', () => {
        let doc = createTestDoc();

        doc = Automerge.change<Doc>(doc, (draft) => (draft.name = 'hello'));
        expect(doc.name).to.eql('hello');

        doc = Automerge.change<Doc>(doc, (draft) => {
          delete draft.name;
        });

        expect(doc.name).to.eql(undefined);
      });
    });

    describe('type manipulations (immutable)', () => {
      let doc = createTestDoc();
      const getAndChange = (fn: (json: any) => void) => {
        doc = Automerge.change<Doc>(doc, (draft) => {
          if (!draft.json) draft.json = {};
          fn(draft.json);
        });
        return doc;
      };

      it('string', () => {
        const doc = getAndChange((doc) => (doc.value = 'hello'));
        expect(doc.json?.value).to.eql('hello');
      });

      it('boolean', () => {
        let doc = getAndChange((doc) => (doc.value = true));
        expect(doc.json?.value).to.eql(true);

        doc = getAndChange((doc) => (doc.value = false));
        expect(doc.json?.value).to.eql(false);
      });

      it('number', () => {
        const doc = getAndChange((doc) => (doc.value = 1234));
        expect(doc.json?.value).to.eql(1234);
      });

      it('null', () => {
        const doc = getAndChange((doc) => (doc.value = null));
        expect(doc.json?.value).to.eql(null);
      });

      it('[ array ]', () => {
        const list = [1, 'two', true, {}, [123], null];
        const doc = getAndChange((doc) => (doc.value = list));

        expect(doc.json?.value).to.eql(list);

        // NB: immutable (not same instance of array)
        expect(doc.json?.value).to.not.equal(list);
        expect(doc.json?.value[3]).to.not.equal(list[3]); // object
        expect(doc.json?.value[4]).to.not.equal(list[4]); // array
      });

      describe('[ array ] methods', () => {
        it('.insertAt', () => {
          const doc = Automerge.change<Doc>(createTestDoc(), (draft) => {
            draft.cards.push({ title: 'item-1', done: false });
            draft.cards.insertAt?.(1, { title: 'item-2', done: false });
          });

          expect(doc.cards.length).to.eql(2);
          expect(doc.cards[0].title).to.eql('item-1');
          expect(doc.cards[1].title).to.eql('item-2');
        });

        it('.deleteAt', () => {
          const doc = Automerge.change<Doc>(createTestDoc(), (draft) => {
            draft.cards.insertAt?.(0, { title: 'item-1', done: false });
            draft.cards.insertAt?.(1, { title: 'item-2', done: false });
            draft.cards.deleteAt?.(0);
          });
          expect(doc.cards.length).to.eql(1);
          expect(doc.cards[0].title).to.eql('item-2');
          expect(doc.cards[1]).to.eql(undefined);
        });
      });

      it('{ object }', () => {
        const obj = { msg: 'hello', count: 123, list: [1, 2, 3], child: { enabled: true } };
        const doc = getAndChange((doc) => (doc.value = obj));

        expect(doc.json?.value).to.eql(obj);

        // NB: immutable (not same instance of array)
        expect(doc.json?.value).to.not.equal(obj);
        expect(doc.json?.value.list).to.not.equal(obj.list);
        expect(doc.json?.value.child).to.not.equal(obj.child);
      });
    });
  });

  describe('merging (multi-document)', () => {
    /**
     * Based on sample in README
     * https://github.com/automerge/automerge
     */
    it('simple merge', () => {
      /**
       * Initial document: "doc1"
       */
      let doc1 = Automerge.from<Doc>({ cards: [] });
      doc1 = Automerge.change<Doc>(doc1, 'Add card', (doc) => {
        doc.cards.push({ title: 'hello-1a', done: false });
      });
      doc1 = Automerge.change<Doc>(doc1, 'Add another card', (doc) => {
        doc.cards.push({ title: 'hello-2a', done: false });
      });

      expect(doc1).to.eql({
        cards: [
          { title: 'hello-1a', done: false },
          { title: 'hello-2a', done: false },
        ],
      });

      /**
       * Second document: "doc2"
       */
      let doc2 = Automerge.init<Doc>();
      doc2 = Automerge.merge(doc2, doc1);
      expect(doc2).to.eql(doc1); // NB: Newly minted document bought up-to-date with the prior document.

      /**
       * Make competing changes.
       */
      doc1 = Automerge.change<Doc>(doc1, 'Mark card as complete', (doc) => {
        doc.cards[0].done = true;
      });
      doc2 = Automerge.change<Doc>(doc2, 'Delete card', (doc) => {
        delete doc.cards[1];
      });

      expect(doc1.cards[0].done).to.eql(true);
      expect(doc2.cards[0].done).to.eql(false);

      expect(doc1.cards.length).to.eql(2);
      expect(doc2.cards.length).to.eql(1);

      // NB: Cloning not necessary, only because we are testing both ways
      //     and the document throw an error if merged twice with/from the same input.
      const merged = {
        a: Automerge.merge(Automerge.clone(doc1), Automerge.clone(doc2)),
        b: Automerge.merge(Automerge.clone(doc2), Automerge.clone(doc1)),
      };
      expect(merged.a).to.eql(merged.b);

      /**
       * Examine history.
       */
      const history = Automerge.getHistory(merged.a);
      expect(history.length).to.eql(5);

      const summary = history.map((state) => [state.change.message, state.snapshot.cards.length]);
      expect(summary).to.eql([
        ['Initialization', 0],
        ['Add card', 1],
        ['Add another card', 2],
        ['Mark card as complete', 2],
        ['Delete card', 1],
      ]);
    });
  });

  describe('filesystem (Uint8Array)', () => {
    async function getSampleDoc() {
      const doc = Automerge.from<Doc>({ cards: [] });
      return Automerge.change<Doc>(doc, 'Add card', (doc) => {
        doc.cards.push({ title: 'hello', done: false });
      });
    }

    // const getFilesystem = async (options: { clear?: boolean } = {}) => {
    //   if (!fs) fs = (await TestFilesystem.init({ bus }).ready()).fs;
    //   if (options.clear) await TestFilesystem.clear(fs);
    //   return fs;
    // };

    it.skip('save binary', async () => {
      //       const fs = await getFilesystem({ clear: true });
      //       const doc = await getSampleDoc();
      //       const path = fs.join(PATH.ROOT, 'myfile.crdt');
      //       const binary = Automerge.save(doc);
      //
      //       expect(await fs.exists(path)).to.eql(false);
      //       await fs.write(path, binary);
      //       expect(await fs.exists(path)).to.eql(true);
    });

    it('load from saved binary', async () => {
      // const fs = await getFilesystem({ clear: true });
      // const doc1 = await getSampleDoc();
      //
      // const STATE = { cards: [{ title: 'hello', done: false }] };
      // expect(doc1).to.eql(STATE);
      //
      // const path = fs.join(PATH.ROOT, 'myfile.crdt');
      // await fs.write(path, Automerge.save(doc1));
      //
      // const binary = (await fs.read(path)) as Automerge.BinaryDocument;
      //
      // const doc2 = Automerge.load(binary);
      // expect(doc2).to.eql(STATE);
      //
      // const { getActorId } = Automerge;
      // expect(getActorId(doc1)).to.not.eql(getActorId(doc2));
    });
  });

  /**
   * https://github.com/automerge/automerge/blob/main/SYNC.md
   */
  describe('sync (v1) - getChanges / applyChanges', () => {
    it('change and merge', () => {
      const A1 = createTestDoc();
      const B1 = Automerge.merge(Automerge.init<Doc>(), A1);

      // Make some changes to A
      const A2a = Automerge.change<Doc>(A1, (doc) => (doc.name = 'foo'));
      const A2b = Automerge.change<Doc>(A2a, (doc) => (doc.name = 'foobar'));

      const changes = Automerge.getChanges(A1, A2b);
      expect(changes.length).to.eql(2);

      const [C1, patch] = Automerge.applyChanges(B1, changes);
      expect(C1.name).to.eql('foobar');
      expect(patch.diffs.objectId).to.eql('_root');
    });
  });

  /**
   * https://github.com/automerge/automerge/blob/main/SYNC.md
   * https://github.com/automerge/automerge/blob/main/test/sync_test.js
   */
  describe('sync (v2) - "bloom filters"', () => {
    function sync<D>(
      a: Automerge.FreezeObject<D>,
      b: Automerge.FreezeObject<D>,
      aSyncState = Automerge.initSyncState(),
      bSyncState = Automerge.initSyncState(),
    ) {
      const { generateSyncMessage, receiveSyncMessage } = Automerge;

      const MAX = 10;
      let aToBmsg = null;
      let bToAmsg = null;
      let i = 0;

      do {
        [aSyncState, aToBmsg] = generateSyncMessage<D>(a, aSyncState);
        [bSyncState, bToAmsg] = generateSyncMessage<D>(b, bSyncState);

        // NB: Message is passed through {{network}} here.
        //     Simulating an (immediate) connection here for testing purposes.
        if (aToBmsg) [b, bSyncState] = receiveSyncMessage(b, bSyncState, aToBmsg);
        if (bToAmsg) [a, aSyncState] = receiveSyncMessage(a, aSyncState, bToAmsg);

        if (i++ > MAX) {
          throw new Error(`Did not synchronize within ${MAX} iterations.`);
        }
      } while (aToBmsg || bToAmsg);

      return {
        a,
        b,
        syncState: { a: aSyncState, b: bSyncState },
      };
    }

    it('[n1] should offer all changes to [n2] when starting from nothing', () => {
      type D = { list: number[] };

      const test = (n1: D, n2: D) => {
        // Make changes for [n1] that [n2] should request.
        Array.from({ length: 3 }).forEach(
          (v, i) => (n1 = Automerge.change(n1, { time: 0 }, (doc) => doc.list.push(i))),
        );

        expect(n1).to.not.eql(n2);
        expect(n1.list.length).to.eql(3);

        const synced = sync(n1, n2);
        expect(synced.a).to.eql(synced.b);
      };

      test(
        AutomergeDoc.init<D>((doc) => (doc.list = [])),
        Automerge.init<D>(),
      );

      test(
        AutomergeDoc.init<D>((doc) => (doc.list = [])),
        AutomergeDoc.init<D>((doc) => (doc.list = [])),
      );
    });

    it('should sync peers where one has commits the other does not', () => {
      type D = { list: number[]; msg?: string };

      let n1 = AutomergeDoc.init<D>((doc) => (doc.list = []));
      let n2 = Automerge.init<D>();

      // Make changes for n1 that n2 should request.
      Array.from({ length: 3 }).forEach(
        (v, i) => (n1 = Automerge.change(n1, { time: 0 }, (doc) => doc.list.push(i))),
      );

      expect(n1).to.not.eql(n2);

      ({ a: n1, b: n2 } = sync(n1, n2));
      expect(n1).to.eql(n2);

      // Make more changes for n1 that n2 should request.
      n2 = Automerge.change(n2, { time: 0 }, (doc) => (doc.msg = 'hello'));
      expect(n1.msg).to.not.eql(n2.msg);

      ({ a: n1, b: n2 } = sync(n1, n2));
      expect(n1.msg).to.eql(n2.msg);
    });
  });
});
