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

export default Dev.describe('Namespace.Item', (e) => {
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
      d.props.enabled = DEFAULTS.enabled;
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
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'enabled')));
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
