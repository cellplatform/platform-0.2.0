import { PeerCard, PeerCardProps } from '.';
import { Dev, PropList, type t, TestNetwork, WebRtc, WebRtcInfo } from '../../test.ui';

type T = { props: PeerCardProps };
const initial: T = { props: {} };
const { DEFAULTS } = PeerCard;

type LocalStore = {
  fields?: t.ConnectInputField[];
  backgroundUrl?: string;
  whiteBg: boolean;
  gap: number;
  self: boolean;
};
const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerCard');
const local = localstore.object({
  backgroundUrl: initial.props.backgroundUrl,
  fields: initial.props.fields,
  gap: DEFAULTS.gap,
  whiteBg: true,
  self: true,
});

export default Dev.describe('PeerCard', async (e) => {
  const self = await TestNetwork.peer();
  const controller = WebRtc.controller(self);
  const client = controller.client();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.fields = local.fields;
      d.props.backgroundUrl = local.backgroundUrl;
      d.props.gap = local.gap;
    });

    ctx.subject
      .size([400, 320])
      .display('grid')
      .render<T>((e) => {
        ctx.subject.backgroundColor(local.whiteBg ? 1 : 0);
        return <PeerCard {...e.state.props} self={local.self ? self : undefined} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.row((e) => {
      return (
        <WebRtcInfo fields={['Module.Verify', 'Module']} client={client} margin={[0, 20, 0, 20]} />
      );
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
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
            dev.redraw();
          }),
      );

      dev.row((e) => {
        return (
          <PropList.FieldSelector
            title={'Fields'}
            style={{ Margin: [30, 20, 0, 20] }}
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
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => (local.self ? 'self (set)' : 'self (not set, spinning)'))
          .value((e) => local.self)
          .onClick((e) => {
            local.self = !local.self;
            dev.redraw();
          }),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => (local.whiteBg ? 'background (white)' : 'background (none)'))
          .value((e) => local.whiteBg)
          .onClick((e) => {
            local.whiteBg = !local.whiteBg;
            dev.redraw();
          }),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => (local.gap ? 'gap (5px)' : 'gap (none)'))
          .value((e) => local.gap > 0)
          .onClick((e) => {
            e.change((d) => {
              const current = d.props.gap ?? DEFAULTS.gap;
              local.gap = d.props.gap = current === 0 ? 5 : 0;
            });
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
