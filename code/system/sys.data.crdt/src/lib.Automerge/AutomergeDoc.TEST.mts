import { Automerge } from '../common/index.mjs';
import { describe, expect, it } from '../test/index.mjs';
import { AutomergeDoc } from './index.mjs';

describe('AutomergeDoc (helpers)', () => {
  describe('init', (e) => {
    type D = { count: Automerge.Counter; msg?: string };

    it('create with initial setup', () => {
      const doc = AutomergeDoc.init<D>((doc) => {
        doc.count = new Automerge.Counter();
        doc.msg = 'hello';
      });

      expect(doc.count.value).to.eql(0);
      expect(doc.msg).to.eql('hello');
      expect(Automerge.getActorId(doc)).not.to.eql('0000'); // NB: Used internally within the helper method.
    });
  });
});
