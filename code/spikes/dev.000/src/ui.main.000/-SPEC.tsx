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
  overlay?: JSX.Element | null;
  jwt?: string;
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
    fs: WebStore.init({ storage: 'fs', network: true }),
  } as const;
  const Index = {
    tmp: await WebStore.index(Store.tmp),
    fs: await WebStore.index(Store.fs),
  } as const;

  const network: t.NetworkStore = await WebrtcStore.init(self, Store.tmp, Index.tmp, {});
  const theme: t.CommonTheme = 'Light';

  async function getMe() {
    const fs = Store.fs.doc;
    if (!(await fs.exists(local.me))) local.me = undefined;

    const doc = await fs.getOrCreate((d) => null, local.me);
    local.me = doc.uri;
    return doc;
  }

  const me = await getMe();
  const cloner = () => Immutable.clonerRef({});

  const main: t.Shell = {
    self,
    cmdbar: undefined,
    fc: Cmd.create<t.FarcasterCmd>(cloner(), { issuer: self.id }) as t.Cmd<t.FarcasterCmd>,
    repo: {
      fs: { store: Store.fs, index: Index.fs },
      tmp: { store: Store.tmp, index: Index.tmp },
    },
    state: {
      me,
      cmdbar: network.shared.ns.lens('dev.cmdbar', {}),
      tmp: network.shared.ns.lens<t.Tmp>('dev.tmp', {}),
      harness: network.shared.ns.lens<t.Harness>('dev.harness', { debugVisible: true }),
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
      const current = state.current;
      return (
        <Auth.Info
          fields={[
            'Login',
            'Login.Farcaster',
            'Login.SMS',
            'Id.User',
            'AccessToken',
            // 'Id.User.Phone',
            'Farcaster',
            'Wallet.List',
            'Wallet.List.Title',
            'Refresh',
          ]}
          data={{
            provider: Auth.Env.provider,
            wallet: { list: { label: 'Public Key' } },
            accessToken: { jwt: current.jwt },
            farcaster: {
              cmd: main.fc,
              signer: {},
              identity: { onClick: (e) => console.info(`⚡️ farcaster.identity.onClick`, e) },
            },
          }}
          onReady={(e) => console.info('⚡️ Auth.onReady:', e)}
          onChange={(e) => state.change((d) => (d.jwt = e.accessToken))}
        />
      );
    });

    dev.hr(5, 20);

    dev.row((e) => {
      return (
        <PeerRepoList.Info.Stateful theme={theme} title={['Network', 'Shared']} network={network} />
      );
    });

    dev.hr(5, 20);

    dev.row((e) => {
      const shorten = (text: string | unknown = '', max: number) => {
        let res = typeof text === 'string' ? text : '';
        if (res.length > max) res = `${res.slice(0, max - 3)}...`;
        return res;
      };
      const uri = main.state.me.uri;
      return (
        <CrdtInfo.Stateful
          theme={theme}
          title={['Private State', 'Local']}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          repos={{ main: main.repo.fs }}
          data={{
            repo: 'main',
            document: [
              {
                uri,
                label: 'Me',
                address: { head: true },
                object: { name: 'me', visible: false },
              },
              {
                uri,
                label: 'Me: root',
                address: { head: true },
                object: { name: 'me.root', lens: ['root'], visible: false, expand: { level: 2 } },
              },
              {
                uri,
                label: 'Me: identity',
                address: { head: true },
                object: { name: 'me.identity', visible: false, lens: ['identity'] },
              },
            ],
          }}
          onBeforeObjectRender={(obj: any) => {
            const text = obj.config?.text;
            if (typeof text === 'string') obj.config.text = shorten(text, 22);
          }}
        />
      );
    });

    dev.hr(5, 20);
    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
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
