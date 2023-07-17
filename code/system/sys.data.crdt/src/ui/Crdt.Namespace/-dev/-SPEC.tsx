import { Crdt, CrdtViews, Dev, rx, type t } from '../../../test.ui';

type TRoot = { ns?: t.CrdtNsMap };
type TFoo = { count: number };

type T = {
  props: t.CrdtNsProps;
  debug: { withData?: boolean; devBg?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

const DEFAULTS = CrdtViews.Namespace.DEFAULTS;

export default Dev.describe('Namespace', (e) => {
  /**
   * Local storage.
   */
  type LocalStore = T['debug'] & Pick<t.CrdtNsProps, 'enabled' | 'useBehaviors'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.data.crdt.Namespace');
  const local = localstore.object({
    useBehaviors: DEFAULTS.useBehaviors,
    enabled: true,
    devBg: true,
    withData: true,
  });

  /**
   * CRDT
   */
  const createNamespace = (ctx: t.DevCtx) => {
    const ns = Crdt.namespace(doc, (d) => d.ns || (d.ns = {}));
    ns.$.pipe(rx.mergeWith(ns.dispose$)).subscribe((e) => ctx.redraw());
    return ns;
  };

  const createDoc = () => {
    return Crdt.ref<TRoot>('test-doc', {});
  };

  const initCrdt = (ctx: t.DevCtx) => {
    if (doc) doc.dispose();
    doc = createDoc();
    ns = createNamespace(ctx);
    ctx.redraw();
  };

  let doc = createDoc();
  let ns: t.CrdtNsManager<TRoot>;

  const State = {
    toDataProp(state: T, force?: boolean) {
      if (!force && !state.debug.withData) return undefined;
      const data: t.CrdtNsInfoData = {
        ns,
        onChange(e) {
          console.info('⚡️ onChange', e);
        },
      };
      return data;
    },

    toDisplayProps(state: T, force?: boolean) {
      const props: t.CrdtNsProps = {
        ...state.props,
        data: State.toDataProp(state, force),
      };
      return props;
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    initCrdt(ctx);

    state.change((d) => {
      d.props.enabled = local.enabled;
      d.props.useBehaviors = local.useBehaviors;
      d.debug.withData = local.withData;
      d.debug.devBg = local.devBg;
    });

    ctx.subject
      .backgroundColor(1)
      .size([280, null])
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        ctx.subject.backgroundColor(debug.devBg ? 1 : 0);
        const props = State.toDisplayProps(e.state);
        return <CrdtViews.Namespace {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });
    });

    dev.boolean((btn) => {
      const value = (state: T) => Boolean(state.props.useBehaviors);
      btn
        .label((e) => `useBehavior ${value(e.state) ? '( 🧠 )' : '⚠️'} `)
        .value((e) => value(e.state))
        .onClick((e) => {
          e.change((d) => (local.useBehaviors = Dev.toggle(d.props, 'useBehaviors')));
        });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button((btn) => {
        btn
          .label((e) => (ns.disposed ? 'create' : 'dispose'))
          .right((e) => (ns.disposed ? '🌳' : '→ 💥'))
          .onClick((e) => {
            if (ns.disposed) {
              initCrdt(dev.ctx);
            } else {
              ns.dispose();
            }
          });
      });

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.devBg);
        btn
          .label((e) => `background`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.devBg = Dev.toggle(d.debug, 'devBg'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.withData);
        btn
          .label((e) => (value(e.state) ? `with { data }` : `⚠️ no { data }`))
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.withData = Dev.toggle(d.debug, 'withData'))));
      });

      dev.hr(-1, 5);

      const addNamespace = (name: string) => {
        dev.button(`add namespace: → "${name}"`, () => {
          const lens = ns.lens<TFoo>(name, { count: 0 });
        });
      };
      addNamespace('foo');
      addNamespace('bar');

      dev.hr(-1, 5);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: e.state.props,
        doc: doc.current,
        ns,
        'ns:container': ns.container,
      };
      return (
        <Dev.Object
          name={'<Namespace>'}
          data={data}
          expand={{ level: 1, paths: ['$', '$.ns:container'] }}
        />
      );
    });
  });
});
