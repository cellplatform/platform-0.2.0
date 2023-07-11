import { Crdt, Dev, type t } from '../../../test.ui';
import { CrdtNsItem } from '../ui.Ns.Item';
import { DEFAULTS } from '../common';

type TRoot = { ns?: t.CrdtNsMap };
type TFoo = { count: number };

type T = {
  props: t.CrdtNsItemProps;
};
const initial: T = {
  props: {},
};

export default Dev.describe('CrdtNamespace.Item', (e) => {
  type LocalStore = Pick<t.CrdtNsItemProps, 'enabled' | 'selected' | 'indent' | 'padding'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.data.crdt.Namespace.Item');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
    selected: DEFAULTS.item.selected,
    indent: DEFAULTS.item.indent,
    padding: DEFAULTS.item.padding,
  });

  /**
   * CRDT
   */
  const doc = Crdt.ref<TRoot>('test-doc', {});
  const ns = Crdt.namespace(doc, (d) => d.ns || (d.ns = {}));

  const State = {
    toDataProp(state: t.DevCtxState<T>): t.CrdtNsInfoData {
      return {
        ns,
        onChange(e) {
          console.info('⚡️ onChange', e);
          state.change((d) => (d.props.namespace = e.namespace));
        },
      };
    },

    toDisplayProps(state: t.DevCtxState<T>): t.CrdtNsItemProps {
      return {
        ...state.current.props,
        data: State.toDataProp(state),
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
    });

    ctx.subject
      .backgroundColor(1)
      .size([280, null])
      .display('grid')
      .render<T>((e) => {
        const props = State.toDisplayProps(state);
        return <CrdtNsItem {...props} />;
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

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const defaultValue = DEFAULTS.item.indent;
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
        const defaultValue = DEFAULTS.item.padding;
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
