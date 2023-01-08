import { DevTools } from '.';
import { RenderCount, Dev } from '../../test.ui';
import { css, ObjectView } from '../common';

const initial = { count: 0, boolean: true };
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
    debug.footer.border(-0.15).render((e) => <ObjectView data={e.state} style={{ margin: 8 }} />);

    /**
     * Buttons
     */
    dev
      .button((btn) =>
        btn.label('update state').onClick(async (e) => {
          await e.state.change((draft) => draft.count++);
          e.label(`state: count-${e.state.current.count}`);
        }),
      )
      .hr()
      .button('rename (self)', (btn) => {
        let count = 0;
        btn.label('rename (self)').onClick((e) => {
          count++;
          e.label(`renamed-${count}`);
        });
      });

    /**
     * Booleaan
     */
    dev.boolean(async (btn) => {
      const state = await btn.ctx.state<T>(initial);
      btn
        .label('my boolean')
        .value(state.current.boolean)
        .onClick((e) => {
          console.log('e', e);
          e.value(!e.current);
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
      <ObjectView name={'state'} data={props.state} />
      <RenderCount />
    </div>
  );
};
