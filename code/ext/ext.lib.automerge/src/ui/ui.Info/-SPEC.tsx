import { Info } from '.';
import { Doc, Color, Dev, DevReload, Pkg, TestDb, Value, css, rx, type t } from '../../test.ui';
import { RepoList } from '../../ui/ui.RepoList';
import { sampleCrdt } from './-SPEC.crdt';

type P = t.InfoProps;
type T = {
  props: t.InfoProps;
  docuri?: t.UriString;
  debug: {
    reload?: boolean;
    historyDesc?: boolean;
    historyDetail?: t.HashString;
    useUris?: boolean;
  };
};
const initial: T = { props: {}, debug: {} };
const DEFAULTS = Info.DEFAULTS;

/**
 * Spec
 */
const name = Info.displayName ?? 'Unknown';

export default Dev.describe(name, async (e) => {
  const db = await sampleCrdt();
  let model: t.RepoListModel;

  type LocalStore = T['debug'] & Pick<P, 'fields' | 'theme' | 'stateful'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    stateful: DEFAULTS.stateful,
    fields: DEFAULTS.fields.default,
    historyDesc: DEFAULTS.history.list.sort === 'desc',
    useUris: true,
  });

  const resetState$ = rx.subject();
  const setFields = async (dev: t.DevTools<T>, fields?: (t.InfoField | undefined)[]) => {
    local.fields = fields?.length === 0 ? undefined : fields;
    await dev.change((d) => (d.props.fields = fields));
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.fields = local.fields;
      d.props.margin = 10;
      d.props.stateful = local.stateful;

      d.debug.historyDesc = local.historyDesc;
      d.debug.useUris = local.useUris;
    });

    /**
     * TODO 🐷
     * - BUG FIX: focus state on <RepoList>
     * - Have <Info> load from the selected "doc:uri"
     */
    model = await RepoList.model(db.store, {
      behaviors: ['Copyable', 'Deletable'],
      onActiveChanged: (e) => {
        console.info(`⚡️ onActiveChanged`, e);
        state.change((d) => (d.docuri = e.item.uri));
      },
    });

    ctx.debug.width(330);
    ctx.subject
      .size([320, null])
      .display('grid')
      .render<T>(async (e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(ctx, props.theme);

        if (debug.reload) return <DevReload theme={props.theme} />;

        const fields = props.fields ?? [];
        const doc = fields.includes('Doc') ? await db.docAtIndex(0) : undefined;
        const useUris = debug.useUris;

        const { store, index } = db;
        const data: t.InfoData = {
          repo: { store, index },
          document: {
            // label: 'Foo',
            doc: useUris ? doc?.uri : doc,
            object: { name: 'foobar', expand: { level: 2 } },
            icon: { onClick: (e) => console.info('⚡️ document.icon.onClick', e) },
            uri: {
              // prefix: 'foo:::',
              // prefix: null,
            },
          },
          history: {
            // label: 'Foo',
            doc: useUris ? doc?.uri : doc,
            list: {
              sort: debug.historyDesc ? 'desc' : 'asc',
              showDetailFor: debug.historyDetail,
            },
            item: {
              onClick(e) {
                console.info('⚡️ history.item.onClick', e);
                state.change((d) => {
                  d.debug.historyDetail = d.debug.historyDetail === e.hash ? undefined : e.hash;
                });
              },
            },
          },
          visible: {
            onToggle(e) {
              console.info('⚡️ visible.onToggle', e);
            },
          },
        };

        return (
          <Info
            {...props}
            style={{ minHeight: 300 }}
            data={data}
            fields={props.fields}
            resetState$={resetState$}
            onStateChange={(e) => {
              console.info('⚡️ onStateChange', e);
              setFields(dev, e.fields);
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
            all={DEFAULTS.fields.all}
            selected={props.fields}
            onClick={(ev) => {
              const fields =
                ev.action === 'Reset:Default'
                  ? DEFAULTS.fields.default
                  : (ev.next as t.InfoField[]);
              setFields(dev, fields);
              resetState$.next();
            }}
          />
        );
      });

      dev.title('Common States');

      const config = (label: string, fields: t.InfoField[]) => {
        dev.button(label, async (e) => {
          await setFields(dev, fields);
          resetState$.next();
        });
      };

      dev.button('(prepend): Visible', (e) => {
        const fields = e.state.current.props.fields ?? [];
        if (!fields.includes('Visible')) setFields(dev, ['Visible', ...fields]);
        resetState$.next();
      });
      dev.hr(-1, 5);
      config('Repo / Doc', ['Repo', 'Doc', 'Doc.URI']);
      config('Repo / Doc / Object', ['Repo', 'Doc', 'Doc.URI', 'Doc.Object']);
      config('Repo / Doc / Head', ['Repo', 'Doc', 'Doc.URI', 'Doc.Head']);
      config('Repo / Doc / History ( + List )', [
        'Repo',
        'Doc',
        'Doc.URI',
        'History',
        'History.Genesis',
        'History.List',
        'History.List.Detail',
        'History.List.NavPaging',
      ]);
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.stateful;
        btn
          .label((e) => `stateful`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.stateful = Dev.toggle(d.props, 'stateful'))));
      });

      Dev.Theme.switcher(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );
    });

    dev.hr(5, 20);

    dev.section('Data', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.historyDesc;
        btn
          .label((e) => `history.list.sort: "${value(e.state) ? 'desc' : 'asc'}"`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.historyDesc = Dev.toggle(d.debug, 'historyDesc')));
          });
      });
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.useUris;
        btn
          .label((e) => `pass doc as URI (string)`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.useUris = Dev.toggle(d.debug, 'useUris'))));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.button('reset state', (e) => resetState$.next());
      dev.hr(-1, 5);
      dev.button('create doc', async (e) => {
        await db.store.doc.getOrCreate((d) => null);
        dev.redraw();
      });
      dev.button(['💥 delete doc', ''], async (e) => {
        const doc = await db.docAtIndex(0);
        if (doc) await db.store.doc.delete(doc.uri);
        dev.redraw();
      });
      dev.hr(-1, 5);
      dev.button([`💥 delete database: "${db.storage.name}"`, '🤯'], async (e) => {
        await e.state.change((d) => (d.debug.reload = true));
        await TestDb.Spec.deleteDatabase();
      });
      dev.hr(-1, 5);
      dev.button(['write sample BLOB', '[Uint8Array]'], async (e) => {
        type T = { binary?: Uint8Array };
        const doc = await db.docAtIndex<T>(0);
        const length = Value.random(5000, 15000);
        const binary = new Uint8Array(new Array(length).fill(0));
        doc?.change((d) => (d.binary = binary));
        dev.redraw();
      });
      dev.button(['increment', 'count + 1'], async (e) => {
        type T = { count?: number };
        const doc = await db.docAtIndex<T>(0);
        doc?.change((d) => (d.count = (d.count ?? 0) + 1));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .padding(0)
      .render<T>(async (e) => {
        const { props, debug } = e.state;
        const crdt = (await db.docAtIndex(0))?.current;
        const data = {
          docuri: Doc.Uri.id(e.state.docuri, { shorten: 5 }),
          props,
          debug,
          'crdt:storage:db': db.storage.name,
          'crdt:doc': crdt,
        };

        const styles = {
          base: css({ position: 'relative' }),
          object: css({ padding: 10 }),
          list: css({ border: `solid 1px ${Color.alpha(Color.DARK, 0.15)}` }),
        };

        const elObject = (
          <div {...styles.object}>
            <Dev.Object name={name} data={data} expand={1} fontSize={11} />
          </div>
        );

        const elList = (
          <div {...styles.list}>
            <RepoList model={model} onReady={(e) => e.ref.select(0)} />
          </div>
        );

        return (
          <div {...styles.base}>
            {elObject}
            {elList}
          </div>
        );
      });
  });
});
