import { Color, Dev, Pkg, css, type t } from '../../test.ui';
import { View } from './-SPEC.ui';
import { Footer } from './-SPEC.ui.footer';
import { BADGES, Peer, PeerRepoList, RepoList, WebStore, WebrtcStore } from './common';
import { Loader } from './-SPEC.loader';

type T = { stream?: MediaStream; overlay?: JSX.Element };
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
          overlay: css({ Absolute: 0, display: 'grid', backgroundColor: Color.WHITE }),
        };
        return (
          <div {...styles.base}>
            <View
              stream={e.state.stream}
              model={model}
              network={network}
              onStreamSelection={(e) => state.change((d) => (d.stream = e.selected))}
            />
            {e.state.overlay && <div {...styles.overlay}>{e.state.overlay}</div>}
          </div>
        );
      });

    ctx.host.footer.padding(0).render((e) => {
      return (
        <Footer
          network={network}
          onUnload={(e) => state.change((d) => (d.overlay = undefined))}
          onLoad={async (e) => {
            const el = await Loader.load(e.name);
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
            'Link.Wallet',
            'Wallet.List',
            'Wallet.List.Title',
            'Refresh',
          ]}
          data={{ provider: Auth.Env.provider, wallet: { list: { title: 'Public Key' } } }}
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
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer
      .padding(7.5)
      .border(-0.1)
      .render<T>((e) => {
        const styles = {
          base: css({ display: 'grid', gridTemplateColumns: '1fr 1fr' }),
          block: css({ display: 'block' }),
          version: css({
            fontFamily: 'monospace',
            fontSize: 11,
            alignSelf: 'center',
            justifySelf: 'end',
          }),
        };

        const badge = BADGES.ci.node;
        const elBadge = (
          <a href={badge?.href} target={'_blank'} rel={'noopener noreferrer'}>
            <img {...styles.block} src={badge?.image} />
          </a>
        );

        const elVersion = <div {...styles.version}>{`v${Pkg.version}`}</div>;

        return (
          <div {...styles.base}>
            {elBadge}
            {elVersion}
          </div>
        );
      });
  });
});
