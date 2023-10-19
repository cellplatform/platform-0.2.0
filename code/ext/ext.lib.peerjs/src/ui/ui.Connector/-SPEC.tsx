import { Dev, Webrtc, type t } from '../../test.ui';

import { Connector } from '.';
import { Info } from '../ui.Info';
import { List } from './ui.List';

type T = { props: t.ConnectorProps };
const initial: T = { props: {} };
const name = Connector.displayName ?? '';

export default Dev.describe(name, (e) => {
  const model = Connector.Model.List.init();
  const { list } = model;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    list.events().$.subscribe((e) => {
      console.log('(Model) List.$:', e); // TEMP 🐷
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([330, null])
      .display('grid')
      .render<T>((e) => {
        const renderCount: t.RenderCountProps = {
          absolute: [-20, 2, null, null],
          opacity: 0.2,
          prefix: 'list.render-',
        };
        return <List list={list} debug={{ renderCount }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.row((e) => <Info fields={['Module', 'Component']} data={{ component: { name } }} />);
    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button(['generate → peer:uri → copy', '🌳'], (e) => {
        const peeruri = Webrtc.Peer.Uri.generate();
        navigator.clipboard.writeText(peeruri);
      });

      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: e.state.props,
        'model.list': list.current,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
