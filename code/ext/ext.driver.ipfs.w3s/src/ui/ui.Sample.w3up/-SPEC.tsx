import { Dev, type t } from '../../test.ui';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.Web3Up-Client';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <div style={{ padding: 8 }}>{`🐷 ${'Sample'}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    /**
     * NOTE:
     *    This is the "new" client, which is still in development.
     *    https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#basic-usage
     */
    dev.section('debug', (dev) => {
      dev.button((btn) => {
        const github = 'https://github.com/web3-storage/w3up/tree/main/packages/w3up-client';
        btn
          .label(`lib`)
          .right((e) => (
            <a href={github} target={'_blank'}>
              {'github (pre-release)'}
            </a>
          ))
          .enabled((e) => true)
          .onClick(async (e) => {
            const { create } = await import('@web3-storage/w3up-client');
            const client = await create();
            console.log('client', client);
          });
      });
    });

    dev.hr(0, 5);
    dev.TODO();
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
