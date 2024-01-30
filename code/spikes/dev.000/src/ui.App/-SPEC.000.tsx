import { Dev, Pkg, css, type t } from '../test.ui';
import { badge } from '../test.ui/ci.badge';
import { View } from './-SPEC.000.View';
import { Peer, PeerRepoList, RepoList, WebStore, WebrtcStore } from './common';

type T = { stream?: MediaStream };
const initial: T = {};

/**
 * Spec
 */
const name = 'App.01';
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
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return (
          <View
            stream={e.state.stream}
            model={model}
            network={network}
            onStreamSelection={(e) => state.change((d) => (d.stream = e.selected))}
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
            'Auth.Login',
            'Id.User',
            'Id.User.Phone',
            'Auth.Link.Wallet',
            'Wallet.List',
            'Wallet.List.Title',
            'Refresh',
          ]}
          data={{
            provider: Auth.Env.provider,
            wallet: { list: { title: 'Public Key' } },
          }}
          onChange={(e) => console.info('⚡️ Auth.onChange:', e)}
        />
      );
    });

    dev.hr(5, 20);

    dev.row((e) => {
      return (
        <PeerRepoList.Info
          title={'Network'}
          fields={['Repo', 'Peer', 'Network.Transfer', 'Network.Shared', 'Network.Shared.Json']}
          data={{
            network,
            repo: model,
            shared: { object: { expand: { level: 1 } } },
          }}
        />
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer
      .padding(8)
      .border(-0.1)
      .render<T>((e) => {
        const styles = {
          base: css({
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }),
          block: css({ display: 'block' }),
          version: css({
            fontFamily: 'monospace',
            fontSize: 11,
            alignSelf: 'center',
            justifySelf: 'end',
          }),
        };

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
