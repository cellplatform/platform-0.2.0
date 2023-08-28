import { Test, expect } from '../test.ui';
import { Repo } from '@automerge/automerge-repo';

/**
 * https://github.com/automerge/automerge-repo
 */
export default Test.describe('Driver: automerge-repo', (e) => {
  e.it('sample', async (e) => {
    /**
     * TODO 🐷
     */
    console.log('Repo', Repo);
    expect(Repo).to.exist;
  });
});
