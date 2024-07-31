import {
  Color,
  CrdtInfo,
  Dev,
  Doc,
  Immutable,
  Json,
  Pkg,
  rx,
  SampleCrdt,
  TestDb,
} from '../test.ui';
import { type t } from './common';
import { SampleEditor, type SampleEditorProps } from './ui.Editor';
import { Layout } from './ui.Layout';

type D = {
  reload?: boolean;
  docuri?: string;
  theme?: t.CommonTheme;
  strategy?: t.UpdateTextStrategy;
  docObjectOpen?: boolean;
};
const initial: D = {
  theme: 'Dark',
  strategy: 'Splice',
};

/**
 * Spec
 */
const name = `${Pkg.name}.syncer`;

export default Dev.describe(name, async (e) => {
  type LocalStore = { state?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({ state: undefined });
  const State = Immutable.clonerRef<D>(Json.parse<D>(local.state, initial));

  let doc: t.Doc | undefined;
  const db = await SampleCrdt.init({ broadcastAdapter: true });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const sample = SampleCrdt.dev(db.repo.store, State);

    doc = await sample.get();

    const debug$ = State.events().changed$;
    rx.merge(debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => (local.state = Json.stringify(State.current)));
    rx.merge(debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<D>(() => {
        const state = State.current;
        const theme = Color.theme(state.theme);
        Dev.Theme.background(ctx, theme, 1);

        if (state.reload) {
          const onClose = () => State.change((d) => (d.reload = false));
          return <TestDb.DevReload onCloseClick={onClose} />;
        } else {
          const editor = (debugLabel: string, props?: SampleEditorProps) => {
            return (
              <SampleEditor
                debugLabel={debugLabel}
                lens={doc}
                enabled={!!doc}
                theme={theme.name}
                {...props}
              />
            );
          };

          const top = editor('top', { focusOnLoad: true });
          const bottom = editor('bottom');
          return <Layout top={top} bottom={bottom} theme={theme.name} />;
        }
      });
  });

  e.it('ui:debug', (e) => {
    const dev = Dev.tools<D>(e, initial);
    const sample = SampleCrdt.dev(db.repo.store, State);

    dev.row((e) => {
      const state = State.current;
      return (
        <CrdtInfo
          stateful={true}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: db.repo,
            document: {
              ref: doc,
              uri: { head: true },
              object: {
                expand: { level: 3 },
                visible: state.docObjectOpen,
                onToggleClick: (e) => State.change((d) => Dev.toggle(d, 'docObjectOpen')),
              },
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

    dev.section('Sample State', (dev) => {
      dev.button((btn) => {
        btn
          .label(`create`)
          .enabled(() => !doc)
          .onClick(async () => (doc = await sample.get()));
      });
      dev.button((btn) => {
        btn
          .label(`delete`)
          .right(() => (doc ? `crdt:${Doc.Uri.shorten(doc.uri)}` : ''))
          .enabled(() => !!doc)
          .onClick(async () => (doc = await sample.delete()));
      });

      dev.hr(-1, 5);

      dev.button((btn) => {
        type T = { count: number };
        const getCount = () => doc?.current?.count ?? 0;
        btn
          .label(`increment`)
          .right(() => `count: ${getCount()} + 1`)
          .enabled(() => !!doc)
          .onClick(() => {
            doc?.change((d) => (d.count = ((d as T).count || 0) + 1));
            dev.redraw('debug');
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
    });
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<D>(e, initial);
    dev.footer.border(-0.1).render<D>((e) => {
      const debug = State.current;
      const data = { debug };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
