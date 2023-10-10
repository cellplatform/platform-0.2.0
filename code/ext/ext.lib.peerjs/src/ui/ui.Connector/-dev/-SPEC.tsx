import { Dev, type t } from '../../../test.ui';

import { Connector } from '..';
import { Info } from '../../ui.Info';
import { List } from '../ui.List';

type T = { props: t.ConnectorProps };
const initial: T = { props: {} };
const name = Connector.displayName ?? '';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    const model = Connector.Model.List.init();

    model.events().$.subscribe((e) => {
      console.log('e', e);
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([330, null])
      .display('grid')
      .render<T>((e) => {
        const current = model.current;
        return <List list={current.list} items={current.items} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO();

    dev.hr(5, 20);

    dev.row((e) => <Info fields={['Module']} />);
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
