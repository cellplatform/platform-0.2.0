import { Color, Dev, Pkg, TestDb, TestEdge, WebrtcStore, css, type t, PeerUI } from '../../test.ui';
import { DEFAULTS } from './common';
import { SampleLayout } from './ui.Layout';

type T = {
  theme?: t.CommonTheme;
  reload?: boolean;
  logging?: boolean;
};
const initial: T = {};

const createStores = async (state: t.DevCtxState<T>) => {
  const logLevel = (): t.LogLevel | undefined => (state.current.logging ? 'Debug' : undefined);
  const createNetwork = (kind: t.NetworkConnectionEdgeKind, debugLabel: string) => {
    return TestEdge.createNetwork(kind, { logLevel, debugLabel });
  };
  const left = await createNetwork('Left', '🐷');
  const right = await createNetwork('Right', '🌼');

  const toLens = (shared: t.NetworkStoreShared) => shared.ns.lens('foo', {});
  const lenses = {
    left: toLens(left.shared),
    right: toLens(right.shared),
  } as const;

  return { left, right, lenses } as const;
};

/**
 * Spec
 */
const name = 'Network.CmdHosts';
export default Dev.describe(name, async (e) => {
  let left: t.NetworkStore;
  let right: t.NetworkStore;

  type LocalStore = Pick<T, 'theme' | 'logging'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ theme: 'Dark', logging: true });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.theme = local.theme;
      d.logging = local.logging;
    });

    const stores = await createStores(state);
    left = stores.left;
    right = stores.right;

    ctx.debug.width(330);
    ctx.subject
      .display('grid')
      .size('fill')
      .render<T>(async (e) => {
        const { theme, logging } = e.state;
        Dev.Theme.background(ctx, theme, 1);

        if (e.state.reload) {
          return (
            <TestDb.DevReload
              theme={theme}
              onCloseClick={() => state.change((d) => (d.reload = false))}
            />
          );
        }

        /**
         * TODO 🐷
         * - optionally load from env-var.
         */
        const { Specs } = await import('../../test.ui/entry.Specs');

        return (
          <SampleLayout
            pkg={Pkg}
            theme={theme}
            imports={Specs}
            left={stores.lenses.left}
            right={stores.lenses.right}
            path={DEFAULTS.paths}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    TestEdge.dev.peersSection(dev, left, right);
    dev.hr(5, 20);

    const data: t.InfoData = {
      shared: {
        // lens: ['ns', 'foo'],
        object: { dotMeta: false },
      },
    };

    const render = (title: string, network: t.NetworkStore) => {
      return dev.row(() => {
        return (
          <>
            <div {...css({ fontSize: 22 })}>{title}</div>
            <PeerUI.Connector
              peer={network.peer}
              style={{
                borderBottom: `solid 3px ${Color.alpha(Color.DARK, 0.15)}`,
                marginBottom: 20,
              }}
            />
            {TestEdge.dev.infoPanel(dev, network, { data })}
          </>
        );
      });
    };

    render('🐷', left);
    dev.hr(5, 20);
    render('🌼', right);

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['theme'], (e) => (local.theme = e));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.boolean((btn) => {
        const value = (state: T) => !!state.logging;
        btn
          .label((e) => `logging ${value(e.state) ? '("Debug")' : ''}`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.logging = Dev.toggle(d, 'logging'))));
      });
      dev.hr(-1, 5);
      dev.button(['purge ephemeral', '💦'], (e) => {
        const purge = WebrtcStore.Shared.purge;
        purge(left.index);
        purge(right.index);
        e.change((d) => (d.reload = true));
      });
    });
  });
});
