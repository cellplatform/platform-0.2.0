import { Dev } from '..';
import { TestRunner } from '.';
import { Color, css } from '../common';

export default Dev.describe('TestRunner', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component
      .size('fill')
      .display('grid')
      .render(() => <TestRunner />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools(e);
    dev.button((btn) => btn.label('🐷').onClick((e) => null));

    dev.hr();

    dev.ctx.debug.row((e) => {
      const styles = {
        base: css({
          backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
          border: `solid 1px ${Color.format(-0.1)}`,
          padding: 15,
        }),
      };
      return <div {...styles.base}>🐷 Debug Panel Runner</div>;
    });
  });
});
