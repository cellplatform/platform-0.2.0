import { Button } from './ui.Button';
import { Dev } from '..';
import { ObjectView, Switch } from '../common';

import type { ButtonProps } from './ui.Button';

type S = { props: ButtonProps; count: number };
const initial: S = {
  props: { right: <div>123</div>, onClick: () => console.info(`⚡️ onClick`) },
  count: 0,
};

export default Dev.describe('Button', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<S>(initial);
    ctx.component
      .display('grid')
      .size(250, undefined)
      .render<S>((e) => {
        return <Button {...e.state.props} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<S>(e, initial);

    dev.ctx.debug.footer
      .border(-0.1)
      .padding([12, 10])
      .render<S>((e) => <ObjectView name={'props'} data={e.state.props} />);

    dev
      .button('rename (self)', async (e) => {
        await e.change((draft) => draft.count++);
        e.label(`renamed-${e.state.current.count}`);
      })
      .button('remove `onClick`', (e) => e.change(({ props }) => (props.onClick = undefined)))
      .hr()
      .button('right: `<Switch>`', (e) =>
        e.change(({ props }) => (props.right = <Switch height={16} />)),
      )
      .button('right: 123', (e) => e.change(({ props }) => (props.right = <div>123</div>)))
      .button('right: (clear)', (e) => e.change(({ props }) => (props.right = undefined)));
  });
});
