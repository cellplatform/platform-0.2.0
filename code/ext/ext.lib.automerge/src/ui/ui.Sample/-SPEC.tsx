import { Repo } from '@automerge/automerge-repo';

import { TestDb, Dev } from '../../test.ui';
import { A, WebStore, type t } from './common';
import { Sample } from './ui.Sample';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample';

export default Dev.describe(name, async (e) => {
  const storage = TestDb.Spec.name;
  const store = WebStore.init({ storage });
  const generator = store.doc.factory<t.SampleDoc>((d) => (d.count = 0));

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([350, 150])
      .display('grid')
      .render<T>((e) => {
        return <store.Provider>{/* <Sample docUri={doc?.uri} /> */}</store.Provider>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO();

    dev.button('tmp', async (e) => {
      // const doc = await generator();
      // console.log('doc.toObject()', doc.toObject());
      // Repo.
      // const doc = store.repo.find('automerge:123456');
    });

    dev.hr(5, 20);

    dev.button('delete test/spec databases', async (e) => {
      await TestDb.deleteDatabases();
      await TestDb.Spec.deleteDatabases();
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { storage };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
