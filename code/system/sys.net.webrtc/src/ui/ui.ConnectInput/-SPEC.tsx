import { WebRtc, Dev, TestNetwork, t, PropList } from '../../test.ui';
import { ConnectInput } from '.';

const { DEFAULTS } = ConnectInput;

type T = { props: t.ConnectInputProps };
const initial: T = {
  props: {
    spinning: DEFAULTS.spinning,
    fields: DEFAULTS.fields,
  },
};

type LocalStore = { fields?: t.ConnectInputField[] };
const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.ConnectInput');
const local = localstore.object({
  fields: initial.props.fields,
});

export default Dev.describe('ConnectInput', async (e) => {
  const self = await TestNetwork.peer();

  const Util = {
    props: (state: T) => {
      return { ...state.props, self };
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
            onRemotePeerChanged={(e) => state.change((d) => (d.props.remotePeer = e.remote))}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.row((e) => {
      return <WebRtc.InfoCard fields={['Module', 'Self.Id']} data={{ self: { peer: self } }} />;
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
