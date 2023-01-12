import { DevTools } from '.';
import { RenderCount, Dev } from '../../test.ui';
import { css } from '../common';

const initial = { count: 0, on: true };
type T = typeof initial;

export default Dev.describe('DevTools', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component
      .display('grid')
      .size(350, undefined)
      .backgroundColor(1)
      .render<T>((e) => <Sample state={e.state} />);
  });

  e.it('debug panel', async (e) => {
    const dev = DevTools.init<T>(e, initial);
    const debug = dev.ctx.debug;

    /**
     * Header/Footer bars.
     */
    debug.footer
      .border(-0.15)
      .render((e) => <Dev.ObjectView data={e.state} style={{ margin: 8 }} />);

    dev.title('DevTools', { margin: 0 }).hr();

    /**
     * Buttons
     */
    dev.button((btn) =>
      btn.label('state: increment (+)').onClick(async (e) => {
        await e.state.change((draft) => draft.count++);
        e.label(`state: increment (+): count-${e.state.current.count}`);
      }),
    );

    dev.hr();

    /**
     * Booleaan
     */
    dev.boolean(async (btn) => {
      btn
        .label('toggle (within closure)')
        .value(true)
        .onClick((e) => {
          console.log('e', e);
          e.value(!e.current);
        });
    });

    dev.boolean(async (btn) => {
      btn
        .label((e) => `state: ${e.state.on ? 'on' : 'off'}`)
        .value((e) => e.state.on)
        .onClick((e) => {
          e.change((d) => (d.on = !e.current));
        });
    });
  });
});

/**
 * Sample
 */

export type SampleProps = { state: T };
export const Sample: React.FC<SampleProps> = (props) => {
  const styles = {
    base: css({ Padding: [5, 12], fontSize: 14 }),
  };
  return (
    <div {...styles.base}>
      <Dev.ObjectView name={'state'} data={props.state} />
      <RenderCount />
    </div>
  );
};
