/**
 * Polyfill: Required for [@standard-crypto/farcaster-js] in production builds.
 *           Upstream dependency of [@privy-io/react-auth]
 *
 * https://github.com/standard-crypto/farcaster-js
 */
import { Buffer } from 'buffer';
if (!window.Buffer) window.Buffer = Buffer;

import { Color, Dev, css, type t } from '../../test.ui';
import { Dsl } from './-SPEC.cmd.dsl';
import { SampleLayout } from './-SPEC.ui';
import { DebugFooter } from './-SPEC.ui.debug.footer';
import { Footer } from './-SPEC.ui.footer';
import { Cmd, Immutable, Peer, PeerRepoList, RepoList, WebStore, WebrtcStore } from './common';

type T = {
  stream?: MediaStream;
  overlay?: JSX.Element;
};
const initial: T = {};

/**
 * Spec
 */
const name = 'Main.000';

export default Dev.describe(name, async (e) => {
  const self = Peer.init();
  const store = WebStore.init({
    storage: 'fs',
    network: [],
  });
  const model = await RepoList.model(store, {
    behaviors: ['Focus.OnArrowKey', 'Shareable', 'Deletable', 'Copyable'],
  });
  const network: t.NetworkStore = await WebrtcStore.init(self, store, model.index, {});
  const theme: t.CommonTheme = 'Light';

  /**
   * Commands for Farcaster.
   */
  const doc = Immutable.clonerRef({}); // NB: Default simple "cloner" immutable.
  const fcCommand = Cmd.create<t.FarcasterCmd>(doc) as t.Cmd<t.FarcasterCmd>;
  //   const sendSampleCast = async () => {
  //     const method = fcCommand.method('get:fc', 'get:fc:res');
  //     const res = await method.invoke({}).promise();
  //     const fc = res.result?.fc as t.Farcaster; // TEMP 🐷 no "as" cast
  //
  //     if (fc) {
  //       const payload = { text: 'Hello 👋' };
  //       console.log('payload', payload);
  //       console.log('fc.fid', fc.fid);
  //       console.log('fc.signer', fc.signer);
  //       const res = await fc.hub.submitCast(payload, fc.fid, fc.signer);
  //       console.log('res', res);
  //     }
  //   };

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
            {/* <div {...styles.overlay}></div> */}
          </div>
        );
      });

    ctx.host.footer.padding(0).render((e) => {
      return (
        <Footer
          cmd={fcCommand}
          network={network}
          onUnload={(e) => state.change((d) => (d.overlay = undefined))}
          onLoad={async (e) => {
            const el = await Dsl.load(e.name);
            state.change((d) => (d.overlay = el));
          }}
        />
      );
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
            'Id.User.Phone',
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
              cmd: fcCommand,
              signer: {},
              identity: {
                onClick: (e) => {
                  console.info(`⚡️ farcaster.identity.onClick`, e);
                },
              },
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
      return (
        <PeerRepoList.Info
          stateful={true}
          title={'Network'}
          fields={['Repo', 'Peer', 'Network.Transfer', 'Network.Shared']}
          data={{
            network,
            repo: model,
            shared: [
              { label: 'State: system', object: { lens: ['sys'], ...obj } },
              { label: 'State: namespace', object: { lens: ['ns'], ...obj } },
            ],
          }}
        />
      );
    });

    dev.hr(5, 20);
    dev.section('Debug', (dev) => {
      dev.hr(0, 3);
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
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
