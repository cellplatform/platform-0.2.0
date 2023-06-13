import { Automerge } from '..';
import { Test, expect } from '../../test.ui';

export default Test.describe('Immutability', (e) => {
  const create = () => {
    const root = {
      A: { A1: { count: 0 } },
      B: { B1: { count: 0 } },
    };
    type T = typeof root;
    return Automerge.from<T>(root);
  };

  /**
   * REF: https://automerge.slack.com/archives/C61RJCM9S/p1686562775633769
   * NB:
   *    This is used within the lens for efficient change comparison.
   */
  e.it('sub-tree change comparison (!==)', (e) => {
    const doc1 = create();
    const doc2 = Automerge.change(doc1, 'change', (doc) => doc.A.A1.count++);
    expect(doc1.A !== doc2.A).to.eql(true);
    expect(doc1.B === doc2.B).to.eql(true);
  });
});
