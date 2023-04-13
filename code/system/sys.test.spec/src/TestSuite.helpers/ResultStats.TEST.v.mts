import { ResultStats } from '.';
import { describe, expect, it, t, Test } from '../test';

describe('ResultStats', () => {
  const toResults = async (input: t.TestSuiteModel) => {
    await input.init();
    const results = await input.run();
    const stats = ResultStats.suite(results);
    return { results, stats };
  };

  it('empty', async () => {
    const root = Test.describe('root', (e) => {});
    const { stats } = await toResults(root);

    expect(stats.total).to.eql(0);
    expect(stats.succeeded).to.eql(0);
    expect(stats.failed).to.eql(0);
    expect(stats.skipped).to.eql(0);
    expect(stats.only).to.eql(0);
  });

  it('succeeded', async () => {
    const root = Test.describe('root', (e) => {
      e.it('foo', (e) => {});
    });

    const { stats } = await toResults(root);
    expect(stats.total).to.eql(1);
    expect(stats.succeeded).to.eql(1);
    expect(stats.failed).to.eql(0);
    expect(stats.skipped).to.eql(0);
    expect(stats.only).to.eql(0);
  });

  it('failures', async () => {
    const root = Test.describe('root', (e) => {
      e.it('good', (e) => {});
      e.describe('things', (e) => {
        e.it('foo', (e) => {
          expect(123).to.eql(456);
        });
      });
    });

    const { stats } = await toResults(root);
    expect(stats.total).to.eql(2);
    expect(stats.succeeded).to.eql(1);
    expect(stats.failed).to.eql(1);
    expect(stats.skipped).to.eql(0);
    expect(stats.only).to.eql(0);
  });

  it('skipped', async () => {
    const root = Test.describe('root', (e) => {
      e.it('good', (e) => {});
      e.describe('things', (e) => {
        e.it.skip('foo', (e) => {});
      });
    });

    const { stats } = await toResults(root);
    expect(stats.total).to.eql(2);
    expect(stats.succeeded).to.eql(1);
    expect(stats.failed).to.eql(0);
    expect(stats.skipped).to.eql(1);
    expect(stats.only).to.eql(0);
  });

  it('skipped (via it.only)', async () => {
    const root = Test.describe('root', (e) => {
      e.it('good', (e) => {});
      e.describe('things', (e) => {
        e.it.only('foo', (e) => {});
        e.it('bar', (e) => expect(123).to.eql(456)); // NB: Failing test not run.
        e.it.only('zoo', (e) => {});
      });
      e.it.skip('skipped', (e) => {});
    });

    const { stats } = await toResults(root);
    expect(stats.total).to.eql(5);
    expect(stats.succeeded).to.eql(2);
    expect(stats.failed).to.eql(0);
    expect(stats.skipped).to.eql(1);
    expect(stats.only).to.eql(2);
  });

  it('skipped (via describ.only', async () => {
    const root = Test.describe('root', (e) => {
      e.it('one', (e) => {});
      e.describe.only('things', (e) => {
        e.it('foo', (e) => {});
        e.it.skip('bar', (e) => expect(123).to.eql(456)); // NB: Failing test not run.
        e.it('zoo', (e) => {});
      });
      e.it('two', (e) => {});
    });

    const { stats } = await toResults(root);
    expect(stats.total).to.eql(5);
    expect(stats.succeeded).to.eql(2);
    expect(stats.failed).to.eql(0);
    expect(stats.skipped).to.eql(1);
    expect(stats.only).to.eql(2);
  });
});
