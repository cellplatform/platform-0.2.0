import { ProgressBar, ProgressBarProps } from './ui.ProgressBar';
import { Dev } from '../../test.ui';

type T = { props: ProgressBarProps };
const initial: T = {
  props: {
    percent: 0.01,
    duration: 100,
  },
};

export default Dev.describe('ProgressBar', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        return (
          <ProgressBar
            {...e.state.props}
            onClick={(e) => {
              console.info('⚡️ onClick', e);
              state.change((d) => (d.props.percent = e.percent));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'ProgressBar'} data={e.state} expand={1} />);

    dev.section('Percent (Progress)', (dev) => {
      const percent = (value: number) => {
        dev.button((btn) =>
          btn
            .label(`${value * 100}%`)
            .right((e) => (e.state.props.percent === value ? 'current' : ''))
            .onClick((e) => {
              e.change((d) => (d.props.percent = value));
            }),
        );
      };

      percent(0);
      dev.hr(-1, 5);
      percent(0.01);
      percent(0.25);
      percent(0.85);
      percent(1);
    });

    dev.hr(5, 20);

    dev.section('TimeMap', (dev) => {
      dev.button('assign', (e) => {
        e.change((d) => {
          d.props.timemap = [
            { start: 0, end: 10 },
            { start: 10, end: 55 },
            { start: 55 },
            { start: 85 },
          ];
        });
      });

      dev.button('clear', (e) => e.change((d) => (d.props.timemap = undefined)));
    });
  });
});
