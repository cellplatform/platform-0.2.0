/**
 * Polyfill: Required for [@standard-crypto/farcaster-js] in production builds.
 *           Upstream dependency of [@privy-io/react-auth]
 *
 * https://github.com/standard-crypto/farcaster-js
 */
import { Buffer } from 'buffer';
if (!window.Buffer) window.Buffer = Buffer;

import { Color, Dev, Pkg, css } from '../test.ui';
import {
  Cmd,
  CmdBar,
  Doc,
  CrdtInfo,
  Immutable,
  Peer,
  PeerRepoList,
  RepoList,
  WebStore,
  WebrtcStore,
  type t,
} from './common';
import { SampleLayout } from './ui';
import { Footer } from './ui.CmdBar';
import { DebugFooter } from './ui.debug';

type T = { stream?: MediaStream; overlay?: JSX.Element };
const initial: T = {};

/**
 * Spec
 */
const name = 'Main.000';

export default Dev.describe(name, async (e) => {
  type LocalStore = { me?: t.UriString };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ me: undefined });
  const self = Peer.init();

  const Store = {
    fs: WebStore.init({ storage: 'fs', network: [] }),
    tmp: WebStore.init({ storage: 'fs.tmp', network: [] }),
    async getMeDoc() {
      const fs = Store.fs.doc;
      if (!(await fs.exists(local.me))) local.me = undefined;
      const doc = await fs.getOrCreate((d) => null, local.me);
      local.me = doc.uri;
      return doc;
    },
  } as const;

  const Index = {
    fs: await WebStore.index(Store.fs),
  } as const;

  const model = await RepoList.model(Store.tmp, {
    behaviors: ['Focus.OnArrowKey', 'Shareable', 'Deletable', 'Copyable'],
  });
  const network: t.NetworkStore = await WebrtcStore.init(self, Store.tmp, model.index, {});
  const theme: t.CommonTheme = 'Light';

  const me = await Store.getMeDoc();
  const cmd: t.ShellCommands = {
    fc: Cmd.create<t.FarcasterCmd>(Immutable.clonerRef({})) as t.Cmd<t.FarcasterCmd>,
    cmdbar: CmdBar.Ctrl.create().cmd,
  };
  const main: t.Shell = {
    cmd,
    state: {
      me,
      cmdbar: network.shared.ns.lens('dev.cmdbar', {}),
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size('fill', 36)
      .display('grid')
      .render<T>((e) => {
        const styles = {
          base: css({ Absolute: 0, display: 'grid' }),
          overlay: css({
            Absolute: 0,
            display: 'grid',
            backgroundColor: Color.WHITE,
            overflow: 'hidden',
          }),
        };

        const overlay = e.state.overlay;
        const elOverlay = overlay && <div {...styles.overlay}>{overlay}</div>;

        return (
          <div {...styles.base}>
            <SampleLayout model={model} network={network} selectedStream={e.state.stream} />
            {elOverlay}
          </div>
        );
      });

    ctx.host.footer.padding(0).render((e) => {
      return <Footer main={main} onOverlay={(e) => state.change((d) => (d.overlay = e.el))} />;
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

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
            'Wallet.Link',
            'Wallet.List',
            'Wallet.List.Title',
            'Refresh',
          ]}
          data={{
            provider: Auth.Env.provider,
            wallet: { list: { label: 'Public Key' } },
            farcaster: {
              cmd: main.cmd.fc,
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
      const obj = { expand: { level: 1 } };
      const uri = { head: true };
      return (
        <PeerRepoList.Info
          stateful={true}
          title={['Network', 'Shared']}
          fields={['Repo', 'Peer', 'Network.Transfer', 'Network.Shared']}
          data={{
            network,
            repo: model,
            shared: [
              { label: 'State: system', object: { lens: ['sys'], ...obj }, uri },
              { label: 'State: namespace', object: { lens: ['ns'], ...obj }, uri },
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
          title={['Local', 'Private']}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: { store: Store.fs, index: Index.fs },
            document: [
              {
                label: 'Me',
                ref: main.state.me,
                uri: { head: true },
                object: {
                  name: 'me',
                  visible: false,
                  beforeRender(e) {
                    const root = e.root as any;
                    root.config = shorten(root?.config, 20);
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
                  beforeRender(e) {
                    e.config = shorten(e.config, 22);
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
