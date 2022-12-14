import { Spec } from '../common';

export const root = Spec.describe('MySample', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    const el = <div>Hello</div>;
    ctx.component.size(300, 140).display('flex').backgroundColor(1).render(el);
  });

  e.it('foo', async (e) => {
    const ctx = Spec.ctx(e);
    const el = <div>{`Hello Foo!`}</div>;
    ctx.debug.TEMP(el);
  });
});

export default root;
