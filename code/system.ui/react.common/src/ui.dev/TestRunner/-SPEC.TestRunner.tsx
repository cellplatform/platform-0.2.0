import { Dev } from '..';
import { expect } from '../../test.ui';

import type { ResultsProps } from './Results';

type T = { props: ResultsProps };
const initial: T = { props: {} };

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

  e.describe.skip('skipped suite', (e) => {
    e.describe('child suite', (e) => {
      e.it('hello', async (e) => {});
    });
  });

  e.describe('child', (e) => {
    e.it('foo', async (e) => {});
    e.it.skip('bar', async (e) => {});
  });
});

export default Dev.describe('TestRunner', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        return <Dev.TestRunner.Results {...e.state.props} padding={10} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.button('run test', async (e) => {
      const results = await root.run();
      await e.change((d) => (d.props.data = results));
    });

    dev.button('clear', (e) => e.change((d) => (d.props.data = undefined)));

    dev.hr();

    dev.boolean((btn) =>
      btn
        .label('isSpinning')
        .value((e) => e.state.props.spinning)
        .onClick((e) => e.change((d) => Dev.toggle(d.props, 'spinning'))),
    );

    dev.hr();
    dev.footer.render((e) => {
      return <Dev.TestRunner.Compact />;
    });
  });
});
