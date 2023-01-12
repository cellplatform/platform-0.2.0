import { Dev } from '..';
import { expect } from '../../test.ui';
import { Color, css, t, Button } from '../common';
import { Results, RunnerCompact } from '.';

type T = { results?: t.TestSuiteRunResponse };

const root = Dev.describe('root spec', (e) => {
  e.it('foo', async (e) => {
    expect(123).to.eql(123);
  });

  e.it('fail', async (e) => {
    expect(123).to.eql(5);
  });
});

export default Dev.describe('TestRunner', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component
      .size('fill')
      .display('grid')
      .backgroundColor(1)
      .render<T>((e) => {
        return (
          <div style={{ padding: 10 }}>
            <Results data={e.state.results} />
          </div>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, {});

    dev
      .button('run test', async (e) => {
        const results = await root.run();
        await e.change((d) => (d.results = results));
      })
      .button('clear', (e) => e.change((d) => (d.results = undefined)));

    dev.hr();

    dev.ctx.debug.row((e) => {
      return <RunnerCompact />;
    });
  });
});
