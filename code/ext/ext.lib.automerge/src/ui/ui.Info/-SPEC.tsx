import { Info } from '.';
import { Dev, DevReload, Pkg, TestDb, Value, type t } from '../../test.ui';
import { sampleCrdt } from './-SPEC.crdt';

type P = t.InfoProps;
type T = {
  props: t.InfoProps;
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

  type LocalStore = T['debug'] & Pick<P, 'fields' | 'theme' | 'stateful'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    stateful: DEFAULTS.stateful,
    fields: DEFAULTS.fields.default,
    historyDesc: DEFAULTS.history.list.sort === 'desc',
    useUris: true,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.fields = local.fields;
      d.props.margin = 10;
      d.props.stateful = local.stateful;

      d.debug.historyDesc = local.historyDesc;
      d.debug.useUris = local.useUris;
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
            onIconClick(e) {
              console.info('⚡️ document.onIconClick', e);
            },
          },
          history: {
            // label: 'Foo',
            doc: useUris ? doc?.uri : doc,
            list: {
              sort: debug.historyDesc ? 'desc' : 'asc',
              showDetailFor: debug.historyDetail,
            },
            onItemClick(e) {
              console.info('⚡️ history.onItemClick', e);
              state.change((d) => {
                d.debug.historyDetail = d.debug.historyDetail === e.hash ? undefined : e.hash;
              });
            },
          },
          visible: {
            onToggle(e) {
              console.info('⚡️ visible.onToggle', e);
            },
          },
        };

        return <Info {...props} data={data} fields={props.fields} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Fields', (dev) => {
      const setFields = (fields?: (t.InfoField | undefined)[]) => {
        dev.change((d) => (d.props.fields = fields));
        local.fields = fields?.length === 0 ? undefined : fields;
      };
      const config = (label: string, fields: t.InfoField[]) => {
        dev.button(label, (e) => setFields(fields));
      };

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
              setFields(fields);
            }}
          />
        );
      });
      dev.title('Common States');
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
      dev.hr(-1, 5);
      dev.button('prepend: Visible', (e) => {
        const fields = e.state.current.props.fields ?? [];
        if (!fields.includes('Visible')) setFields(['Visible', ...fields]);
      });
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
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

      Dev.Theme.switcher(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );

      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.useUris;
        btn
          .label((e) => `use doc uris`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.useUris = Dev.toggle(d.debug, 'useUris'))));
      });

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
    dev.footer.border(-0.1).render<T>(async (e) => {
      const { props, debug } = e.state;
      const crdt = (await db.docAtIndex(0))?.current;
      const data = {
        props,
        debug,
        'crdt:storage:db': db.storage.name,
        'crdt:doc': crdt,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
