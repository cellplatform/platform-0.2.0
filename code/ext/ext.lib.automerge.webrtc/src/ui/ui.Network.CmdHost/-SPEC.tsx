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
  rx,
} from '../../test.ui';
import { createImports } from './-SPEC.imports';
import { createLoader } from './-SPEC.loader';
import { createDSL } from './-SPEC.dsl';

import type { TEnv, THarness } from './-SPEC.t';
import type { t } from './common';

type LocalStore = D & Pick<P, 'theme' | 'enabled'> & Pick<THarness, 'debugShowJson'>;
type P = t.NetworkCmdHost;
type D = {
  debugPadding?: boolean;
  debugLogging?: boolean;
  debugRootJson?: boolean;
  debugLoadedOpacity?: number;
};
type T = D & { props: P; stream?: MediaStream; overlay?: JSX.Element | null | false };
const initial: T = { props: {} };

const createStore = async (state: t.DevCtxState<T>, local: LocalStore) => {
  const logLevel = (): t.LogLevel | undefined => (state.current.debugLogging ? 'Debug' : undefined);
  const network = await TestEdge.createNetwork('Left', { logLevel, debugLabel: '🐷' });
  const namespace = network.shared.namespace;
  const lens = namespace.lens('cmd.host', {});

  const s = state.current;
  const harness = namespace.lens<THarness>('harness', {
    theme: s.props.theme,
    debugWidth: 330,
    debugShowJson: local.debugShowJson,
  });
  return { network, lens, harness } as const;
};

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  let network: t.NetworkStore;
  let lens: t.Lens;
  let harness: t.Lens<THarness>;

  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    enabled: true,
    debugPadding: true,
    debugLogging: false,
    debugShowJson: false,
    debugRootJson: false,
    debugLoadedOpacity: 1,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const env = dev.env<TEnv>();
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.badge = BADGES.ci.node;
      d.props.hrDepth = 2;
      d.props.enabled = local.enabled;
      d.props.theme = local.theme;
      d.debugPadding = local.debugPadding;
      d.debugLogging = local.debugLogging;
      d.debugRootJson = local.debugRootJson;
      d.debugLoadedOpacity = local.debugLoadedOpacity;
    });

    const store = await createStore(state, local);
    network = store.network;
    harness = store.harness;
    lens = store.lens;
    const dsl = createDSL({ network, harness });

    /**
     * Monitoring
     */
    const peer = network.peer;
    peer.events().cmd.conn$.subscribe(() => dev.redraw('debug'));

    const monitorHarness = (doc: t.Lens<THarness>) => {
      const $ = doc.events().changed$.pipe(rx.map((d) => d.after));
      const on = (key: keyof THarness) => $.pipe(rx.distinctWhile((p, n) => p[key] === n[key]));
      on('debugWidth').subscribe((e) => ctx.debug.width(e.debugWidth ?? 330));
      on('theme').subscribe((e) => state.change((d) => (d.props.theme = e.theme)));
      on('debugShowJson').subscribe(() => dev.redraw('debug'));
    };

    monitorHarness(harness);

    /**
     * Imports
     */
    const specs = env.Specs;
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
          onLoad={(e) => state.change(async (d) => (d.overlay = await loader.load(e)))}
          onCommand={(e) => dsl(e)}
        />
      );
    });

    /**
     * Render: (Overlay)
     */
    ctx.host.layer(1).render((e) => {
      const s = state.current;
      const style = css({
        Absolute: [0, 0, 36, 0],
        overflow: 'hidden',
        opacity: s.debugLoadedOpacity,
        backgroundColor: Color.theme(s.props.theme).color,
        display: 'grid',
      });
      const el = s.overlay;
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
        (d, value) => {
          local.theme = d.props.theme = value;
          harness.change((d) => (d.theme = value));
        },
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
      dev.boolean((btn) => {
        const value = (state: T) => state.debugLoadedOpacity ?? 1;
        btn
          .label((e) => `loaded opacity (${value(e.state) * 100}%)`)
          .value((e) => value(e.state) === 1)
          .onClick((e) => {
            e.change((d) => {
              const next = value(e.state.current) === 1 ? 0.8 : 1;
              local.debugLoadedOpacity = d.debugLoadedOpacity = next;
            });
          });
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

      const onIconClick = () => {
        harness.change((d) => (local.debugShowJson = Dev.toggle(d, 'debugShowJson')));
      };
      const cmdState: t.InfoDataShared = {
        label: 'CmdHost State',
        lens: e.state.debugRootJson ? undefined : ['ns', 'cmd.host'],
        onIconClick,
        object: {
          visible: harness.current.debugShowJson,
          dotMeta: false,
          expand: { level: 5 },
          beforeRender(mutate) {
            Value.Object.walk(mutate!, (e) => {
              if (typeof e.value === 'string') e.mutate(Hash.shorten(e.value, [6, 12]));
              if (e.value instanceof A.Counter) e.mutate(e.value.value);
            });
          },
        },
      };

      const harnessState: t.InfoDataShared = {
        label: 'Harness State',
        lens: ['ns', 'harness'],
        onIconClick,
        object: { visible: harness.current.debugShowJson },
      };

      const elInfoPanel = (
        <>
          <div {...css(styles.hr)} />
          {TestEdge.dev.infoPanel(dev, network, {
            margin: [12, 28],
            data: { shared: [cmdState, harnessState] },
          })}
        </>
      );

      const elVideoAvatars = (
        <>
          <div {...css(styles.hr, styles.showAvatars)} />
          <PeerUI.AvatarTray
            style={css(styles.showAvatars, styles.avatars)}
            onSelection={onStreamSelection}
            peer={network.peer}
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
