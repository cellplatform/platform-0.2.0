import { Boolean } from '.';
import { Dev, ObjectView } from '../../test.ui';

import type { BooleanProps } from './ui.Boolean';

type T = { props: BooleanProps; count: number };
const initial: T = {
  props: { value: true },
  count: 0,
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
      .render<T>((e) => <ObjectView name={'state'} data={e.state} />);

    dev
      .button('state: increment count', (e) => e.change((d) => d.count++))
      .button('toggle value', (e) => e.change(({ props }) => (props.value = !props.value)))
      .hr()
      .boolean((btn) => btn.label('no `onClick` - disabled').value(true))
      .boolean((btn) =>
        btn
          .label((e) => `dynamic label and value (count: ${e.state.count})`)
          .value((e) => e.state.count % 2 === 0)
          .onClick((e) => e.change((d) => d.count++)),
      )
      .hr()
      .boolean('label shorthand', true, (btn) => {
        btn.value(false).label('turned off');
      });
  });
});
