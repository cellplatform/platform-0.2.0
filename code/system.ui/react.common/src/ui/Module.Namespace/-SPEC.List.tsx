import { css, Dev, type t } from '../../test.ui';
import { DEFAULTS, ModuleNamespace } from '.';
import { WrangleSpec } from './-SPEC.wrangle';

type T = {
  props: t.ModuleNamespaceListProps;
  debug: { debugBg?: boolean; debugFill?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec: ModuleNamespace.List
 */
const name = `${DEFAULTS.displayName}.List`;
export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <ModuleNamespace.List {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('', (dev) => {
      const link = WrangleSpec.link;
      link(dev, 'see: ModuleNamespace', 'Module.Namespace');
    });
    dev.hr(5, 20);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
