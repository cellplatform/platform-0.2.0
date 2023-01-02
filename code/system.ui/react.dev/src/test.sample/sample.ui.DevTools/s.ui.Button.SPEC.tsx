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
      btn.label('hello').onClick(async (e) => {
        console.log('-------------------------------------------');
        console.log('onClick', e);

        type T = { count: number };
        const state = await e.ctx.state<T>({ count: 0 });
        await state.change((s) => s.count++);

        console.log('e.ctx.toObject()', e.ctx.toObject());
        console.log('e.ctx.toObject().props', e.ctx.toObject().props);
        console.log('state.current', state.current);
        btn.label(`hello-${state.current.count}`);
      });
    });
  });
});
