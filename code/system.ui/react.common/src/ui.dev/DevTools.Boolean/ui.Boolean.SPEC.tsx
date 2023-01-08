import { Boolean } from '.';
import { Dev, ObjectView } from '../../test.ui';

import type { BooleanProps } from './ui.Boolean';

type T = { props: BooleanProps };
const initial: T = {
  props: { value: true },
};

export default Dev.describe('Boolean', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    const onClick = () => {
      state.change(({ props }) => {
        props.value = !props.value;
        props.label = props.value ? 'On' : 'Off';
      });
    };

    ctx.component
      .display('grid')
      .size(250, null)
      .render<T>((e) => <Boolean {...e.state.props} onClick={onClick} />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.ctx.debug.footer
      .border(-0.1)
      .render<T>((e) => <ObjectView name={'props'} data={e.state.props} />);

    dev.boolean((btn) => btn.label('no `onClick`').value(true));
  });
});
