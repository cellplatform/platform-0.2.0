import { Dev } from '../../test.ui';
import { RootHolding, RootHoldingProps } from '.';

type T = { props: RootHoldingProps };
const initial: T = { props: {} };

export default Dev.describe('Root (Holding Pattern)', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => <RootHolding />);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={3} />);
  });
});
