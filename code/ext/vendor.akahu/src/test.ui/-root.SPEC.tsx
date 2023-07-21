import { Dev } from '../test.ui';
import { AkahuClient } from 'akahu';

/**
 * TODO 🐷 DO NOT CHECK IN!!!!!!!!!!!!!!!!!!
 */
const appToken = 'app_token_'; // TEMP 🐷
const userToken = 'user_token_'; // TEMP 🐷

type T = { count: number };
const initial: T = { count: 0 };

export default Dev.describe('Akahu', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <div>{`🐷 Hello-${e.state.count}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    dev.button('tmp', async (e) => {
      console.log('AkahuClient', AkahuClient);

      const headers = {};
      const akahu = new AkahuClient({ appToken, headers });
      const user = await akahu.users.get(userToken);
      const accounts = await akahu.accounts.list(userToken);

      console.log('user', user);
      console.log('accounts', accounts);
    });
  });
});
