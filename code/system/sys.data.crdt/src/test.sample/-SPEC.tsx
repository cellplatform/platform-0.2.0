import { Dev } from '../test.ui';

type T = { count: number };
const initial: T = { count: 0 };

/**
 * Automerge Tutorial
 * https://automerge.org/docs/tutorial/create-a-document/
 */
export default Dev.describe('Sample', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .size(250, null)
      .render<T>((e) => {
        return (
          <div>
            <div>{`🐷 Hello TODO List`}</div>
            <div>{`count: ${e.state.count}`}</div>
          </div>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'sys.crdt'} data={e.state} expand={1} />);

    dev.button('tmp', (e) => e.change((d) => d.count++));
  });
});
