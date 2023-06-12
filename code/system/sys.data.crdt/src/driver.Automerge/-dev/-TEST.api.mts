import { Automerge } from '..';
import { expect, Test } from '../../test.ui';

export default Test.describe('API surface area', (e) => {
  type Card = { title: string; done: boolean; count: number };
  type Doc = {
    name?: string;
    cards: Automerge.List<Card>; // NB: An [Array] type with extension methods (eg. insertAt)
    json?: any;
  };

  const DEFAULT = {
    get doc(): Doc {
      const cards = [] as unknown as Automerge.List<Card>;
      return { cards };
    },

    get card(): Card {
      return { title: 'hello', done: false, count: 0 };
    },
  };

  function createTestDoc() {
    const doc = Automerge.init<Doc>();
    return Automerge.change(doc, (doc) => {
      doc.cards = [] as unknown as Automerge.List<Card>;
    });
  }

  e.describe('data manipulation', (e) => {
    e.it('create `.init` (not frozen)', () => {
      const doc = Automerge.init();
      expect(doc).to.eql({});
      expect(Object.isFrozen(doc)).to.eql(false);
    });

    e.it('create `.from` with initial state', () => {
      const initial: Doc = DEFAULT.doc;
      const doc = Automerge.from<Doc>(initial);
      expect(doc).to.eql(initial);
      expect(doc).to.not.equal(initial); // NB: Different instance.
      expect(Object.isFrozen(doc)).to.eql(false); // Not frozen by default.
    });

    e.it('create `.from` (frozen)', () => {
      const doc = Automerge.from<Doc>(DEFAULT.doc, { freeze: true });
      expect(Object.isFrozen(doc)).to.eql(true);
    });

    e.it('isAutomerge', (e) => {
      const doc = Automerge.init();
      expect(Automerge.isAutomerge(doc)).to.eql(true);
      expect(Automerge.isAutomerge({})).to.eql(false);
    });

    e.describe('actorId', (e) => {
      e.it('getActorId', () => {
        const doc = Automerge.from<Doc>(DEFAULT.doc);
        const id = Automerge.getActorId(doc);
        expect(id.length).to.greaterThan(25);
        expect(typeof id).to.eql('string');
      });

      e.it('custom id (via `.init`)', () => {
        const actorId = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        const doc = Automerge.init(actorId);
        expect(Automerge.getActorId(doc)).to.eql(actorId);
      });

      e.it('custom id (via `.from`)', () => {
        const initial: Doc = DEFAULT.doc;
        const actorId = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        const doc = Automerge.from<Doc>(initial, actorId);
        expect(doc).to.eql(initial);
        expect(Automerge.getActorId(doc)).to.eql(actorId);
      });
    });

    e.describe('change (immutable mutation)', (e) => {
      e.it('named change "add card"', () => {
        const doc1 = Automerge.from<Doc>(DEFAULT.doc);
        const doc2 = Automerge.change<Doc>(doc1, 'Add card', (doc) => {
          doc.cards.push({ title: 'hello', done: false, count: 0 });
        });

        expect(doc2).to.not.equal(doc1); // NB: Different instance.

        expect(doc1).to.eql({ cards: [] });
        expect(doc2).to.eql({ cards: [{ title: 'hello', done: false, count: 0 }] });
      });

      e.it('`.getChanges` retrieves change-set (Uint8Array)', () => {
        const doc1 = Automerge.from<Doc>(DEFAULT.doc);
        const doc2 = Automerge.change<Doc>(doc1, 'Add card', (doc) => {
          doc.cards.push({ title: 'hello', done: false, count: 0 });
        });

        const changes = Automerge.getChanges<Doc>(doc1, doc2);
        expect(changes[0] instanceof Uint8Array).to.eql(true);
      });

      e.it('`delete obj.prop` => undefined', () => {
        let doc = createTestDoc();

        doc = Automerge.change<Doc>(doc, (draft) => (draft.name = 'hello'));
        expect(doc.name).to.eql('hello');

        doc = Automerge.change<Doc>(doc, (draft) => {
          delete draft.name;
        });

        expect(doc.name).to.eql(undefined);
      });
    });

    e.describe('type manipulations (immutable)', (e) => {
      let doc = createTestDoc();
      const getAndChange = (fn: (json: any) => void) => {
        doc = Automerge.change<Doc>(doc, (draft) => {
          if (!draft.json) draft.json = {};
          fn(draft.json);
        });
        return doc;
      };

      e.it('string', () => {
        const doc = getAndChange((doc) => (doc.value = 'hello'));
        expect(doc.json?.value).to.eql('hello');
      });

      e.it('boolean', () => {
        let doc = getAndChange((doc) => (doc.value = true));
        expect(doc.json?.value).to.eql(true);

        doc = getAndChange((doc) => (doc.value = false));
        expect(doc.json?.value).to.eql(false);
      });

      e.it('number', () => {
        const doc = getAndChange((doc) => (doc.value = 1234));
        expect(doc.json?.value).to.eql(1234);
      });

      e.it('null', () => {
        const doc = getAndChange((doc) => (doc.value = null));
        expect(doc.json?.value).to.eql(null);
      });

      e.it('[ array ]', () => {
        const list = [1, 'two', true, {}, [123], null];
        const doc = getAndChange((doc) => (doc.value = list));

        expect(doc.json?.value).to.eql(list);

        // NB: immutable (not same instance of array)
        expect(doc.json?.value).to.not.equal(list);
        expect(doc.json?.value[3]).to.not.equal(list[3]); // object
        expect(doc.json?.value[4]).to.not.equal(list[4]); // array
      });

      e.describe('[ array ] methods', (e) => {
        e.it('.insertAt', () => {
          const doc = Automerge.change<Doc>(createTestDoc(), (draft) => {
            draft.cards.push({ title: 'item-1', done: false, count: 0 });
            draft.cards.insertAt?.(1, { title: 'item-2', done: false, count: 0 });
          });

          expect(doc.cards.length).to.eql(2);
          expect(doc.cards[0].title).to.eql('item-1');
          expect(doc.cards[1].title).to.eql('item-2');
        });

        e.it('.deleteAt', () => {
          const doc = Automerge.change<Doc>(createTestDoc(), (draft) => {
            draft.cards.insertAt?.(0, { title: 'item-1', done: false, count: 0 });
            draft.cards.insertAt?.(1, { title: 'item-2', done: false, count: 0 });
            draft.cards.deleteAt?.(0);
          });
          expect(doc.cards.length).to.eql(1);
          expect(doc.cards[0].title).to.eql('item-2');
          expect(doc.cards[1]).to.eql(undefined);
        });
      });

      e.it('{ object }', () => {
        const obj = { msg: 'hello', count: 123, list: [1, 2, 3], child: { enabled: true } };
        const doc = getAndChange((doc) => (doc.value = obj));

        expect(doc.json?.value).to.eql(obj);

        // NB: immutable (not same instance of array)
        expect(doc.json?.value).to.not.equal(obj);
        expect(doc.json?.value.list).to.not.equal(obj.list);
        expect(doc.json?.value.child).to.not.equal(obj.child);
      });

      e.describe('edge cases', (e) => {
        e.it('error: cannot write an { value: <undefined> } object', (e) => {
          // NB: This is a limitation of the underlying Automerge library.
          let doc = createTestDoc();
          const fn = () => {
            doc = Automerge.change<Doc>(doc, (d) => (d.json = { value: undefined }));
          };
          expect(fn).to.throw(/Unsupported type of value: undefined/);
        });

        e.it('can write a { value: <null> } object', (e) => {
          let doc = createTestDoc();
          doc = Automerge.change<Doc>(doc, (d) => (d.json = { value: null }));
          expect(doc.json.value).to.eql(null);
        });
      });
    });
  });

  e.describe('multi-document merge', (e) => {
    /**
     * Based on sample in README
     * https://github.com/automerge/automerge
     */
    e.it('simple merge', () => {
      /**
       * Initial document: "doc1"
       */
      let doc1 = createTestDoc();
      doc1 = Automerge.change<Doc>(doc1, 'Add card', (doc) => {
        doc.cards.push({ title: 'hello-1a', done: false, count: 0 });
      });
      doc1 = Automerge.change<Doc>(doc1, 'Add another card', (doc) => {
        doc.cards.push({ title: 'hello-2a', done: false, count: 0 });
      });

      expect(doc1).to.eql({
        cards: [
          { title: 'hello-1a', done: false, count: 0 },
          { title: 'hello-2a', done: false, count: 0 },
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
        [null, 0],
        ['Add card', 1],
        ['Add another card', 2],
        ['Mark card as complete', 2],
        ['Delete card', 1],
      ]);
    });
  });

  e.describe('conflicts', (e) => {
    /**
     * REF:
     *    https://automerge.org/docs/cookbook/conflicts/
     */
    e.it('getConflicts', async (e) => {
      type T = { x: number };
      let docA = Automerge.change(Automerge.init<T>(), (d) => (d.x = 1));
      let docB = Automerge.change(Automerge.init<T>(), (d) => (d.x = 2));

      docA = Automerge.merge(docA, docB);
      docB = Automerge.merge(docB, docA);
      expect(docA).to.eql(docB);

      const conflictsA = Automerge.getConflicts<T>(docA, 'x');
      const conflictsB = Automerge.getConflicts<T>(docB, 'x');
      expect(conflictsA).to.eql(conflictsB);

      const entries = Object.entries(conflictsA ?? {});
      expect(entries.length).to.eql(2);

      console.log('docA.x', docA.x);
      console.log('docB.x', docB.x);
      // expect(entries[0][1]).to.eql(!docA.x);
      // expect(entries[1][1]).to.eql(docA.x);

      console.log('conflictsA', { x: conflictsA });
      console.log('conflictsB', { x: conflictsB });

      console.log('conflictsA.x', conflictsA?.x);
      console.log('typeof conflictsA', typeof conflictsA);
      console.log('Object.keys(conflictsA ?? {})', Object.keys(conflictsA ?? {}));
      console.log('Object.entries(conflictsA ?? {})', Object.entries(conflictsA ?? {}));

      const historyA = Automerge.getHistory(docA);
      const historyB = Automerge.getHistory(docA);

      console.log('-------------------------------------------');
      console.log('historyA', historyA);
      console.log('historyB', historyB);

      console.log('historyA[0].snapshot', historyA[0].snapshot);
      console.log('historyA[1].snapshot', historyA[1].snapshot);
      console.log('historyA[0].snapshot.x', historyA[0].snapshot.x);
      console.log('historyA[1].snapshot.x', historyA[1].snapshot.x);
    });
  });
});
