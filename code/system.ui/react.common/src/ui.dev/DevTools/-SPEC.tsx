import { useState } from 'react';

import { DevTools } from '.';
import { Dev, Pkg, RenderCount, type t } from '../../test.ui';
import { css } from '../common';

type T = { count: number; on: boolean; theme: t.CommonTheme };
const initial: T = { count: 0, on: true, theme: 'Light' };

export default Dev.describe('DevTools', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.subject
      .display('grid')
      .size([400, null])
      .backgroundColor(1)
      .render<T>((e) => <Sample state={e.state} />);
  });

  e.it('ui:debug', async (e) => {
    const dev = DevTools.init<T>(e, initial);
    const debug = dev.ctx.debug;

    /**
     * Header/Footer bars.
     */
    debug.footer.border(-0.15).render((e) => <Dev.Object data={e.state} style={{ margin: 8 }} />);

    dev.title('DevTools', { margin: 0 }).hr(5);

    /**
     * Buttons
     */

    dev.button((btn) =>
      btn.label('state: increment (+)').onClick(async (e) => {
        await e.state.change((draft) => draft.count++);
        e.label(`state: increment (+): count-${e.state.current.count}`);
      }),
    );

    dev.hr(-1, 8);

    dev.textbox((txt) => txt.label('My Textbox TODO'));

    dev.hr(5, 20);

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
                e.ctx.subject.backgroundColor(d.theme === 'Dark' ? 0 : 1);
              }),
            ),
        );

      dev.hr(5, 20);

      dev.section('Section (Pending)');
    });

    dev.row((e) => <Sample state={e.state} theme={'Light'} />);
    dev.hr(-1, 5);

    const target = 'Module.Loader.Stateful';
    Dev.link.ns(Pkg, dev, `namespace: ƒ("Module.Loader")`, target);
    Dev.link
      .pkg(Pkg, dev)
      .ns(`pkg.dev (1): "Foo"`, target)
      .ns(`pkg.dev (2): "Foo.Bar"`, target)
      .hr()
      .ns(`external site: wikipedia`, 'https://www.wikipedia.org/');
  });
});

/**
 * Sample
 */

export type SampleProps = { state: T; theme?: t.CommonTheme };
export const Sample: React.FC<SampleProps> = (props) => {
  /**
   * NOTE: ensuring hooks behave as expected.
   */
  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => setOver(isOver);

  const theme = props.theme ?? props.state.theme;
  const styles = { base: css({ Padding: [5, 12], fontSize: 14 }) };
  const data = { state: props.state, isOver };

  return (
    <div {...styles.base} onMouseEnter={over(true)} onMouseLeave={over(false)}>
      <Dev.Object name={'state'} data={data} theme={theme} />
      <RenderCount absolute={[-20, 5]} theme={theme} />
    </div>
  );
};
