import { Dev, type t } from '../../test.ui';
import { CrdtNamespaceItem } from '.';

type T = { props: t.CrdtNamespaceItemProps };
const initial: T = { props: {} };

export default Dev.describe('CrdtNamespaceItem', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <CrdtNamespaceItem {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.TODO();
    // dev.button('tmp', (e) => e.change((d) => d.count++));
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Namespace.Item'} data={data} expand={1} />;
    });
  });
});
