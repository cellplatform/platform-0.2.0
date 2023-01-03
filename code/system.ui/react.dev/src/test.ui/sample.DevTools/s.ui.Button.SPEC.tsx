import { ButtonSample } from '.';
import { Spec } from '../common';
import { DevTools } from './s.DevTools';

let _count = 0;

export default Spec.describe('sample.DevTools.Button', (e) => {
  e.it('init', (e) =>
    Spec.once(e, (ctx) => {
      ctx.component
        .display('grid')
        .size(200, undefined)
        .render((e) => {
          return (
            <ButtonSample
              ctx={ctx}
              label={'My Button'}
              onClick={() => console.info('init/onClick', e)}
            />
          );
        });
    }),
  );

  e.it('Buttons', (e) => {
    const dev = DevTools.curry(e);

    dev.button((btn) => {
      btn.label('change state').onClick(async (e) => {
        type T = { count: number };
        const state = await e.ctx.state<T>({ count: 0 });
        await state.change((s) => s.count++);

        console.log('-------------------------------------------');
        console.log('e.ctx.toObject()', e.ctx.toObject());
        console.log('e.ctx.toObject().props', e.ctx.toObject().props);
        console.log('state.current', state.current);
        btn.label(`state | count: ${state.current.count}`);
      });
    });

    dev.button((btn) => {
      btn.label('change label').onClick(async (e) => {
        _count++;
        btn.label(`hello-${_count}`);
      });
    });
  });
});
