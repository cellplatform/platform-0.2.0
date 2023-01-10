import { Dev, ObjectView } from '../../test.ui';
import { Switch, SwitchProps } from '.';

type T = { props: SwitchProps };
const initial: T = { props: { value: true } };

export default Dev.describe('Switch (Button)', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.component.render<T>((e) => {
      return (
        <Switch
          {...e.state.props}
          onClick={(e) => state.change(({ props }) => (props.value = !props.value))}
        />
      );
    });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.ctx.debug.footer
      .border(-0.1)
      .render<T>((e) => <ObjectView name={'state'} data={e.state} />);

    dev
      .button('toggle: `isEnabled`', (e) => {
        e.change(({ props }) => (props.isEnabled = !props.isEnabled));
      })
      .button('toggle: `value`', (e) => {
        e.change(({ props }) => (props.value = !props.value));
      });
  });
});
