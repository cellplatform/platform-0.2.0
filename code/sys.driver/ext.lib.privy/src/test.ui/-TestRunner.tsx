import { Dev, type t } from './common';

type T = {
  ready?: boolean;
  spinning?: boolean;
  results?: t.TestSuiteRunResponse[];
};
const initial: T = {};

export default Dev.describe('TestRunner', (e) => {
  let privy: t.PrivyInterface;
  let wallets: t.ConnectedWallet[] = [];

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        const { spinning, results } = e.state;
        return (
          <Dev.TestRunner.Results
            style={{ Absolute: 0 }}
            data={results}
            spinning={spinning}
            scroll={true}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const ctx = (): t.TestCtx => ({ privy, wallets });

    dev.row(async (e) => {
      const { Auth } = await import('..');
      return (
        <Auth.Info
          data={{ provider: Auth.Env.provider }}
          fields={['Module', 'Id.User', 'Login']}
          clipboard={false}
          onChange={(e) => {
            privy = e.privy;
            wallets = e.wallets;
            if (privy.authenticated) state.change((d) => (d.ready = true));
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.bdd((runner) =>
      runner
        .run({ ctx })
        .enabled(() => Boolean(privy?.authenticated))
        .modules(async () => (await import('./-TestRunner.TESTS')).TESTS.all)
        .localstore('dev:ext.lib.privy')
        .keyboard(true)
        .onChanged((e) => state.change((d) => (d.results = e.results))),
    );
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { Results: e.state.results };
      return <Dev.Object name={'TestRunner'} data={data} expand={1} />;
    });
  });
});
