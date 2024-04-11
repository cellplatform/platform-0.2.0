import { Connect } from '.';
import { Dev, Icons, type t } from '../../test.ui';

const DEFAULTS = Connect.DEFAULTS;

type T = {
  props: t.ConnectProps;
  changed?: t.ConnectChangedHandlerArgs;
  debug: { bg?: boolean; useController?: boolean; useSelf?: boolean; changed?: number };
  network?: t.NetworkDocSharedRef;
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('Connect', async (e) => {
  type LocalStore = T['debug'] &
    Pick<t.ConnectProps, 'fields' | 'edge' | 'showInfo' | 'showInfoAsCard' | 'showInfoToggle'>;

  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.ui.Connect');
  const local = localstore.object({
    fields: DEFAULTS.fields.defaults,
    edge: DEFAULTS.edge,
    showInfo: DEFAULTS.showInfo,
    showInfoAsCard: DEFAULTS.showInfoAsCard,
    showInfoToggle: DEFAULTS.showInfoToggle,
    bg: false,
    useController: true,
    useSelf: true,
  });

  let self: t.Peer | undefined;
  if (local.useSelf) self = await Connect.peer();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    state.change((d) => {
      d.props.fields = local.fields;
      d.props.edge = local.edge;
      d.props.showInfoAsCard = local.showInfoAsCard;
      d.props.showInfo = local.showInfo;
      d.props.showInfoToggle = local.showInfoToggle;
      d.debug.bg = local.bg;
      d.debug.useController = local.useController;
      d.debug.useSelf = local.useSelf;
    });

    ctx.subject
      .size([350, null])
      .display('grid')
      .render<T>(async (e) => {
        const { props, debug } = e.state;
        ctx.subject.backgroundColor(debug.bg ? 1 : 0);

        if (!debug.useController) {
          return <Connect {...props} />;
        }

        if (debug.useSelf && !self) self = await Connect.peer();

        return (
          <Connect.Stateful
            {...props}
            self={debug.useSelf ? self : undefined}
            onReady={(e) => {
              console.info('⚡️ Connect: onReady', e);
              state.change((d) => (d.network = e.info.state));
              e.client.$.subscribe((d) => dev.redraw());
            }}
            onChange={(e) => {
              console.info('⚡️ Connect: onChange', e);
              state.change((d) => {
                d.changed = e;
                d.debug.changed = (d.debug.changed ?? 0) + 1;
              });
            }}
            onInfoToggle={(e) => {
              state.change((d) => (d.props.showInfo = !e.showing));
              console.log('e', e);
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      const edge = (edge: t.VEdge) => {
        const Vertical = Icons.Align.Vertical;
        const Icon = edge === 'Top' ? Vertical.Top : Vertical.Bottom;
        const opacity = (state: T) => (state.props.edge === edge ? 1 : 0.3);
        dev.button((btn) =>
          btn
            .label(`edge: ${edge}`)
            .right((e) => <Icon size={18} opacity={opacity(e.state)} />)
            .onClick((e) => e.change((d) => (local.edge = d.props.edge = edge))),
        );
      };
      edge('Top');
      edge('Bottom');

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.showInfoAsCard);
        btn
          .label((e) => `showInfoAsCard`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.showInfoAsCard = Dev.toggle(d.props, 'showInfoAsCard'))),
          );
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.showInfoToggle);
        btn
          .label((e) => `showInfoToggle`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.showInfoToggle = Dev.toggle(d.props, 'showInfoToggle')));
          });
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.showInfo);
        btn
          .label((e) => `showInfo`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.showInfo = Dev.toggle(d.props, 'showInfo'))));
      });
    });

    dev.hr(5, 20);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        return (
          <Dev.FieldSelector
            style={{ Margin: [20, 50, 0, 50] }}
            all={DEFAULTS.fields.all}
            defaults={DEFAULTS.fields.defaults}
            selected={e.state.props.fields}
            resettable={true}
            onClick={(args) => {
              const next = args.next as t.WebRtcInfoField[];
              state.change((d) => (local.fields = d.props.fields = next));
            }}
          />
        );
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.bg);
        btn
          .label((e) => `background ${value(e.state) ? '(white)' : ''}`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg'))));
      });

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.useController);
        btn
          .label((e) => `useController ${value(e.state) ? '(stateful)' : '(stateless, defaults)'}`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useController = Dev.toggle(d.debug, 'useController')));
          });
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.useSelf);
        btn
          .label((e) => `useSelf ${value(e.state) ? '(explicit)' : '(auto generated)'}`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.useSelf = Dev.toggle(d.debug, 'useSelf'))));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const { props, debug, network } = e.state;
      const count = debug.changed ?? 0;
      const data = {
        props,
        selected: e.state.changed?.selected,
        [`⚡️changed(${count})`]: e.state.changed,
        'state:(public)': network?.current,
      };
      return <Dev.Object name={'Connect'} data={data} expand={1} />;
    });
  });
});
