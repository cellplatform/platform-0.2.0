import { Dev } from '..';
import { expect } from '../../test.ui';
import { t } from '../common';

type T = { results?: t.TestSuiteRunResponse };

const root = Dev.describe('root spec', (e) => {
  e.it('foo', async (e) => {
    expect(123).to.eql(123);
  });

  e.it('fail', async (e) => {
    expect(123).to.eql(5);
  });

  e.it.skip('skipped test', async (e) => {});
  e.it(`TODO: ${Dev.Lorem.toString()}`, async (e) => {});
  e.it(`TODO: short`, async (e) => {});
});

export default Dev.describe('TestRunner', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        return (
          <div style={{ padding: 10 }}>
            <Dev.TestRunner.Results data={e.state.results} />
          </div>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, {});

    dev.button('run test', async (e) => {
      const results = await root.run();
      await e.change((d) => (d.results = results));
    });

    dev.button('clear', (e) => e.change((d) => (d.results = undefined)));

    dev.hr();
    dev.row((e) => {
      return <Dev.TestRunner.Compact />;
    });
  });
});
