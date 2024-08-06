import { Color, CrdtInfo, Dev, Immutable, Json, Pkg, SampleCrdt, slug } from '../../test.ui';
import { SampleEditor, type SampleEditorProps } from './-ui.Editor';
import { Layout } from './-ui.Layout';
import { Doc, ObjectPath, rx, type t } from './common';

type D = {
  theme?: t.CommonTheme;
  docuri?: string;
  objectOpen?: boolean;
  useLens?: boolean;
  cmdTop?: boolean;
};
const initial: D = {
  theme: 'Dark',
  cmdTop: false,
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
  let lens: t.Lens | undefined;
  const db = await SampleCrdt.init({ broadcastAdapter: true });
  const identities: Identities = { top: `${slug()}`, bottom: `${slug()}` };
  const syncers: SyncListeners = { top: undefined, bottom: undefined };

  const getLens = () => {
    if (!doc) return;
    if (lens) return lens;
    const path = ['mylens'];
    return (lens = Doc.lens(doc, path, (d) => ObjectPath.Mutate.ensure(d, path, {})));
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

    ctx.debug.width(330);
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
                console.info(`⚡️ SampleEditor.onReady`, e);
                syncers[debugLabel] = e.syncer;
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
        <CrdtInfo
          stateful={true}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: db.repo,
            document: {
              ref: doc,
              uri: { head: true },
              object: {
                expand: { level: 2 },
                visible: state.objectOpen,
                onToggleClick: (e) => State.change((d) => Dev.toggle(d, 'objectOpen')),
              },
            },
          }}
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
      dev.boolean((btn) => {
        const state = State;
        const current = () => !!state.current.useLens;
        btn
          .label(() => `useLens`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'useLens')));
      });
    });

    dev.hr(5, 20);

    dev.section('Commands', (dev) => {
      const Get = {
        get syncer() {
          return State.current.cmdTop ? syncers.top! : syncers.bottom!;
        },
        get cmd() {
          return Get.syncer.cmd;
        },
        get identity() {
          return Get.syncer.identity;
        },
      };

      dev.boolean((btn) => {
        const current = () => !!State.current.cmdTop;
        btn
          .label(() => `target ${current() ? 'top' : 'bottom'} editor`)
          .value(() => current())
          .onClick(() => State.change((d) => Dev.toggle(d, 'cmdTop')));
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

      dev.button('update: carets', () => {
        const { identity, cmd } = Get;
        cmd.update({ identity, carets: true });
      });
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
