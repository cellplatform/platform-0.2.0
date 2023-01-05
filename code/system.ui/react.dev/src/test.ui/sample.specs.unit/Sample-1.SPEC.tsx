import { Spec } from '../common';

export const root = Spec.describe('MySample', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .size(300, 140)
      .display('flex')
      .backgroundColor(1)
      .render((e) => <div>Hello Component</div>);
  });

  e.it('foo', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.debug.row(() => <div>{`Hello Foo!`}</div>);
  });
});

export default root;
