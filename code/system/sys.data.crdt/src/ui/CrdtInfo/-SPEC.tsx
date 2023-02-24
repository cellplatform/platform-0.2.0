import { Dev } from '../../test.ui';
import { CrdtInfo, CrdtInfoProps } from '.';

type T = { props: CrdtInfoProps };
const initial: T = { props: {} };

export default Dev.describe('CrdtInfo', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .size(250, null)
      .render<T>((e) => <CrdtInfo {...e.state.props} />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);
  });
});
