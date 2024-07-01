import { describe, it, expect, type t } from '../test';
import { Test } from '..';
import { ResultTree } from '.';

describe('ResultTree', () => {
  describe('walkDown', () => {
    it('to bottom', async (e) => {
      const suite = Test.describe('root', (e) => {
        e.it('foo-1', (e) => {});
        e.describe('child', (e) => {
          e.it('foo-2', (e) => {});
        });
      });

      const results = await suite.run();
      const list: t.ResultWalkDownArgs[] = [];
      ResultTree.walkDown(results, (e) => list.push(e));

      expect(list.length).to.eql(4);
      expect(list[0].suite.description).to.eql('root');
      expect(list[0].test).to.eql(undefined);
      expect(list[3].test?.description).to.eql('foo-2');
    });

    it('stops', async (e) => {
      const suite = Test.describe('root', (e) => {
        e.it('foo-1', (e) => {});
        e.describe('child', (e) => {
          e.it('foo-2', (e) => {});
        });
      });

      const results = await suite.run();
      const list: t.ResultWalkDownArgs[] = [];
      ResultTree.walkDown(results, (e) => {
        list.push(e);
        if (e.test?.description === 'foo-1') e.stop();
      });

      expect(list.length).to.eql(2);
      expect(list[0].suite.description).to.eql('root');
      expect(list[1].test?.description).to.eql('foo-1');
    });
  });

  describe('isEmpty', () => {
    it('undefined (empty: true)', async () => {
      const res = ResultTree.isEmpty(undefined);
      expect(res).to.eql(true);
    });

    it('not empty', async () => {
      const suite = Test.describe('root', (e) => {
        e.it.skip('foo-1', (e) => {});
        e.describe('child', (e) => {
          e.it('foo-2', (e) => {});
        });
      });
      const res = ResultTree.isEmpty(await suite.run());
      expect(res).to.eql(false);
    });

    it('empty: tests skipped', async () => {
      const suite = Test.describe('root', (e) => {
        e.it.skip('foo-1', (e) => {});
        e.describe('child', (e) => {
          e.it.skip('foo-2', (e) => {});
        });
      });
      const res = ResultTree.isEmpty(await suite.run());
      expect(res).to.eql(true);
    });

    it('empty: root skipped', async () => {
      const suite = Test.describe.skip('root', (e) => {
        e.it('foo-1', (e) => {});
        e.describe('child', (e) => {
          e.it('foo-2', (e) => {});
        });
      });

      const res = ResultTree.isEmpty(await suite.run());
      expect(res).to.eql(true);
    });

    it('not empty: descendent .only', async () => {
      const suite1 = Test.describe('root', (e) => {
        e.it('foo-1', (e) => {});
        e.describe.only('child', (e) => {
          e.it('foo-2', (e) => {});
        });
      });

      const suite2 = Test.describe('root', (e) => {
        e.it('foo-1', (e) => {});
        e.describe('child', (e) => {
          e.it.only('foo-2', (e) => {});
        });
      });

      const res1 = ResultTree.isEmpty(await suite1.run());
      const res2 = ResultTree.isEmpty(await suite2.run());

      expect(res1).to.eql(false);
      expect(res2).to.eql(false);
    });
  });
});
