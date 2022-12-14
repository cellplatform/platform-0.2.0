import { Spec } from '../common';

export function Wrapper() {
  type T = { id: string; text: string };

  const log = {
    items: [] as T[],
    push: (id: string, text: string) => log.items.push({ id, text }),
    reset: () => (log.items = []),
    get count() {
      return log.items.length;
    },
  };

  const root = Spec.describe('MySample', (e) => {
    e.it('init', async (e) => {
      const ctx = Spec.ctx(e);
      const el = <div>Hello</div>;
      ctx.component.size(300, 140).display('flex').backgroundColor(1).render(el);
      log.push(e.id, 'init');
    });

    e.it('foo-1', async (e) => {
      const ctx = Spec.ctx(e);
      const el = <div>{`Hello Foo!`}</div>;
      ctx.debug.TEMP(el);
      log.push(e.id, 'foo-1');
    });

    e.it('foo-2', async (e) => {
      const ctx = Spec.ctx(e);
      log.push(e.id, 'foo-2');
    });
  });

  return { root, log };
}

export const root = Wrapper().root;
export default root;
