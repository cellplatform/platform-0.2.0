import { DevDelete } from 'sys.data.indexeddb';
import { Dev } from '.';

type T = {};

/**
 * Spec
 */
const name = 'TestDb';
export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.debug.width(0);
    ctx.subject.backgroundColor(1).render<T>((e) => {
      return <DevDelete />;
    });
  });
});
