import { Dev, ObjectView, expect } from '../../test.ui';
import { Boolean } from '.';

import type { BooleanProps } from './ui.Boolean';

type T = { props: ButtonProps };
const initial: T = {
  props: { onClick: () => console.info(`⚡️ onClick`) },
};

export default Dev.describe('Boolean', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.component
      .backgroundColor(1)
      .size(250, null)
      .render<T>((e) => {
        return <Boolean />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.ctx.debug.footer
      .border(-0.1)
      .render<T>((e) => <ObjectView name={'props'} data={e.state.props} />);
  });
});
