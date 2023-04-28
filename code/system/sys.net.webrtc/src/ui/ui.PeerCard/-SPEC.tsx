import { PeerCard, PeerCardProps } from '.';
import { Dev, PropList, t, TestNetwork, WebRtc } from '../../test.ui';

type T = { props: PeerCardProps };
const initial: T = { props: {} };

type LocalStore = { backgroundUrl?: string; fields?: t.ConnectInputField[] };
const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerCard');
const local = localstore.object({
  backgroundUrl: initial.props.backgroundUrl,
  fields: initial.props.fields,
});

export default Dev.describe('PeerCard', async (e) => {
  const self = await TestNetwork.peer();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.backgroundUrl = local.backgroundUrl;
      d.props.fields = local.fields;
    });

    ctx.subject
      .backgroundColor(1)
      .size([400, 320])
      .display('grid')
      .render<T>((e) => {
        return <PeerCard {...e.state.props} self={self} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.row((e) => {
      return (
        <WebRtc.InfoCard
          fields={['Module.Verify', 'Module']}
          data={{ self: { peer: self } }}
          margin={[0, 20, 0, 20]}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.row((e) => {
        return (
          <PropList.FieldSelector
            style={{ Margin: [10, 20, 0, 20] }}
            all={PeerCard.FIELDS}
            selected={e.state.props.fields ?? PeerCard.DEFAULTS.fields}
            onClick={(ev) => {
              const fields = ev.next as t.ConnectInputField[];
              dev.change((d) => (d.props.fields = fields));
              local.fields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });

      dev.textbox((txt) =>
        txt
          .label((e) => 'backgroundUrl')
          .value((e) => local.backgroundUrl ?? '')
          .margin([10, 0, 0, 0])
          .onChange((e) => {
            local.backgroundUrl = e.to.value;
            e.redraw();
          })
          .onEnter((e) => {
            e.change((d) => (d.props.backgroundUrl = local.backgroundUrl));
            e.redraw();
          }),
      );
    });
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'PeerCard'} data={data} expand={1} />;
    });
  });
});
