import { Dev, Pkg, type t } from '../../test.ui';
import { Sample } from './-SPEC.ui.Sample';

type T = { theme?: t.CommonTheme };
const initial: T = {};

const URLS = {
  fc: {
    helloworld: `https://docs.farcaster.xyz/developers/guides/basics/hello-world`,
  },
  privy: {
    read: `https://docs.privy.io/guide/react/recipes/misc/farcaster`,
    write: `https://docs.privy.io/guide/react/recipes/misc/farcaster-writes`,
  },
};

/**
 * Spec
 */
const name = 'Sample.01';
export default Dev.describe(name, async (e) => {
  type LocalStore = Pick<T, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ theme: 'Dark' });

  let privy: t.PrivyInterface | undefined;
  let signer: t.FarcasterSignerMethods | undefined;
  let fc: t.Farcaster | undefined;

  // const fc = createFarcaster()

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.theme = local.theme;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        const { theme } = e.state;
        Dev.Theme.background(ctx, theme, 1);
        return (
          <Sample
            theme={theme}
            onSigner={(e) => {
              signer = e.signer;
              dev.redraw();
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.row(async (e) => {
      const { Auth } = await import('ext.lib.privy');
      return (
        <Auth.Info
          fields={[
            'Login',
            'Login.Farcaster',
            'Id.User',
            'Farcaster.Identity',
            'Wallet.Link',
            'Wallet.List',
            'Wallet.List.Title',
            'Refresh',
          ]}
          data={{ provider: Auth.Env.provider, wallet: { list: { title: 'Public Key' } } }}
          onChange={(e) => console.info('⚡️ Auth.onChange:', e)}
          onReady={(e) => {
            privy = e.privy;
            dev.redraw();
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Functions', (dev) => {
      dev.button((btn) => {
        btn
          .label(`create signer`)
          .right((e) => `←`)
          .enabled((e) => !!fc?.account && !fc.account.signerPublicKey)
          .onClick(async (e) => {
            await signer?.requestFarcasterSignerFromWarpcast();
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      Dev.Theme.switch(dev, ['theme'], (next) => (local.theme = next));
    });

    dev.hr(5, 20);

    dev.section('Links', (dev) => {
      link.button('privy: read', URLS.privy.read);
      link.button('privy: write (signer)', URLS.privy.write);
      dev.hr(-1, 5);
      link.button('farcaster: "Hello World"', URLS.fc.helloworld);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { fc };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
