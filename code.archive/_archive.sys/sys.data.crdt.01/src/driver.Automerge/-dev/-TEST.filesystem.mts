import { Automerge } from '..';
import { expect, Test, TestFilesystem } from '../../test.ui';

export default Test.describe('Filesystem', (e) => {
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

  e.describe('filesystem (Uint8Array)', (e) => {
    async function getSampleDoc() {
      const doc = createTestDoc();
      return Automerge.change<Doc>(doc, 'Add card', (doc) => {
        doc.cards.push(DEFAULT.card);
      });
    }

    e.it('save binary', async () => {
      const { fs, dispose } = TestFilesystem.memory();
      const path = 'myfile.crdt';
      const doc = await getSampleDoc();

      const binary = Automerge.save(doc);
      expect(binary instanceof Uint8Array).to.eql(true);

      expect(await fs.exists(path)).to.eql(false);
      await fs.write(path, binary);
      expect(await fs.exists(path)).to.eql(true);

      dispose();
    });

    e.it('load from saved binary', async () => {
      const { fs, dispose } = TestFilesystem.memory();
      const path = 'myfile.crdt';
      const doc1 = await getSampleDoc();

      const STATE = { cards: [DEFAULT.card] };
      expect(doc1).to.eql(STATE);

      await fs.write(path, Automerge.save(doc1));
      const binary = (await fs.read(path))!;

      const doc2 = Automerge.load(binary);
      expect(doc2).to.eql(STATE);

      const { getActorId } = Automerge;
      expect(getActorId(doc1)).to.not.eql(getActorId(doc2));

      dispose();
    });

    e.it('getLastLocalChange (saving a log of changes)', async () => {
      const { fs, dispose } = TestFilesystem.memory();

      const saveChange = async (doc: Doc, path: string) => {
        const binary = Automerge.getLastLocalChange(doc);
        await fs.write(path, binary);
      };

      const A1 = await getSampleDoc();
      const B1a = Automerge.merge(Automerge.init<Doc>(), A1);
      const B1b = Automerge.merge(Automerge.init<Doc>(), A1);

      await saveChange(A1, 'crdt/1');

      const A2 = Automerge.change<Doc>(A1, (doc) => {
        doc.cards[0].count++;
        doc.cards[0].title = 'foo';
      });

      await saveChange(A2, 'crdt/2');

      const file1 = (await fs.read('crdt/1'))!;
      const file2 = (await fs.read('crdt/2'))!;

      const [C1a] = Automerge.applyChanges(B1a, [file1, file2]);
      const [C1b] = Automerge.applyChanges(B1b, [file2, file1]); // NB: Different order.

      expect(C1a.cards[0].count).to.eql(1);
      expect(C1a.cards[0].title).to.eql('foo');

      expect(C1b.cards[0].count).to.eql(1);
      expect(C1b.cards[0].title).to.eql('foo');

      dispose();
    });

    e.it('getLastLocalChange: undefined (no change)', async (e) => {
      let doc = Automerge.init<Doc>();
      const changeA = Automerge.getLastLocalChange(doc);
      expect(changeA).to.eql(undefined);

      doc = Automerge.change<Doc>(doc, (d) => null); // NB: do nothing.
      const changeB = Automerge.getLastLocalChange(doc);
      expect(changeB).to.eql(undefined);

      doc = Automerge.change<Doc>(doc, (d) => (d.name = 'foo'));
      const changeC = Automerge.getLastLocalChange(doc);
      expect(changeC).to.be.instanceOf(Uint8Array);
    });

    e.it('getLastLocalChange: apply multiple times', async (e) => {
      let doc1 = Automerge.init<Doc>();
      let doc2 = Automerge.init<Doc>();

      doc1 = Automerge.change<Doc>(doc1, (d) => (d.name = 'foo'));
      const change = Automerge.getLastLocalChange(doc1)!;
      expect(change).to.be.instanceOf(Uint8Array);

      [doc2] = Automerge.applyChanges(doc2, [change]);
      [doc2] = Automerge.applyChanges(doc2, [change]); // NB: repeat with applied change.
      [doc2] = Automerge.applyChanges(doc2, [change]); // NB: repeat with applied change.

      expect(doc2.name).to.eql('foo');
    });
  });
});
