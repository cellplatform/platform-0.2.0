import { Automerge } from '..';
import { expect, Test } from '../../test.ui';

export default Test.describe('Intro (basic sequence)', (e) => {
  /**
   * Unit test version of the basic "quick start" getting sequence.
   * REF:
   *   https://automerge.org/docs/quickstart
   */
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
