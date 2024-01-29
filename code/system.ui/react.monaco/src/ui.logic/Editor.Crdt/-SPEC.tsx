import { Info as CrdtInfo } from 'ext.lib.automerge';
import { EditorCrdt } from '.';
import { Dev, Doc, MonacoEditor, TestDb, type t } from '../../test.ui';
import { setupStore, type D } from './-SPEC.store';

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

    const events = { doc: doc.events() } as const;
    events.doc.changed$.subscribe((e) => {
      dev.redraw('debug');

      console.group('🌳 ');
      e.patches.forEach((patch) => {
        console.log('patch', patch, patch.path);
      });
      console.groupEnd();
    });

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
                const lens = Doc.lens<D, t.CodeDoc>(doc, ['sample'], (d) => (d.sample = {}));
                // EditorCrdt.syncer({ monaco, editor, lens });

                // const m: t.Lens<t.CodeDoc> = lens;
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
          data={{
            component: { name, label: 'Syncer: UI ↔︎ Data' },
            repo: { store, index },
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('tmp', (e) => {
        doc.change((d) => {
          d.count++;
          const sample = d.sample || (d.sample = { code: '' });

          sample.code = 'hello world 👋\n';
        });
      });

      dev.hr(-1, 5);

      dev.button([`delete db: "${db.name}"`, '💥'], async (e) => {
        await e.change((d) => (d.reload = true));
        await TestDb.Spec.deleteDatabase();
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
