import { ConnectInput } from '.';
import { Dev, PropList, t, TestNetwork, WebRtc, WebRtcInfo } from '../../test.ui';

const { DEFAULTS } = ConnectInput;

type T = { props: t.ConnectInputProps };
const initial: T = {
  props: {
    spinning: DEFAULTS.spinning,
    fields: DEFAULTS.fields,
  },
};

type LocalStore = { fields?: t.ConnectInputField[]; self: boolean };
const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.ConnectInput');
const local = localstore.object({
  fields: initial.props.fields,
  self: true,
});

export default Dev.describe('ConnectInput', async (e) => {
  const self = await TestNetwork.peer();
  const controller = WebRtc.controller(self);
  const client = controller.client();

  const Util = {
    props: (state: T) => {
      return {
        ...state.props,
        self: local.self ? self : undefined,
      };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    self.connections$.subscribe(() => ctx.redraw());

    await state.change((d) => {
      d.props.fields = local.fields;
    });

    ctx.subject
      .backgroundColor(1)
      .size([400, null])
      .display('grid')
      .render<T>((e) => {
        const props = Util.props(e.state);
        return (
          <ConnectInput
            {...props}
            onRemoteChanged={(e) => state.change((d) => (d.props.remote = e.remote))}
            onLocalCopied={(e) => console.info(`⚡️ onLocalCopied:`, e)}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.row((e) => {
      return (
        <WebRtcInfo
          fields={['Module', 'Self.Id']}
          client={client}
          style={{ Margin: [0, 20, 0, 0] }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = Util.props(e.state);
        return (
          <PropList.FieldSelector
            style={{ Margin: [10, 40, 10, 30] }}
            all={ConnectInput.FIELDS}
            selected={props.fields ?? DEFAULTS.fields}
            onClick={(ev) => {
              const fields = ev.next as t.ConnectInputProps['fields'];
              dev.change((d) => (d.props.fields = fields));
              local.fields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('spinning')
          .value((e) => Boolean(e.state.props.spinning))
          .onClick((e) => {
            e.change((d) => Dev.toggle(d.props, 'spinning'));
          }),
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => (local.self ? 'self (set)' : 'self (not set)'))
          .value((e) => local.self)
          .onClick((e) => {
            local.self = !local.self;
            dev.redraw();
          }),
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const total = self?.connections.length ?? 0;
      const data = {
        [`WebRtc.Peer[${total}]`]: self,
        props: e.state.props,
      };
      return <Dev.Object name={'Dev.ConnectInput'} data={data} expand={1} />;
    });
  });
});
