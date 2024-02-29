import { Spec } from '../common';

export const root = Spec.describe('MySample', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    ctx.subject
      .size([300, 140])
      .display('flex')
      .backgroundColor(1)
      .render((e) => {
        const env = ctx.env;
        const message = typeof env?.msg === 'string' ? env.msg : 'Hello Subject';
        return <div>{message}</div>;
      });
  });

  e.it('foo', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.debug.row(() => <div>{`Hello Row!`}</div>);
  });
});

export default root;
