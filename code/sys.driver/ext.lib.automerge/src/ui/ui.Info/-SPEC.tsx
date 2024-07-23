import { DEFAULTS, Info } from '.';
import { Dev, DevReload, Doc, Pkg, rx, SampleCrdt, Value, type t } from '../../test.ui';

type O = Record<string, unknown>;
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
  docuri?: t.UriString;
  props: t.InfoProps;
  debug: D;
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = Info.displayName ?? 'Unknown';
export default Dev.describe(name, async (e) => {
  const db = await SampleCrdt.init();
  const store = db.repo.store;

  type LocalStore = D & Pick<T, 'docuri'> & Pick<P, 'fields' | 'theme' | 'stateful'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    stateful: DEFAULTS.stateful,
    fields: DEFAULTS.fields.default,
    dataHistoryDesc: DEFAULTS.history.list.sort === 'desc',
    docuri: undefined,
    dataUris: true,
    dataDocLens: false,
    dataDocArray: false,
    dataDocIconClickHandler: true,
  });

  let doc: t.Doc | undefined;

  const resetInfoState$ = rx.subject();
  const setFields = async (dev: t.DevTools<T>, fields?: (t.InfoField | undefined)[]) => {
    local.fields = fields?.length === 0 ? undefined : fields;
    await dev.change((d) => (d.props.fields = fields));
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    const sample = SampleCrdt.dev(state, local, store);

    await state.change((d) => {
      d.docuri = local.docuri;
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
    doc = await sample.get();

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
        const { store, index } = db.repo;
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
            resetState$={resetInfoState$}
            onStateChange={(e) => {
              console.info('⚡️ onStateChange', e);
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const sample = SampleCrdt.dev(state, local, db.repo.store);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
            all={DEFAULTS.fields.all}
            selected={props.fields}
            onClick={(e) => {
              setFields(dev, e.next<t.InfoField>(DEFAULTS.fields.default));
              resetInfoState$.next();
            }}
          />
        );
      });

      dev.title('Common States');

      const config = (label: string, fields: t.InfoField[]) => {
        dev.button(label, async (e) => {
          await setFields(dev, fields);
          resetInfoState$.next();
        });
      };

      dev.button('(prepend): Visible', (e) => {
        const fields = e.state.current.props.fields ?? [];
        if (!fields.includes('Visible')) setFields(dev, ['Visible', ...fields]);
        resetInfoState$.next();
      });
      dev.hr(-1, 5);
      config('Repo / Doc', ['Repo', 'Doc', 'Doc.URI']);
      config('Repo / Doc / Object', ['Repo', 'Doc', 'Doc.URI', 'Doc.Object']);
      config('Repo / Doc / Head', ['Repo', 'Doc', 'Doc.URI']);
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

    dev.section(['Sample State', 'CRDT'], (dev) => {
      dev.button((btn) => {
        btn
          .label(`create`)
          .enabled((e) => !doc)
          .onClick(async (e) => (doc = await sample.get()));
      });
      dev.button((btn) => {
        btn
          .label(`delete`)
          .right((e) => (doc ? `crdt:${Doc.Uri.shorten(doc.uri)}` : ''))
          .enabled((e) => !!doc)
          .onClick(async (e) => (doc = await sample.delete()));
      });
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
    });

    dev.hr(1, 20);

    dev.section('Data: Mutate', (dev) => {
      const mutate = (
        label: string | [string, string],
        fn: (e: { doc: t.Doc | t.Lens }) => any | Promise<any>,
      ) => {
        const labels = Array.isArray(label) ? label : [label, ''];
        dev.button((btn) => {
          btn
            .label(labels[0])
            .right(labels[1])
            .enabled((e) => !!doc)
            .onClick((e) => {
              if (doc) fn({ doc });
              dev.redraw();
            });
        });
      };

      mutate(['Write sample BLOB', '[Uint8Array]'], (e) => {
        type T = { binary?: Uint8Array };
        const doc = e.doc as t.Doc<T>;
        const length = Value.random(5000, 15000);
        const binary = new Uint8Array(new Array(length).fill(0));
        doc.change((d) => (d.binary = binary));
      });
      mutate(['increment', 'count + 1'], async (e) => {
        type T = { count?: number };
        const doc = e.doc as t.Doc<T>;
        doc.change((d) => (d.count = (d.count ?? 0) + 1));
      });
      mutate(['increment child', 'count + 1'], async (e) => {
        type T = { child?: { count?: number } };
        const doc = e.doc as t.Doc<T>;
        doc.change((d) => {
          const child = d.child || (d.child = { count: 0 });
          child.count = (child.count ?? 0) + 1;
        });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.button('reset: Info State', (e) => resetInfoState$.next());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>(async (e) => {
      const { props } = e.state;
      const data = {
        docuri: Doc.Uri.id(e.state.docuri, { shorten: 5 }),
        props,
        'crdt:store:db': db.storage.name,
        'crdt:doc': doc,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
