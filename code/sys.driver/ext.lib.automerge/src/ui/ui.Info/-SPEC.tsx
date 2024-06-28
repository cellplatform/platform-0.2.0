import { DEFAULTS, Info } from '.';
import {
  Color,
  Dev,
  DevReload,
  Doc,
  Pkg,
  TestDb,
  Value,
  css,
  rx,
  sampleCrdt,
  type t,
} from '../../test.ui';
import { RepoList } from '../ui.RepoList';

type P = t.InfoProps;
type D = {
  reload?: boolean;
  dataUris?: boolean;
  dataHistoryDesc?: boolean;
  dataHistoryDetail?: t.HashString;
  dataDocLens?: boolean;
  dataDocArray?: boolean;
  dataDocIconClickHandler?: boolean;
};
type T = {
  props: t.InfoProps;
  docuri?: t.UriString;
  debug: D;
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = Info.displayName ?? 'Unknown';
export default Dev.describe(name, async (e) => {
  const db = await sampleCrdt();
  let model: t.RepoListModel;

  type LocalStore = D & Pick<P, 'fields' | 'theme' | 'stateful'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    stateful: DEFAULTS.stateful,
    fields: DEFAULTS.fields.default,
    dataHistoryDesc: DEFAULTS.history.list.sort === 'desc',
    dataUris: true,
    dataDocLens: false,
    dataDocArray: false,
    dataDocIconClickHandler: true,
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

      d.debug.dataHistoryDesc = local.dataHistoryDesc;
      d.debug.dataUris = local.dataUris;
      d.debug.dataDocLens = local.dataDocLens;
      d.debug.dataDocArray = local.dataDocArray;
      d.debug.dataDocIconClickHandler = local.dataDocIconClickHandler;
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
        const docuri = e.state.docuri;
        const { store, index } = db;
        const doc = fields.includes('Doc') ? await store.doc.get(docuri) : undefined;

        const document: t.InfoDataDoc = {
          // label: 'Foo',
          ref: debug.dataUris ? doc?.uri : doc,
          object: {
            // name: 'foobar',
            // visible: false,
            lens: debug.dataDocLens ? ['child'] : undefined,
            expand: { level: 2 },
            beforeRender(mutate: any) {
              // mutate['foo'] = 123;
            },
            onToggleClick: debug.dataDocIconClickHandler
              ? (e) => console.info('⚡️ document.object.onToggleClick', e)
              : undefined,
          },
          uri: {
            // prefix: 'foo:::',
            // prefix: null,
            head: true,
          },
          history: {
            // label: 'Foo',
            list: {
              sort: debug.dataHistoryDesc ? 'desc' : 'asc',
              showDetailFor: debug.dataHistoryDetail,
            },
            item: {
              onClick(e) {
                console.info('⚡️ history.item.onClick', e);
                state.change((d) => {
                  const detail = d.debug.dataHistoryDetail === e.hash ? undefined : e.hash;
                  d.debug.dataHistoryDetail = detail;
                });
              },
            },
          },
        };

        const data: t.InfoData = {
          repo: { store, index },
          document: !debug.dataDocArray
            ? document
            : [
                { ...document, label: 'My One' },
                { ...document, label: 'My Two' },
              ],
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
            onClick={(e) => {
              setFields(dev, e.next<t.InfoField>(DEFAULTS.fields.default));
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
        'Doc.History',
        'Doc.History.Genesis',
        'Doc.History.List',
        'Doc.History.List.Detail',
        'Doc.History.List.NavPaging',
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
        const value = (state: T) => !!state.debug.dataHistoryDesc;
        btn
          .label((e) => `data.history.list.sort: "${value(e.state) ? 'desc' : 'asc'}"`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.dataHistoryDesc = Dev.toggle(d.debug, 'dataHistoryDesc')));
          });
      });
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.dataUris;
        btn
          .label((e) => `data.document.doc ← URI string`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.dataUris = Dev.toggle(d.debug, 'dataUris'))));
      });
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.dataDocLens;
        btn
          .label((e) => `data.document.lens`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.dataDocLens = Dev.toggle(d.debug, 'dataDocLens'))),
          );
      });
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.dataDocArray;
        btn
          .label((e) => `data.document ← [array]`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.dataDocArray = Dev.toggle(d.debug, 'dataDocArray'))),
          );
      });
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.dataDocIconClickHandler;
        btn
          .label((e) => `data.document.icon.onClick`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => {
              local.dataDocIconClickHandler = Dev.toggle(d.debug, 'dataDocIconClickHandler');
            }),
          );
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
      dev.button(['increment child', 'count + 1'], async (e) => {
        type T = { child?: { count?: number } };
        const doc = await db.docAtIndex<T>(0);
        doc?.change((d) => {
          const child = d.child || (d.child = { count: 0 });
          child.count = (child.count ?? 0) + 1;
        });
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
      dev.button(['delete doc', '💥'], async (e) => {
        const doc = await db.docAtIndex(0);
        if (doc) await db.store.doc.delete(doc.uri);
        dev.redraw();
      });
      dev.hr(-1, 5);
      dev.button([`delete database: "${db.storage.name}"`, '💥'], async (e) => {
        await e.state.change((d) => (d.debug.reload = true));
        await TestDb.Spec.deleteDatabase();
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
