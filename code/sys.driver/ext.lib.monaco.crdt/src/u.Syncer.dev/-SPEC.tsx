import { Color, CrdtInfo, Dev, Immutable, Json, Monaco, Pkg, rx, TestDb } from '../test.ui';
import { setupStore, type D } from './-SPEC.store';
import { Doc, type t } from './common';
import { Layout } from './ui.Layout';

type T = {
  reload?: boolean;
  theme?: t.CommonTheme;
  strategy?: t.UpdateTextStrategy;
};
const initial: T = { theme: 'Dark', strategy: 'Splice' };

/**
 * Spec
 */
const name = `${Pkg.name}.syncer`;
export default Dev.describe(name, async (e) => {
  type LocalStore = { debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({ debug: undefined });
  const State = Immutable.clonerRef<T>(Json.parse<T>(local.debug, initial));

  const { db, store, index, doc } = await setupStore(`spec:${name}`);
  const lens = Doc.lens<D, t.SampleDoc>(doc, ['sample'], (d) => (d.sample = {}));

  console.group('🌳 state (syncer sample)');
  console.info(`db: "${db.name}"`);
  console.info('store', store);
  console.info('index', index);
  console.groupEnd();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);

    const doc$ = doc.events().changed$;
    const debug$ = State.events().changed$;
    rx.merge(doc$, debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.debug = Json.stringify(State.current);
      });
    rx.merge(doc$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    const handleReady = (debugLabel: string, e: t.MonacoEditorReadyHandlerArgs) => {
      console.info(`⚡️ MonacoEditor.onReady (${debugLabel})`);
      const Syncer = Monaco.Crdt.Syncer;

      Syncer.listen(e.monaco, e.editor, lens, ['code'], {
        debugLabel,
        strategy: () => State.current.strategy,
      });
    };

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>(() => {
        const state = State.current;
        const theme = Color.theme(state.theme);
        Dev.Theme.background(ctx, theme, 1);

        if (state.reload) {
          const onClose = () => State.change((d) => (d.reload = false));
          return <TestDb.DevReload onCloseClick={onClose} />;
        } else {
          const elTop = (
            <Monaco.Editor
              language={'markdown'}
              theme={theme.name}
              onReady={(e) => handleReady('top', e)}
              focusOnLoad={true}
            />
          );

          const elBottom = (
            <Monaco.Editor
              language={'markdown'}
              theme={theme.name}
              onReady={(e) => handleReady('bottom', e)}
            />
          );

          return <Layout top={elTop} bottom={elBottom} theme={theme.name} />;
        }
      });
  });

  e.it('ui:debug', (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.row((e) => {
      return (
        <CrdtInfo
          fields={['Repo', 'Doc', 'Doc.URI']}
          data={{
            repo: { store, index },
            document: {
              ref: doc,
              uri: { head: true },
              object: { expand: { level: 3 } },
            },
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section((dev) => {
      Dev.Theme.immutable(dev, State);
      dev.hr(-1, 5);
      const strategy = (strategy: t.UpdateTextStrategy) => {
        const current = () => State.current.strategy;
        dev.button((btn) => {
          btn
            .label(`strategy: "${strategy}"`)
            .right(() => (current() === strategy ? '←' : ''))
            .onClick(() => State.change((d) => (d.strategy = strategy)));
        });
      };
      strategy('Splice');
      strategy('Overwrite');
    });

    dev.hr(5, 20);
    dev.TODO('"Splice" replacement not stable');
    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.button('reload', (e) => location.reload());
      dev.hr(-1, 5);

      dev.button('change: sample.code', (e) => {
        const count = doc.current.count;
        const text = `const msg = "hello world 👋";\nconst count = ${count};\n`;
        lens.change((d) => (d.code = text));
      });

      dev.button('change: sample.name', (e) => {
        doc.change((d) => d.count++);
        const count = doc.current.count;
        lens.change((d) => (d.name = `name.${count}`));
      });

      dev.hr(-1, 5);

      dev.button((btn) => {
        btn
          .label(`change: increment count`)
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

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        ['crdt.doc']: doc.toObject(),
        ['code']: doc.toObject().sample?.code,
      };
      return <Dev.Object name={name} data={data} expand={{ level: 1, paths: ['$', '$.code'] }} />;
    });
  });
});
