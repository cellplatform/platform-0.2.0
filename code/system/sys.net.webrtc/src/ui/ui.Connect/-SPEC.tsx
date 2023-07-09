import { Connect } from '.';
import { Dev, Icons, type t } from '../../test.ui';

type T = {
  props: t.ConnectProps;
  changed?: t.ConnectChangedHandlerArgs;
  debug: { bg?: boolean; useController?: boolean; useSelf?: boolean; changed?: number };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('Connect', async (e) => {
  type LocalStore = T['debug'] & { edge?: t.VEdge; card?: boolean; fields?: t.WebRtcInfoField[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.ui.Connect');
  const local = localstore.object({
    edge: Connect.DEFAULTS.edge,
    card: Connect.DEFAULTS.innerCard,
    fields: Connect.DEFAULTS.fields.default,
    bg: false,
    useController: true,
    useSelf: true,
  });

  let self: t.Peer | undefined;
  if (local.useSelf) self = await Connect.peer();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.innerCard = local.card;
      d.props.edge = local.edge;
      d.props.fields = local.fields;
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

        const onChange: t.ConnectChangedHandler = (e) => {
          console.info('⚡️ onChange', e);
          state.change((d) => {
            d.changed = e;
            d.debug.changed = (d.debug.changed ?? 0) + 1;
          });
        };

        if (debug.useSelf && !self) self = await Connect.peer();

        return (
          <Connect.Stateful
            {...props}
            self={debug.useSelf ? self : undefined}
            onChange={onChange}
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

      dev.boolean((btn) =>
        btn
          .label((e) => `card: ${e.state.props.innerCard}`)
          .value((e) => Boolean(e.state.props.innerCard))
          .onClick((e) => e.change((d) => (local.card = Dev.toggle(d.props, 'innerCard')))),
      );
    });

    dev.hr(5, 20);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        return (
          <Dev.FieldSelector
            style={{ Margin: [20, 50, 0, 50] }}
            all={Connect.DEFAULTS.fields.all}
            default={Connect.DEFAULTS.fields.default}
            selected={e.state.props.fields}
            resettable={true}
            onClick={(args) => {
              const next = args.next as t.WebRtcInfoField[];
              state.change((d) => (d.props.fields = next));
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
      const count = e.state.debug.changed ?? 0;
      const data = {
        props: e.state.props,
        selected: e.state.changed?.selected,
        [`⚡️changed(${count})`]: e.state.changed,
      };
      return <Dev.Object name={'Connect'} data={data} expand={1} />;
    });
  });
});
