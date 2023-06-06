import { Dev, css } from '../../test.ui';
import { type TestCtx } from '../TestRunner/-dev/-types.mjs';

type T = { ctx: TestCtx };
const initial: T = {
  ctx: { fail: false, delay: 300 },
};

export default Dev.describe('BDD (TestRunner)', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <div {...css({ padding: 10, userSelect: 'none' })}>{`🐷`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.bdd((runner) =>
      runner
        .enabled(true)
        .run({ label: 'Foobar', infoUrl: location.href, ctx: () => state.current.ctx })
        .list([
          import('../TestRunner/-dev/-TEST.sample-1.mjs'),
          'MyTitle',
          import('../TestRunner/-dev/-TEST.sample-2.mjs'),
          import('../TestRunner/-dev/-TEST.controller.mjs'),
        ])
        .onChange((e) => {
          console.info(`⚡️ onChange:`, e);
        }),
    );
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'BDD'} data={data} expand={1} />;
    });
  });
});
