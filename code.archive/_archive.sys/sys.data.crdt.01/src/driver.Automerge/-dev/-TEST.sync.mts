import { Automerge } from '..';
import { expect, Test } from '../../test.ui';

export default Test.describe('Sync protocol', (e) => {
  /**
   * https://github.com/automerge/automerge/blob/main/SYNC.md
   */
  e.describe('sync: changes interface', (e) => {
    type Card = { title: string; done: boolean; count: number };
    type Doc = {
      name?: string;
      cards: Automerge.List<Card>; // NB: An [Array] type with extension methods (eg. insertAt)
      json?: any;
    };

    function createTestDoc() {
      const doc = Automerge.init<Doc>();
      return Automerge.change(doc, (doc) => {
        doc.cards = [] as unknown as Automerge.List<Card>;
      });
    }

    e.it('getChanges → applyChanges', () => {
      const A1 = createTestDoc();
      const B1 = Automerge.merge(Automerge.init<Doc>(), A1);

      // Make some changes to doc-A.
      const A2a = Automerge.change<Doc>(A1, (doc) => (doc.name = 'foo'));
      const A2b = Automerge.change<Doc>(A2a, (doc) => (doc.name = 'foobar'));

      const changes = Automerge.getChanges(A1, A2b);
      expect(changes.length).to.eql(2);

      // Apply changes to doc-B
      const [C1] = Automerge.applyChanges(B1, changes);
      expect(C1.name).to.eql('foobar');
    });
  });

  /**
   * Network synchronization (using "bloom filters").
   *
   * Refs:
   *    Paper (Theory):       https://arxiv.org/abs/2012.00472
   *    Blog Post:            https://martin.kleppmann.com/2020/12/02/bloom-filter-hash-graph-sync.html
   *    Lib Unit-Tests:       https://github.com/automerge/automerge/blob/main/test/sync_test.js#L15-L35
   *
   */
  e.describe('sync: protocol - "bloom filters"', (e) => {
    function sync<D>(
      a: Automerge.Doc<D>,
      b: Automerge.Doc<D>,
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

    e.it('[n1] should offer all changes to [n2] when starting from nothing', () => {
      type D = { list: number[] };

      function createDoc() {
        const doc = Automerge.init<D>();
        return Automerge.change(doc, (doc) => {
          doc.list = [] as unknown as Automerge.List<number>;
        });
      }

      const test = (n1: D, n2: D) => {
        // Make changes for [n1] that [n2] should request.
        Array.from({ length: 3 }).forEach(
          (_, i) => (n1 = Automerge.change(n1, { time: 0 }, (doc) => doc.list.push(i))),
        );

        expect(n1).to.not.eql(n2);
        expect(n1.list.length).to.eql(3);

        const synced = sync(n1, n2);
        expect(synced.a).to.eql(synced.b);
      };

      test(createDoc(), Automerge.init<D>());
      test(createDoc(), createDoc());
    });

    e.it('should sync peers where one has commits the other does not', () => {
      type D = { list: number[]; msg?: string };

      function createDoc() {
        const doc = Automerge.init<D>();
        return Automerge.change(doc, (doc) => {
          doc.list = [] as unknown as Automerge.List<number>;
        });
      }

      let n1 = createDoc();
      let n2 = Automerge.init<D>();

      // Make changes for n1 that n2 should request.
      Array.from({ length: 3 }).forEach(
        (_, i) => (n1 = Automerge.change(n1, { time: 0 }, (doc) => doc.list.push(i))),
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
