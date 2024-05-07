import { DEFAULTS, NetworkCmdHost } from '.';
import {
  A,
  BADGES,
  Color,
  Dev,
  Hash,
  Peer,
  PeerUI,
  Pkg,
  TestEdge,
  Value,
  css,
} from '../../test.ui';
import { createLoader } from './-SPEC.loader';
import { createImports } from './-SPEC.imports';
import { type t } from './common';

type P = t.NetworkCmdHost;
type D = {
  debugPadding?: boolean;
  debugLogging?: boolean;
  debugShowJson?: boolean;
  debugRootJson?: boolean;
};
type T = D & { props: P; stream?: MediaStream; overlay?: JSX.Element | null | false };
const initial: T = { props: {} };

const createStore = async (state: t.DevCtxState<T>) => {
  const logLevel = (): t.LogLevel | undefined => (state.current.debugLogging ? 'Debug' : undefined);
  const network = await TestEdge.createNetwork('Left', { logLevel, debugLabel: '🐷' });
  const lens = network.shared.namespace.lens('cmd.host', {});
  return { network, lens } as const;
};

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  let network: t.NetworkStore;
  let lens: t.Lens;

  type LocalStore = D & Pick<P, 'theme' | 'enabled'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    enabled: true,
    debugPadding: true,
    debugLogging: false,
    debugShowJson: false,
    debugRootJson: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.badge = BADGES.ci.node;
      d.props.hrDepth = 2;
      d.props.enabled = local.enabled;
      d.props.theme = local.theme;
      d.debugPadding = local.debugPadding;
      d.debugLogging = local.debugLogging;
      d.debugShowJson = local.debugShowJson;
      d.debugRootJson = local.debugRootJson;
    });

    const store = await createStore(state);
    network = store.network;
    lens = store.lens;

    /**
     * Monitoring
     */
    const peer = network.peer;
    peer.events().cmd.conn$.subscribe(() => dev.redraw('debug'));

    /**
     * Imports
     */
    const { Specs: specs } = await import('../../test.ui/entry.Specs.mjs');
    const imports = createImports({ peer, specs });
    const loader = createLoader(imports);

    /**
     * Render: Subject
     */
    ctx.debug.width(330);
    ctx.subject.display('grid').render<T>(async (e) => {
      const { props } = e.state;
      const padding = e.state.debugPadding ? 0 : undefined;
      ctx.subject.size('fill', padding);
      Dev.Theme.background(dev, props.theme, 1);

      /**
       * TODO 🐷
       * - optionally load from env-var.
       */

      return (
        <NetworkCmdHost
          {...props}
          imports={imports}
          doc={lens}
          pkg={Pkg}
          onLoad={async (e) => {
            const el = await loader.load(e);
            state.change((d) => (d.overlay = el));
          }}
        />
      );
    });

    /**
     * Render: (Overlay)
     */
    ctx.host.layer(1).render((e) => {
      const style = css({ Absolute: [0, 0, 36, 0], display: 'grid' });
      const el = state.current.overlay;
      return el ? <div {...style}>{el}</div> : null;
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      Dev.Theme.switcher(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.enabled;
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debugLogging;
        btn
          .label((e) => `logging ${value(e.state) ? '("Debug")' : ''}`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debugLogging = Dev.toggle(d, 'debugLogging'))));
      });
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debugPadding;
        btn
          .label((e) => `full screen`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d, 'debugPadding')));
      });
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debugRootJson;
        btn
          .label((e) => `json root`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debugRootJson = Dev.toggle(d, 'debugRootJson'))));
      });
      dev.hr(-1, 5);
      dev.button(['connect peer (sample)', '⚡️'], async (e) => {
        const edge = await TestEdge.create('Right');
        network.peer.connect.data(edge.network.peer.id);
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    const onStreamSelection: t.PeerStreamSelectionHandler = async (e) => {
      await state.change((d) => {
        d.stream = d.stream === e.selected ? undefined : e.selected;
      });
      dev.redraw();
      console.log('state.current.stream', state.current.stream);
    };

    dev.footer.padding(0).render<T>((e) => {
      const conns = network.peer.current.connections;
      const media = conns.filter((c) => Peer.Is.Kind.media(c));
      const total = media.length;
      const noMedia = total === 0;

      /**
       * Render
       */
      const styles = {
        base: css({ display: 'grid', gridTemplateRows: `repeat(3, auto)` }),
        hr: css({ borderBottom: `solid 1px ${Color.alpha(Color.DARK, 0.1)}` }),
        showAvatars: css({ display: noMedia ? 'none' : 'block' }),
        avatars: css({ display: 'grid', placeItems: 'center' }),
      };

      const elInfoPanel = (
        <>
          <div {...css(styles.hr)} />
          {TestEdge.dev.infoPanel(dev, network, {
            margin: [12, 28],
            data: {
              shared: {
                lens: e.state.debugRootJson ? undefined : ['ns', 'cmd.host'],
                object: {
                  visible: e.state.debugShowJson,
                  dotMeta: false,
                  expand: { level: 5 },
                  beforeRender(mutate) {
                    Value.Object.walk(mutate!, (e) => {
                      if (typeof e.value === 'string') e.mutate(Hash.shorten(e.value, 8));
                      if (e.value instanceof A.Counter) e.mutate(e.value.value);
                    });
                  },
                },
                onIconClick() {
                  state.change((d) => (local.debugShowJson = Dev.toggle(d, 'debugShowJson')));
                },
              },
            },
          })}
        </>
      );

      const elVideoAvatars = (
        <>
          <div {...css(styles.hr, styles.showAvatars)} />
          <PeerUI.AvatarTray
            style={css(styles.showAvatars, styles.avatars)}
            peer={network.peer}
            onSelection={onStreamSelection}
            muted={false}
            margin={8}
          />
        </>
      );

      const elConnector = (
        <>
          <div {...styles.hr} />
          <PeerUI.Connector peer={network.peer} />
        </>
      );

      return (
        <div {...styles.base}>
          {elInfoPanel}
          {elVideoAvatars}
          {elConnector}
        </div>
      );
    });
  });
});
