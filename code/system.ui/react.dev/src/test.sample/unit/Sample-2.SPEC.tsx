import { Spec, TestLog } from '../common';

export function Wrapper() {
  const log = TestLog.create();

  const root = Spec.describe('MySample', (e) => {
    e.it('init', async (e) => {
      const ctx = Spec.ctx(e);
      const el = <div>Hello</div>;
      ctx.component.size(300, 140).display('flex').backgroundColor(1).render(el);
      log.push(e, ctx);
    });

    e.it('foo-1', async (e) => {
      const ctx = Spec.ctx(e);
      const el = <div>{`Hello Foo!`}</div>;
      ctx.debug.TEMP(el);
      log.push(e, ctx);
    });

    e.it('foo-2', async (e) => {
      const ctx = Spec.ctx(e);
      log.push(e, ctx);
    });
  });

  return { root, log };
}

export const root = Wrapper().root;
export default root;
