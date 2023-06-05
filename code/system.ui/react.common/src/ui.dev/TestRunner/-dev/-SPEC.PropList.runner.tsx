import { Dev, Pkg, type t, type TestCtx } from './-common.mjs';
import { PropList } from '../../../ui/PropList';

type T = { ctx: TestCtx };
const initial: T = { ctx: { fail: false, delay: 2000 } };

export default Dev.describe('TestPropList.runner', (e) => {
  type LocalStore = TestCtx & {};
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.common.TestRunner.PropsList.runner');
  const local = localstore.object({
    fail: initial.ctx.fail,
    delay: initial.ctx.delay,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.ctx.delay = local.delay;
      d.ctx.fail = local.fail;
    });

    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size([330, null])
      .display('grid')
      .render<T>((e) => {
        /**
         * NB: Sample shows the "single runner" usage option
         *     This is useful when the runner is being embedded
         *     in another module's <Info> prop-list.
         */
        const runner = Dev.TestRunner.PropList.runner({
          ctx: () => state.current.ctx,
          all: [
            import('./-TEST.sample-1.mjs'),
            import('./-TEST.sample-2.mjs'),
            import('./-TEST.controller.mjs'),
          ],
        });

        return (
          <PropList
            items={[
              runner,
              { label: 'Module', value: Pkg.name },
              { label: 'Version', value: Pkg.version },
            ]}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `ctx.fail = ${e.state.ctx.fail}`)
          .value((e) => e.state.ctx.fail)
          .onClick((e) => e.change((d) => (local.fail = Dev.toggle(d.ctx, 'fail')))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `ctx.delay = ${e.state.ctx.delay}ms`)
          .value((e) => e.state.ctx.delay === initial.ctx.delay)
          .onClick((e) => {
            e.change((d) => {
              const defaultDelay = initial.ctx.delay;
              const next = d.ctx.delay === defaultDelay ? 300 : defaultDelay;
              local.delay = d.ctx.delay = next;
            });
          }),
      );
    });

    dev.hr(5, 20);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'TestPropList.runner'} data={data} expand={1} />;
    });
  });
});
