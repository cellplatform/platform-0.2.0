import { DEFAULTS, NetworkCmdHost } from '.';
import { Color, Dev, Peer, PeerUI, Pkg, TestEdge, css } from '../../test.ui';
import { type t } from './common';

type L = t.Lens;
type P = t.NetworkCmdHost;
type D = {
  debugPadding?: boolean;
  debugShowJson?: boolean;
};
type T = D & {
  props: P;
  stream?: MediaStream;
};
const initial: T = { props: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  const edge = await TestEdge.create('Left');
  const network = edge.network;
  let lens: L | undefined;

  type LocalStore = D & Pick<P, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    debugPadding: true,
    debugShowJson: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.debugPadding = local.debugPadding;
      d.debugShowJson = local.debugShowJson;
    });

    /**
     * Monitoring
     */
    const toLens = (shared: t.NetworkStoreShared) => shared.namespace.lens('foo', {});
    monitorPeer(dev, network, (shared) => (lens = toLens(shared)));
    network.peer.events().cmd.conn$.subscribe(() => dev.redraw('debug'));

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
      const { Specs } = await import('../../test.ui/entry.Specs.mjs');

      return <NetworkCmdHost {...props} imports={Specs} doc={lens} pkg={Pkg} />;
    });

    /**
     * Render: Video (Overlay)
     */
    ctx.host.layer(1).render((e) => {
      const stream = state.current.stream;
      if (!stream) return;
      return <PeerUI.Video stream={stream} muted={true} />;
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.section('Properties', (dev) => {
      Dev.Theme.switcher(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.button(['connect peer (sample)', '⚡️'], async (e) => {
        const edge = await TestEdge.create('Right');
        network.peer.connect.data(edge.network.peer.id);
      });
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debugPadding;
        btn
          .label((e) => `full screen`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d, 'debugPadding')));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    const onStreamSelection: t.PeerStreamSelectionHandler = (e) => {
      state.change((d) => {
        d.stream = d.stream === e.selected ? undefined : e.selected;
      });
      dev.redraw();
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
                // lens: ['ns', 'foo'],
                object: {
                  visible: e.state.debugShowJson,
                  beforeRender(mutate) {
                    NetworkCmdHost.Path.shortenUris(mutate as t.CmdHostPathLens);
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

/**
 * Helpers
 */
export const monitorPeer = (
  dev: t.DevTools,
  network: t.NetworkStore,
  toLens?: (shared: t.NetworkStoreShared) => t.Lens,
) => {
  const handleConnection = async () => {
    toLens?.(await network.shared());
    dev.redraw();
  };
  network.peer.events().cmd.conn$.subscribe(handleConnection);
};
