import { A, describe, expect, it } from '../test';

/**
 * Tests of the Automerge library itself.
 */
describe('Automerge', () => {
  /**
   * Hard coded byte array hack.
   * https://automerge.org/docs/cookbook/modeling-data/#setting-up-an-initial-document-structure
   */
  it('hard coded byte array hack', () => {
    type TDoc = { count: number };
    let doc1 = A.change(A.init<TDoc>(), (d) => (d.count = 123));
    const bytes = A.save(doc1);

    let doc2 = A.load<TDoc>(bytes);
    expect(doc1).to.eql({ count: 123 });
    expect(doc2).to.eql({ count: 123 });

    doc1 = A.change(doc1, (d) => (d.count = 456));
    doc2 = A.merge(doc2, doc1); // NB: merged two documents that were independently initialized.
    expect(doc1).to.eql({ count: 456 });
    expect(doc2).to.eql({ count: 456 });
  });
});
