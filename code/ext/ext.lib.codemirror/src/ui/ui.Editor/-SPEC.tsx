import { Dev, type t } from '../../test.ui';
import { Root } from '.';

type T = { props: t.RootProps };
const initial: T = { props: {} };
const name = Root.displayName ?? '';

/**
 * Spec:
 *
 * - YAML
 *   https://discuss.codemirror.net/t/yaml-linter-for-uiw-react-codemirror-or-codemirror-v6/4976/8
 *   https://codesandbox.io/s/clever-aryabhata-o1yx07?file=/package.json
 */

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Root {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO();
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
