import { Dev, Webrtc, type t } from '../../test.ui';

import { Connector } from '.';
import { Info } from '../ui.Info';
import { List } from './ui.List';
import { PeerCard } from '../ui.Sample.02/ui.PeerCard';

type T = { props: t.ConnectorProps };
const initial: T = { props: {} };
const name = Connector.displayName ?? '';

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();
  const remote = Webrtc.peer();
  const { list } = Connector.Model.List.init({ peer: self });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    list.events().$.subscribe((e) => {
      // console.log('(Model) List.$:', e); // TEMP 🐷
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
    dev.row((e) => (
      <Info
        fields={['Module', 'Component', 'Peer']}
        data={{ component: { name }, peer: { self } }}
      />
    ));
    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button(['copy: bad peerid', '💥'], (e) => {
        navigator.clipboard.writeText(Webrtc.PeerJs.Uri.generate());
      });
      dev.hr(-1, 5);
      dev.button('redraw', (e) => dev.redraw());
    });

    dev.hr(5, 20);

    dev.row((e) => {
      return <PeerCard prefix={'remote.peer:'} peer={{ self: remote, remote: self }} />;
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        peer: self.id,
        props: e.state.props,
        'model.list': list.current,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
