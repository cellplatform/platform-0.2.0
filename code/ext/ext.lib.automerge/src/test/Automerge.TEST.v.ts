import { A, describe, expect, it } from '../test';

describe('Automerge', () => {
  /**
   * https://automerge.org/docs/cookbook/modeling-data/#setting-up-an-initial-document-structure
   */
  it('"hard coded byte array" hack', () => {
    type TDoc = { count: number };
    const doc1 = A.change(A.init<TDoc>(), (d) => (d.count = 123));
    const bytes = A.save(doc1);

    const doc2 = A.load<TDoc>(bytes);
    expect(doc2).to.eql({ count: 123 });
  });
});
