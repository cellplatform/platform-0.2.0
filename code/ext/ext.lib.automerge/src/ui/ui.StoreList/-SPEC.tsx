import { Dev, type t, WebStore } from '../../test.ui';
import { StoreList } from '.';
import { List } from './ui.List';
import { Info } from '../ui.Info';

type T = { props: t.StoreListProps };
const initial: T = { props: {} };
const name = StoreList.displayName ?? '';

export default Dev.describe(name, (e) => {
  const store = WebStore.init();
  const model = StoreList.Model.init(store);

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([330, null])
      .display('grid')
      .render<T>((e) => {
        const current = model.list.current;
        return (
          <List
            list={current.state}
            items={current.items}
            renderers={model.renderers}
            renderCount={{ absolute: [-20, 2, null, null], opacity: 0.2, prefix: 'list.render-' }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.row((e) => <Info fields={['Module', 'Component']} data={{ component: { name } }} />);
    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
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
