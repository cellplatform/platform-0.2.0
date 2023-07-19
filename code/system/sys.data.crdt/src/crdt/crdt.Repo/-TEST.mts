import { CrdtRepo } from '.';
import { Test, expect } from '../../test.ui';

export default Test.describe('Repo', (e) => {
  e.describe('create', (e) => {
    e.it('CrdtRepo.init', (e) => {
      const repo = CrdtRepo.init();
      expect(repo.kind).to.eql('Crdt:Repo');
      repo.dispose();
    });

    e.it('Crdt.repo (← exposed as library entry)', () => {
      const repo = CrdtRepo.init();
      expect(repo.kind).to.eql('Crdt:Repo');
      repo.dispose();
    });
  });

  e.describe('dispose', (e) => {
    e.it('lifecycle', (e) => {
      const repo = CrdtRepo.init();

      let fired = 0;
      repo.dispose$.subscribe(() => fired++);

      expect(repo.disposed).to.eql(false);

      repo.dispose();
      repo.dispose();
      repo.dispose();

      expect(fired).to.eql(1);
      expect(repo.disposed).to.eql(true);
    });
  });
});
