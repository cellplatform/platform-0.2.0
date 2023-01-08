import { Button } from './ui.Button';
import { Dev, ObjectView } from '../../test.ui';
import { Switch } from '../common';

import type { ButtonProps } from './ui.Button';

type T = { props: ButtonProps; count: number };
const initial: T = {
  props: { rightElement: <div>123</div>, onClick: (e) => console.info(`⚡️ onClick`) },
  count: 0,
};

export default Dev.describe('Button', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.component
      .display('grid')
      .size(250, null)
      .render<T>((e) => <Button {...e.state.props} />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.ctx.debug.footer
      .border(-0.1)
      .render<T>((e) => <ObjectView name={'props'} data={e.state.props} />);

    dev
      .button((btn) =>
        /**
         * NOTE: primary (full) functional declaration.
         */
        btn.label('rename (self)').onClick(async (e) => {
          await e.change((draft) => draft.count++);
          e.label(`renamed-${e.state.current.count}`);
        }),
      )
      /**
       * Shorthand: "label", "onClick" parameter declaration.
       */
      .button('remove `onClick`', (e) => e.change(({ props }) => (props.onClick = undefined)))
      .hr()
      .button('right: clear', (e) => e.change(({ props }) => (props.rightElement = undefined)))
      .button('right: `<Switch>`', (e) =>
        e.change(({ props }) => (props.rightElement = <Switch height={16} />)),
      )
      .button('right: `<div>123</div>`', (e) =>
        e.change(({ props }) => (props.rightElement = <div>123</div>)),
      );
  });
});
