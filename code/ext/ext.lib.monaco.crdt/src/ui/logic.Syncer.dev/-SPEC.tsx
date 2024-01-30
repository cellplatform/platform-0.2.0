import { CrdtInfo, Dev, Monaco, Pkg, TestDb } from '../../test.ui';
import { setupStore, type D } from './-SPEC.store';
import { Doc, type t } from './common';

type T = { reload?: boolean };
const initial: T = {};

/**
 * Spec
 */
const name = `${Pkg.name}.syncer`;
export default Dev.describe(name, async (e) => {
  const { db, store, index, doc } = await setupStore(`spec:${name}`);
  let monaco: t.Monaco;
  let editor: t.MonacoCodeEditor;

  console.group('🌳 state');
  console.log(`db: "${db.name}"`);
  console.log('store', store);
  console.log('index', index);
  console.groupEnd();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    doc.events().changed$.subscribe(() => dev.redraw('debug'));

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload) {
          return <TestDb.DevReload onCloseClick={() => state.change((d) => (d.reload = false))} />;
        } else {
          return (
            <Monaco.Editor
              focusOnLoad={true}
              onReady={(e) => {
                monaco = e.monaco;
                editor = e.editor;

                const lens = Doc.lens<D, t.SampleDoc>(doc, ['sample'], (d) => (d.sample = {}));
                lens.change((d) => (d.code = d.code || ''));

                console.info('⚡️ MonacoEditor.onReady');
                console.info('|- event', e);
                console.info('|- lens', lens);
                // console.groupEnd();

                Monaco.Crdt.Syncer.listen<t.SampleDoc>(monaco, editor, lens, ['code']);
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
          fields={['Module', 'Component', 'Repo', 'Document']}
          data={{
            component: { name, label: 'Syncer: UI ↔︎ CRDT' },
            repo: { store, index },
            document: { doc, object: { expand: { level: 3 } } },
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);

      dev.button('doc.change: (code sample)', (e) => {
        doc.change((d) => {
          // d.count++;
          const sample = d.sample || (d.sample = { code: '' });
          sample.code = `const msg = "hello world 👋";\nconst count = ${doc.current.count};`;
        });
      });

      dev.button((btn) => {
        btn
          .label(`doc.change: (increment count)`)
          .right((e) => `${doc.current.count} + 1`)
          .onClick((e) => doc.change((d) => d.count++));
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
        ['crdt.doc']: doc.toObject(),
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
