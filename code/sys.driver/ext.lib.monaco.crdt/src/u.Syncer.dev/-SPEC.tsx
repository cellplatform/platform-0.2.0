import { Color, CrdtInfo, css, Dev, Immutable, Json, Monaco, Pkg, rx, TestDb } from '../test.ui';
import { setupStore, type D } from './-SPEC.store';
import { Doc, type t } from './common';

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
  const State = {
    debug: Immutable.clonerRef<T>(Json.parse<T>(local.debug, initial)),
  } as const;

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
    const debug$ = State.debug.events().changed$;
    rx.merge(doc$, debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.debug = Json.stringify(State.debug.current);
      });
    rx.merge(doc$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    const handleReady = (debugLabel: string, monaco: t.Monaco, editor: t.MonacoCodeEditor) => {
      console.info(`⚡️ MonacoEditor.onReady (${debugLabel})`);
      const Syncer = Monaco.Crdt.Syncer;
      Syncer.listen(monaco, editor, lens, ['code'], {
        debugLabel,
        strategy: () => State.debug.current.strategy,
      });
    };

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const theme = Color.theme(e.state.theme);
        Dev.Theme.background(ctx, theme, 1);

        if (e.state.reload) {
          return (
            <TestDb.DevReload onCloseClick={() => State.debug.change((d) => (d.reload = false))} />
          );
        } else {
          const border = `solid 1px ${Color.alpha(theme.fg, 0.1)}`;
          const styles = {
            base: css({ display: 'grid', gridTemplateRows: '1fr 1fr', rowGap: '50px' }),
            top: css({ borderBottom: border }),
            bottom: css({ borderTop: border }),
          };

          return (
            <div {...styles.base}>
              <Monaco.Editor
                focusOnLoad={true}
                language={'markdown'}
                theme={theme.name}
                style={styles.top}
                onReady={(e) => handleReady('top', e.monaco, e.editor)}
              />
              <Monaco.Editor
                language={'markdown'}
                theme={theme.name}
                style={styles.bottom}
                onReady={(e) => handleReady('bottom', e.monaco, e.editor)}
              />
            </div>
          );
        }
      });
  });

  e.it('ui:debug', (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.row((e) => {
      return (
        <CrdtInfo
          fields={['Module', 'Component', 'Repo', 'Doc', 'Doc.URI']}
          data={{
            component: { name, label: 'Syncer: UI ↔︎ CRDT' },
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
      Dev.Theme.immutable(dev, State.debug);
      dev.hr(-1, 5);
      const strategy = (strategy: t.UpdateTextStrategy) => {
        const current = () => State.debug.current.strategy;
        dev.button((btn) => {
          btn
            .label(`strategy: "${strategy}"`)
            .right(() => (current() === strategy ? '←' : ''))
            .onClick(() => State.debug.change((d) => (d.strategy = strategy)));
        });
      };
      strategy('Splice');
      strategy('Overwrite');
    });

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
