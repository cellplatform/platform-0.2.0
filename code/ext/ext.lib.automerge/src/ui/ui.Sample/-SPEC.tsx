import { Dev } from '../../test.ui';
import { type t, WebStore, A } from './common';

import { RepoContext } from '@automerge/automerge-repo-react-hooks';
import { Sample } from './-SPEC.Sample';

type T = { docUri?: t.DocUri };
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample';

export default Dev.describe(name, async (e) => {
  type LocalStore = { docUri?: t.DocUri };
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.automerge.Sample');
  const local = localstore.object({ docUri: undefined });

  const store = WebStore.init();
  const generator = store.doc.factory<t.SampleDoc>((d) => (d.count = new A.Counter()));

  let doc: t.DocRefHandle<t.SampleDoc>;
  const initDoc = async (state: t.DevCtxState<T>) => {
    doc = await generator(local.docUri);
    state.change((d) => (local.docUri = d.docUri = doc.uri));
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.docUri = local.docUri;
    });

    await initDoc(state);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([350, 300])
      .display('grid')
      .render<T>((e) => {
        return (
          <RepoContext.Provider value={store.repo}>
            <Sample docUri={doc.uri} />
          </RepoContext.Provider>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO();

    dev.button('new doc', async (e) => {
      local.docUri = undefined;
      await initDoc(state);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
