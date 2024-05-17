import { Spec } from '../common';
import { DevTools } from '../sample.DevTools';

type TOutput = JSX.Element | null | undefined;

export default Spec.describe('EmptyDiv', (e) => {
  let el: TOutput = null;

  e.it('init', (e) => {
    const ctx = Spec.ctx(e);
    ctx.subject.render(() => {
      console.log('render', el);
      return el;
    });
  });

  e.it('ui:debug', async (e) => {
    const ctx = Spec.ctx(e);
    const dev = DevTools.init(e);

    const button = (label: string, output?: TOutput) => {
      dev.button((btn) => {
        btn.label(label).onClick((e) => {
          el = output;
          ctx.redraw();
        });
      });
    };

    button('<div/>', <div />);
    button('null', null);
    button('undefined', undefined);

    dev.hr();
    dev.button((btn) => btn.label('redraw').onClick(() => ctx.redraw()));
  });
});
