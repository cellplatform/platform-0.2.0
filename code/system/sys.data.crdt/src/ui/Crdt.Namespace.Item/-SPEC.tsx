import { CrdtNamespaceItem } from '.';
import { Dev, type t } from '../../test.ui';

const DEFAULTS = CrdtNamespaceItem.DEFAULTS;

type TRoot = { ns?: t.CrdtNsMap };
type TFoo = { count: number };

type T = {
  props: t.CrdtNamespaceItemProps;
};
const initial: T = {
  props: {},
};

export default Dev.describe('Namespace.Item', (e) => {
  type LocalStore = Pick<
    t.CrdtNamespaceItemProps,
    'enabled' | 'selected' | 'indent' | 'padding' | 'editing'
  >;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.data.crdt.Namespace.Item');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
    selected: DEFAULTS.selected,
    indent: DEFAULTS.indent,
    padding: DEFAULTS.padding,
    editing: DEFAULTS.editing,
  });

  const State = {
    toDisplayProps(state: t.DevCtxState<T>): t.CrdtNamespaceItemProps {
      return {
        ...state.current.props,
        onChange(e) {
          console.info('⚡️ onChange', e);
          state.change((d) => (d.props.namespace = e.namespace));
        },
      };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.enabled = local.enabled;
      d.props.selected = local.selected;
      d.props.indent = local.indent;
      d.props.padding = local.padding;
      d.props.editing = local.editing;
    });

    ctx.subject
      .backgroundColor(1)
      .size([280, null])
      .display('grid')
      .render<T>((e) => {
        const props = State.toDisplayProps(state);
        return <CrdtNamespaceItem {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.selected);
        btn
          .label((e) => `selected`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.selected = Dev.toggle(d.props, 'selected'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.editing);
        btn
          .label((e) => `editing`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.editing = Dev.toggle(d.props, 'editing'))));
      });

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const defaultValue = DEFAULTS.indent;
        const value = (state: T) => state.props.indent ?? defaultValue;
        btn
          .label((e) => `indent = ${value(e.state)}`)
          .value((e) => value(e.state) !== defaultValue)
          .onClick((e) => {
            e.change((d) => {
              const current = d.props.indent ?? defaultValue;
              const next = current === defaultValue ? 15 : defaultValue;
              local.indent = d.props.indent = next;
            });
          });
      });

      dev.boolean((btn) => {
        const defaultValue = DEFAULTS.padding;
        const value = (state: T) => state.props.padding ?? defaultValue;
        btn
          .label((e) => `padding = ${value(e.state)}`)
          .value((e) => value(e.state) === defaultValue)
          .onClick((e) => {
            e.change((d) => {
              const current = d.props.padding ?? defaultValue;
              const next = current === defaultValue ? 0 : defaultValue;
              local.padding = d.props.padding = next;
            });
          });
      });
    });

    dev.hr(5, 20);

    dev.section('States', (dev) => {
      dev.button('default', (e) => {
        e.change((d) => {
          d.props.enabled = DEFAULTS.enabled;
          d.props.selected = DEFAULTS.selected;
          d.props.editing = DEFAULTS.editing;
          d.props.padding = DEFAULTS.padding;
          d.props.indent = DEFAULTS.indent;
        });
      });

      dev.hr(-1, 5);

      dev.button('selected', (e) => {
        e.change((d) => {
          d.props.selected = true;
          d.props.editing = false;
        });
      });

      dev.button('selected → editing', (e) => {
        e.change((d) => {
          d.props.selected = true;
          d.props.editing = true;
        });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const props = State.toDisplayProps(state);
      const data = { props };
      return <Dev.Object name={'<Namespace.Item>'} data={data} expand={1} />;
    });
  });
});
