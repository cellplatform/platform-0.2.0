import { Connect } from '.';
import { Dev, Icons, TestNetwork, type t } from '../../test.ui';

type T = {
  props: t.ConnectProps;
  debug: { bg?: boolean; useController?: boolean };
};
const initial: T = {
  props: { data: {} },
  debug: {},
};

export default Dev.describe('Connect', async (e) => {
  const self = await TestNetwork.peer();

  type LocalStore = T['debug'] & { edge?: t.Edge; card?: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.ui.Connect');
  const local = localstore.object({
    edge: Connect.DEFAULTS.edge,
    card: Connect.DEFAULTS.card,
    bg: true,
    useController: true,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.card = local.card;
      d.props.edge = local.edge;
      d.debug.bg = local.bg;
      d.debug.useController = local.useController;
    });

    ctx.subject
      .size([350, null])
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        ctx.subject.backgroundColor(debug.bg ? 1 : 0);

        if (!debug.useController) {
          return <Connect {...props} />;
        }

        return (
          <Connect.Stateful
            {...props}
            self={self}
            onChange={(e) => {
              console.info('⚡️ onChange', e);
              state.change((d) => (d.props.data = e.data));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      const edge = (edge: t.Edge) => {
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
          .label((e) => `card: ${e.state.props.card}`)
          .value((e) => Boolean(e.state.props.card))
          .onClick((e) => e.change((d) => (local.card = Dev.toggle(d.props, 'card')))),
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `background`)
          .value((e) => Boolean(e.state.debug.bg))
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.useController);
        btn
          .label((e) => `useController ${value(e.state) ? '(stateful)' : '(stateless)'}`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useController = Dev.toggle(d.debug, 'useController')));
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Connect'} data={data} expand={1} />;
    });
  });
});
