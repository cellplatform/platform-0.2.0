import { COLORS, css, Dev } from '../../test.ui';
import { Icons } from '../Icons.mjs';

import type { IconProps } from '.';

type T = {
  props: IconProps;
  debug: { inheritColor: boolean };
};
const initial: T = {
  props: { tooltip: 'Hello' },
  debug: { inheritColor: true },
};

export default Dev.describe('Icon', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        const debug = e.state.debug;
        const styles = {
          base: css({
            color: debug.inheritColor ? COLORS.MAGENTA : undefined, // NB: button should inherit this color.
          }),
        };
        return (
          <div {...styles.base}>
            <Icons.Face {...e.state.props} size={150} />
          </div>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    dev.boolean((btn) =>
      btn
        .label((e) => `inherit color: ${e.state.debug.inheritColor ? 'magenta' : '(none)'}`)
        .value((e) => e.state.debug.inheritColor)
        .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'inheritColor'))),
    );

    dev.hr();

    dev.section('Color', (dev) => {
      const color = (name: string, value?: string) => {
        dev.button(name, (e) => e.change((d) => (d.props.color = value)));
      };
      color('black (dark)', COLORS.DARK);
      color('cyan', COLORS.CYAN);
      color('blue', COLORS.BLUE);
      color('red', COLORS.RED);
      dev.hr(-1, 5);
      color('<undefined> - inherit');
    });

    dev.hr();

    dev.section('tooltip', (dev) => {
      dev.button('"Hello"', (e) => e.change((d) => (d.props.tooltip = 'Hello')));
      dev.button('none', (e) => e.change((d) => (d.props.tooltip = undefined)));
    });
  });
});
