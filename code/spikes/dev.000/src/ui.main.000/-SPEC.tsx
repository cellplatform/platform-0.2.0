/**
 * Polyfill: Required for [@standard-crypto/farcaster-js] in production builds.
 *           Upstream dependency of [@privy-io/react-auth]
 *
 * https://github.com/standard-crypto/farcaster-js
 */
import { Buffer } from 'buffer';
if (!window.Buffer) window.Buffer = Buffer;

import { Color, Dev, Pkg, css, rx } from '../test.ui';
import { DevKeyboard } from './-SPEC.Keyboard';
import {
  Cmd,
  CrdtInfo,
  Immutable,
  Peer,
  PeerRepoList,
  WebStore,
  WebrtcStore,
  type t,
} from './common';
import { SampleLayout } from './ui';
import { Footer } from './ui.CmdBar';
import { DebugFooter } from './ui.DebugFooter';

type T = {
  stream?: MediaStream;
  overlay?: JSX.Element;
  debug: {};
};
const initial: T = { debug: {} };

/**
 * Spec
 */
const name = 'Main.000';

export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & { me?: t.UriString };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ me: undefined });
  const self = Peer.init();

  const Store = {
    tmp: WebStore.init({ storage: 'fs.tmp', network: [] }),
    fs: WebStore.init({ storage: 'fs', network: [] }),
  } as const;
  const Index = {
    tmp: await WebStore.index(Store.tmp),
    fs: await WebStore.index(Store.fs),
  } as const;

  const network: t.NetworkStore = await WebrtcStore.init(self, Store.tmp, Index.tmp, {});
  const theme: t.CommonTheme = 'Light';

  async function getMe() {
    const fs = Store.fs.doc;
    const exists = await fs.exists(local.me);
    if (!exists) local.me = undefined;
    const doc = await fs.getOrCreate((d) => null, local.me);
    local.me = doc.uri;
    return doc;
  }

  const me = await getMe();
  const cloner = () => Immutable.clonerRef({});

  const main: t.Shell = {
    cmdbar: undefined,
    self,
    fc: Cmd.create<t.FarcasterCmd>(cloner()) as t.Cmd<t.FarcasterCmd>,
    repo: {
      fs: { store: Store.fs, index: Index.fs },
      tmp: { store: Store.tmp, index: Index.tmp },
    },
    state: {
      me,
      cmdbar: network.shared.ns.lens('dev.cmdbar', {}),
      tmp: network.shared.ns.lens<t.Tmp>('dev.tmp', {}),
      harness: network.shared.ns.lens<t.Harness>('dev.harness', { debugVisible: false }),
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});
    DevKeyboard.listen(main.state.harness);

    const tmp$ = main.state.tmp.events().changed$;
    const harness$ = main.state.harness.events().changed$;
    rx.merge(tmp$, harness$)
      .pipe(rx.debounceTime(50))
      .subscribe(() => ctx.redraw());

    const updateDebugPanelWidth = () => {
      const harness = main.state.harness.current;
      const visible = harness.debugVisible ?? true;
      ctx.debug.width(visible ? 300 : 0);
      ctx.redraw();
    };
    harness$.pipe(rx.debounceTime(50)).subscribe(updateDebugPanelWidth);
    updateDebugPanelWidth();

    ctx.subject
      .size('fill', 80)
      .display('grid')
      .render<T>((e) => {
        const theme = Color.theme('Dark');
        Dev.Theme.background(ctx, theme);
        ctx.host.tracelineColor(Color.alpha(theme.fg, 0.03));

        const styles = {
          base: css({ Absolute: 0, display: 'grid' }),
          overlay: css({ Absolute: 0, display: 'grid' }),
        };

        const overlay = e.state.overlay;
        const elOverlay = overlay && <div {...styles.overlay}>{overlay}</div>;

        return (
          <div {...styles.base}>
            <SampleLayout network={network} stream={e.state.stream} theme={theme.name} />
            {elOverlay}
          </div>
        );
      });

    ctx.host.footer.padding(0).render((e) => {
      return <Footer main={main} onOverlay={(e) => state.change((d) => (d.overlay = e.el))} />;
    });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.header
      .padding(0)
      .border(-0.06)
      .render(async (e) => {
        const tmp = main.state.tmp;
        const video = tmp.current.video;
        if (!video) return null;

        // vimeo:group-scape: 727951677
        const { Video } = await import('sys.ui.react.media.video');
        const src = Video.src(video.id);
        return (
          <Video.Player
            video={src}
            playing={video.playing}
            width={300}
            innerScale={1.1}
            muted={video.muted}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row(async (e) => {
      const tmp = main.state.tmp;
      const props = tmp.current.props;
      if (!props) return null;

      const { PropList } = await import('sys.ui.react.common');
      const items = Object.entries(props).map(([key, value]) => {
        return { label: key, value: value as any };
      });

      return <PropList items={items} style={{ marginBottom: 80 }} />;
    });

    dev.row(async (e) => {
      const { Auth } = await import('ext.lib.privy');
      return (
        <Auth.Info
          fields={[
            'Login',
            'Login.Farcaster',
            'Login.SMS',
            'Id.User',
            'Farcaster',
            'Wallet.List',
            'Wallet.List.Title',
            'Refresh',
          ]}
          data={{
            provider: Auth.Env.provider,
            wallet: { list: { label: 'Public Key' } },
            farcaster: {
              cmd: main.fc,
              signer: {},
              identity: { onClick: (e) => console.info(`⚡️ farcaster.identity.onClick`, e) },
            },
          }}
          onReady={(e) => console.info('⚡️ Auth.onReady:', e)}
          onChange={(e) => console.info('⚡️ Auth.onChange:', e)}
        />
      );
    });

    dev.hr(5, 20);

    dev.row((e) => {
      const { debug } = e.state;
      const obj = { expand: { level: 1 } };
      const uri = { head: true };
      return (
        <PeerRepoList.Info
          stateful={true}
          title={['Network', 'Shared']}
          fields={['Repo', 'Peer', 'Network.Transfer', 'Network.Shared']}
          data={{
            network,
            repo: { store: Store.tmp, index: Index.tmp },
            shared: [
              { label: 'System', uri, object: { lens: ['sys'], ...obj } },
              { label: 'Namespaces', uri, object: { lens: ['ns'], ...obj } },
            ],
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.row((e) => {
      const shorten = (text: string | unknown = '', max: number) => {
        let res = typeof text === 'string' ? text : '';
        if (res.length > max) res = `${res.slice(0, max - 3)}...`;
        return res;
      };

      return (
        <CrdtInfo
          stateful={true}
          title={['Private State', 'Local']}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: main.repo.fs,
            document: [
              {
                label: 'Me',
                ref: main.state.me,
                uri: { head: true },
                object: {
                  name: 'me',
                  visible: false,
                  beforeRender(e: any) {
                    const text = e.root?.config?.text;
                    if (typeof text === 'string') e.root.config.text = shorten(text, 20);
                  },
                },
              },
              {
                label: 'Me: root',
                ref: main.state.me,
                uri: { head: true },
                object: {
                  name: 'me.root',
                  lens: ['root'],
                  visible: false,
                  expand: { level: 2 },
                  beforeRender(e: any) {
                    const text = e.config?.text;
                    if (typeof text === 'string') e.config.text = shorten(text, 22);
                  },
                },
              },
              {
                label: 'Me: identity',
                ref: main.state.me,
                uri: { head: true },
                object: { name: 'me.identity', visible: false, lens: ['identity'] },
              },
            ],
          }}
        />
      );
    });

    // dev.hr(5, 20);
    // dev.section('Debug', (dev) => {
    //   dev.button('redraw', (e) => dev.redraw());
    // });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        return (
          <DebugFooter
            theme={theme}
            network={network}
            selectedStream={e.state.stream}
            onStreamSelected={(stream) => state.change((d) => (d.stream = stream))}
          />
        );
      });
  });
});
