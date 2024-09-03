import { Color, CrdtInfo, Dev, Immutable, Json, Pkg, SampleCrdt, slug } from '../../test.ui';
import { SampleEditor, type SampleEditorProps } from './-ui.Editor';
import { Layout } from './-ui.Layout';
import { Doc, ObjectPath, rx, type t } from './common';

type D = {
  theme?: t.CommonTheme;
  docuri?: string;
  objectOpen?: boolean;
  useLens?: boolean;
  useTopCommand?: boolean;
  render?: boolean;
};
const initial: D = {
  theme: 'Dark',
  render: true,
  useTopCommand: false,
};

type ObjectWithAllKeys<T extends string, V = any> = { [K in T]: V };
type DebugLabel = 'top' | 'bottom';
type Identities = ObjectWithAllKeys<DebugLabel, string>;
type SyncListeners = ObjectWithAllKeys<DebugLabel, t.SyncListener | undefined>;

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
  const identities: Identities = { top: `foo:${slug()}`, bottom: `bar:${slug()}` };
  const syncers: SyncListeners = { top: undefined, bottom: undefined };

  let lens: t.Lens | undefined;
  const getLens = () => {
    if (!doc) return;
    return lens || (lens = Doc.lens(doc, ['mylens']));
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);

    const debug$ = State.events().changed$;
    rx.merge(debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => (local.state = Json.stringify(State.current)));
    rx.merge(debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    const sample = SampleCrdt.dev(db.repo.store, State);
    doc = await sample.get();

    const getBackgroundColor = () => {
      const theme = Color.theme(State.current.theme);
      return Color.darken(theme.bg, 3);
    };

    ctx.debug.width(340);
    ctx.subject
      .backgroundColor(getBackgroundColor())
      .size('fill')
      .display('grid')
      .render<D>(() => {
        const state = State.current;
        const backgroundColor = getBackgroundColor();
        const theme = Color.theme(state.theme);
        Dev.Theme.background(ctx, theme, 1);
        ctx.host.backgroundColor(backgroundColor);

        if (!(state.render ?? true)) return null;

        const editor = (debugLabel: DebugLabel, props?: SampleEditorProps) => {
          return (
            <SampleEditor
              identity={identities[debugLabel]}
              debugLabel={debugLabel}
              lens={lensProp}
              enabled={!!doc}
              theme={theme.name}
              {...props}
              onReady={(e) => {
                console.info(`⚡️ SampleEditor("${e.identity}").onReady`, e);
                syncers[debugLabel] = e.syncer;
                e.syncer.dispose$.subscribe(() => {
                  console.info(`⚡️ e.syncer("${e.identity}") → (💥) disposed`, e);
                });
              }}
            />
          );
        };

        const lensProp = state.useLens ? getLens() : doc;
        const top = editor('top', { focusOnLoad: true });
        const bottom = editor('bottom');
        return (
          <Layout
            lens={lensProp}
            top={top}
            bottom={bottom}
            theme={theme.name}
            style={{ backgroundColor }}
          />
        );
      });
  });

  e.it('ui:debug', (e) => {
    const dev = Dev.tools<D>(e, initial);
    const sample = SampleCrdt.dev(db.repo.store, State);

    dev.row((e) => {
      const state = State.current;
      return (
        <CrdtInfo.Stateful
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          repos={{ main: db.repo }}
          data={{
            repo: 'main',
            document: {
              uri: doc?.uri,
              address: { head: true },
              object: { visible: state.objectOpen, expand: { level: 2 } },
            },
          }}
          onDocToggleClick={(e) => State.change((d) => Dev.toggle(d, 'objectOpen'))}
        />
      );
    });

    /**
     * TODO 🐷
     */
    dev.hr(5, 20).TODO('"Splice" replacement not stable').hr(5, 20);

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
          .onClick(async () => {
            await sample.delete();
            doc = undefined;
            lens = undefined;
          });
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

      dev.boolean((btn) => {
        const state = State;
        const current = () => !!state.current.useLens;
        btn
          .label(() => `useLens`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'useLens')));
      });

      dev.boolean((btn) => {
        const state = State;
        const current = () => !!(state.current.render ?? true);
        btn
          .label(() => `render`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'render')));
      });
    });

    dev.hr(5, 20);

    dev.section('Commands', (dev) => {
      const Get = {
        get syncer() {
          return State.current.useTopCommand ? syncers.top! : syncers.bottom!;
        },
        get cmd() {
          return Get.syncer.cmd;
        },
        get identity() {
          return Get.syncer.identity;
        },
      };

      dev.boolean((btn) => {
        const current = () => !!State.current.useTopCommand;
        btn
          .label(() => `use <Cmd> from "${current() ? 'top' : 'bottom'}" editor`)
          .value(() => current())
          .onClick(() => State.change((d) => Dev.toggle(d, 'useTopCommand')));
      });

      dev.hr(-1, 5);

      dev.button('ping', async () => {
        const { identity, cmd } = Get;
        const res = await cmd.ping({ identity }).promise();
        console.info(`ping:`, res);
      });

      dev.button('purge', async () => {
        const { identity, cmd } = Get;
        const res = await cmd.purge({ identity }).promise();
        console.info(`purge:`, Doc.toObject(res?.result));
      });

      dev.hr(-1, 5);

      const update = (params: t.SyncCmdUpdate) => {
        const { identity, cmd } = Get;
        cmd.update.editor({ identity, ...params });
      };
      dev.button('update.editor: selections', () => update({ selections: true }));
      dev.button('update.editor: text', () => update({ text: true }));

      dev.hr(-1, 5);
    });
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<D>(e, initial);
    dev.footer.border(-0.1).render<D>((e) => {
      const debug = State.current;
      const data = { debug };
      return <Dev.Object name={name} data={data} expand={{ level: 1 }} fontSize={11} />;
    });
  });
});
