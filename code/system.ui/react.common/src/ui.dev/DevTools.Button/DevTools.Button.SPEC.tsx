import { Dev } from '../../test.ui';
import { Switch } from '../common';
import { Button } from './ui.Button';

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

    dev.footer.border(-0.1).render<T>((e) => <Dev.Object name={'props'} data={e.state.props} />);

    dev
      .button('state: increment count', async (e) => {
        await e.change((d) => d.count++);
        e.label(`state: count-${e.state.current.count}`);
      })
      .button((btn) => {
        let count = 0;
        return btn.label('rename (self)').onClick((e) => {
          count++;
          e.label(`renamed-${count} (within closure)`);
        });
      })
      .button((btn) => {
        return btn
          .label((e) => {
            const bg = e.dev.component.backgroundColor ?? 0;
            const count = e.state.count;
            return `change props: (props-${bg}) / state-${count}`;
          })
          .onClick((e) => e.ctx.component.backgroundColor(1));
      })
      /**
       * Shorthand: "label", "onClick" parameter declaration.
       */
      .button('no `onClick`')
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
