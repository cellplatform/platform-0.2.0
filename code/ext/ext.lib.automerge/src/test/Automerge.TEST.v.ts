import { A, describe, expect, it } from '../test';

/**
 * Tests of the Automerge library itself.
 */
describe('Automerge', () => {
  type D = { count: number };

  /**
   * Hard coded byte array hack.
   * https://automerge.org/docs/cookbook/modeling-data/#setting-up-an-initial-document-structure
   *   - https://discord.com/channels/1200006940210757672/1231799313995403384
   *   - https://discord.com/channels/1200006940210757672/1230453235207110666/1230520148478267402
   */
  describe('hard coded byte array hack', () => {
    it('init → Uint8Array → merge', () => {
      let doc1 = A.change(A.init<D>(), (d) => (d.count = 123));
      const bytes = A.save(doc1);

      let doc2 = A.load<D>(bytes);
      expect(doc1).to.eql({ count: 123 });
      expect(doc2).to.eql({ count: 123 });

      doc1 = A.change(doc1, (d) => (d.count = 456));
      doc2 = A.merge(doc2, doc1); // NB: merged two documents that were independently initialized.
      expect(doc1).to.eql({ count: 456 });
      expect(doc2).to.eql({ count: 456 });
    });
  });
});
