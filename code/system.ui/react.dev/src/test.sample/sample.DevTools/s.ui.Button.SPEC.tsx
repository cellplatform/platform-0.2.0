import { Spec } from '../../test.ui';
import { ButtonSample } from '.';
import { DevToolsSample as DevTools } from './s.DevTools';

export default Spec.describe('sys.dev.sample.Button', (e) => {
  e.it('init', (e) =>
    Spec.once(e, (ctx) => {
      ctx.component
        .display('flex')
        .size(200, undefined)
        .render((e) => {
          return (
            <ButtonSample
              ctx={ctx}
              style={{ flex: 1 }}
              label={'My Button'}
              onClick={() => {
                console.info('init/onClick', e);
              }}
            />
          );
        });
    }),
  );

  e.it('Buttons', (e) => {
    DevTools.button(e, (btn) => {
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

    DevTools.button(e, (btn) => {
      btn.label('change label').onClick(async (e) => {
        _count++;
        btn.label(`hello-${_count}`);
      });
    });
  });
});

let _count = 0;
