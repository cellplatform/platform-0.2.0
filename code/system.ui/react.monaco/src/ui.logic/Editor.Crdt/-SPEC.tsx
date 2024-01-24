import { css, Dev, type t, TestDb, MonacoEditor, Doc } from '../../test.ui';
import { setupStore } from './-SPEC.store';
import { Info as CrdtInfo } from 'ext.lib.automerge';
import { EditorCrdt } from '.';

type T = { reload?: boolean };
const initial: T = {};

/**
 * Spec
 */
const name = 'Editor.Crdt';

export default Dev.describe(name, async (e) => {
  const { db, store, index, doc } = await setupStore(`spec:${name}`);
  let monaco: t.Monaco;
  let editor: t.MonacoCodeEditor;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    const resetReloadClose = () => state.change((d) => (d.reload = false));
    await state.change((d) => {});
    doc.events().changed$.subscribe((e) => dev.redraw('debug'));

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload) {
          return <TestDb.DevReload onCloseClick={resetReloadClose} />;
        } else {
          return (
            <MonacoEditor
              focusOnLoad={true}
              onReady={(e) => {
                console.log('⚡️ MonacoEditor.onReady', e);
                monaco = e.monaco;
                editor = e.editor;
                const state = Doc.lens(doc, (d) => d.sample || (d.sample = {}));
                EditorCrdt.syncer({ monaco, editor, state });
              }}
            />
          );
        }
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <CrdtInfo
          fields={['Module', 'Component', 'Repo']}
          data={{ component: { name }, repo: { store, index } }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button([`delete db: "${db.name}"`, '💥'], async (e) => {
        await e.change((d) => (d.reload = true));
        await TestDb.Spec.deleteDatabase();
      });

      dev.button('tmp', (e) => {
        doc.change((d) => d.count++);
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        doc: doc.toObject(),
      };
      return <Dev.Object name={name} data={data} expand={2} />;
    });
  });
});
