import { Crdt, CrdtViews, Dev, type t } from '../../test.ui';

type TDoc = { ns?: t.CrdtNamespaceMap };
type T = { props: t.CrdtNamespaceProps };
const initial: T = { props: {} };

const DEFAULTS = CrdtViews.Namespace.DEFAULTS;

export default Dev.describe('CrdtNamespace', (e) => {
  /**
   * Local storage.
   */
  type LocalStore = Pick<t.CrdtNamespaceProps, 'enabled'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.crdt.ui.Namespace');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
  });

  /**
   * CRDT
   */
  const doc = Crdt.ref<TDoc>('test-doc', {});
  const ns = CrdtViews.Namespace.ns(doc, (d) => d.ns || (d.ns = {}));

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.enabled = local.enabled;
    });

    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <CrdtViews.Namespace {...e.state.props} />;
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
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('dispose', () => {
        ns.dispose();
        dev.redraw();
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: e.state.props,
        doc: doc.current,
        ns,
      };
      return <Dev.Object name={'Namespace'} data={data} expand={1} />;
    });
  });
});
