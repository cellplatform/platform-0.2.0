import { DevTools } from '.';
import { t, RenderCount, Dev } from '../../test.ui';
import { css } from '../common';

type T = { count: number; on: boolean; theme: t.CommonTheme };
const initial: T = { count: 0, on: true, theme: 'Light' };

export default Dev.describe('DevTools', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);

    const state = await ctx.state<T>(initial);

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
    debug.footer.border(-0.15).render((e) => <Dev.Object data={e.state} style={{ margin: 8 }} />);

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

    dev.TODO();

    dev.section('Boolean', (dev) => {
      /**
       * Booleaan
       */
      dev
        .boolean(async (btn) => {
          btn
            .label('toggle (within closure)')
            .value(true)
            .onClick((e) => {
              console.log('e', e);
              e.value(!e.current);
            });
        })

        .boolean(async (btn) => {
          btn
            .label((e) => `state: ${e.state.on ? 'on' : 'off'}`)
            .value((e) => e.state.on)
            .onClick((e) => {
              e.change((d) => (d.on = !e.current));
            });
        })

        .boolean((btn) =>
          btn
            .label((e) => `theme: "${e.state.theme}"`)
            .value((e) => e.state.theme === 'Light')
            .onClick((e) =>
              e.change((d) => {
                d.theme = e.current ? 'Dark' : 'Light';
                dev.theme(d.theme);
                e.ctx.component.backgroundColor(d.theme === 'Dark' ? 0 : 1);
              }),
            ),
        );

      dev.hr();
    });
  });
});

/**
 * Sample
 */

export type SampleProps = { state: T };
export const Sample: React.FC<SampleProps> = (props) => {
  const theme = props.state.theme;
  const styles = {
    base: css({ Padding: [5, 12], fontSize: 14 }),
  };
  return (
    <div {...styles.base}>
      <Dev.Object name={'state'} data={props.state} theme={theme} />
      <RenderCount absolute={[-20, 5]} theme={theme} />
    </div>
  );
};
