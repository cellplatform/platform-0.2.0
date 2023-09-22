import { Repo } from '.';
import { Test, expect } from '../test.ui';

export default Test.describe('Repo', (e) => {
  e.describe('Repo.worker (SharedWorker)', (e) => {
    e.it('register (url)', async (e) => {
      const url = 'https://foo.bar';
      Repo.worker.register(url);
      expect(Repo.worker.url).to.eql(url);

      // Singleton reference.
      const { Repo: RepoFoo } = await import('../repo/Repo');
      expect(RepoFoo.worker.url).to.eql(url);
    });
  });
});
