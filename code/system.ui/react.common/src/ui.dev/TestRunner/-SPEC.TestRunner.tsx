import { Dev } from '..';
import { expect } from '../../test.ui';

import type { ResultsProps } from './Results';

type Ctx = { fail: boolean };
type T = { props: ResultsProps };
const initial: T = { props: {} };

const suite = Dev.describe('root', (e) => {
  e.it('foo', async (e) => {
    expect(123).to.eql(123);
  });

  e.it('bar', async (e) => {
    const ctx = e.ctx as Ctx;
    if (ctx.fail) expect(123).to.eql(5);
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

const suiteLong = Dev.describe('root (long)', (e) => {
  Array.from({ length: 50 }).forEach((_, i) => {
    e.describe(`suite ${i + 1}`, (e) => {
      Array.from({ length: 5 }).forEach((_, i) => {
        e.it(`does thing ${i + 1}`, async (e) => {});
      });
    });
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
        return <Dev.TestRunner.Results {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section((dev) => {
      dev.button('run (success)', async (e) => {
        const ctx: Ctx = { fail: false };
        const results = await suite.run({ ctx });
        await e.change((d) => (d.props.data = results));
      });

      dev.button('run (fail)', async (e) => {
        const ctx: Ctx = { fail: true };
        const results = await suite.run({ ctx });
        await e.change((d) => (d.props.data = results));
      });

      dev.button((btn) =>
        btn
          .label('run (long)')
          .right('← overflow')
          .onClick(async (e) => {
            const results = await suiteLong.run();
            await e.change((d) => (d.props.data = results));
          }),
      );

      dev.hr(-1, 5);
      dev.button('clear', (e) => e.change((d) => (d.props.data = undefined)));
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('isSpinning')
          .value((e) => e.state.props.spinning)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'spinning'))),
      );

      dev.boolean((btn) =>
        btn
          .label('scroll')
          .value((e) => e.state.props.scroll)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'scroll'))),
      );
    });

    dev.hr(5, 20);
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.render((e) => {
      return <Dev.TestRunner.Compact />;
    });
  });
});
