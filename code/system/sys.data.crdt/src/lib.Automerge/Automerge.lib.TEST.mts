import { Dev, expect } from '../test.ui';
import { Automerge } from './lib.mjs';

export default Dev.describe('Automerge (lib)', (e) => {
  /**
   * REF:
   *   https://automerge.org/docs/quickstart
   */
  e.describe('Basic sequence', (e) => {
    type Card = { title: string; done: boolean };
    type T = { cards: Card[] };
    type Doc = Automerge.Doc<T>;

    let doc1: Doc;
    let doc2: Doc;
    let final: Doc;

    e.it('initialize doc-1', (e) => {
      doc1 = Automerge.init<T>();

      doc1 = Automerge.change(doc1, 'add card', (doc) => {
        doc.cards = [] as unknown as Automerge.List<Card>;
        doc.cards.push({ title: 'my first thing', done: false });
        doc.cards.push({ title: 'a second thing', done: false });
      });
    });

    e.it('variant 1: load doc-2 via merge', (e) => {
      doc2 = Automerge.init<T>();
      doc2 = Automerge.merge(doc2, doc1);
      expect(doc2).to.eql(doc1);
    });

    e.it('variant 2: load doc-2 from binary', (e) => {
      const binary = Automerge.save(doc1);
      const local = Automerge.load<T>(binary);
      expect(local).to.eql(doc1);
    });

    e.it('make non-conflicting changes', (e) => {
      doc1 = Automerge.change(doc1, 'mark card as done', (doc) => {
        doc.cards[0].done = true;
      });
      doc2 = Automerge.change(doc2, 'delete card', (doc) => {
        delete doc.cards[1];
      });
      expect(doc1).to.not.eql(doc2);
    });

    e.it('merge changes (final document)', (e) => {
      final = Automerge.merge(doc1, doc2);
      expect(final).to.eql({ cards: [{ title: 'my first thing', done: true }] });
    });

    e.it('change history', (e) => {
      const history = Automerge.getHistory(final);
      const res = history.map((state) => [state.change.message, state.snapshot.cards.length]);
      expect(res).to.eql([
        ['add card', 2],
        ['mark card as done', 2],
        ['delete card', 1],
      ]);
    });
  });

  e.describe('API', (e) => {
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
      });
    });
  });
});
