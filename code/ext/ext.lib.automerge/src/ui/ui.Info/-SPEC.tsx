import { Info } from '.';
import { Dev, DevReload, Pkg, PropList, TestDb, Value, WebStore, type t } from '../../test.ui';

type P = t.InfoProps;
type T = {
  props: t.InfoProps;
  debug: { reload?: boolean; historyDesc?: boolean; historyDetail?: t.HashString };
};
const initial: T = { props: {}, debug: {} };
const DEFAULTS = Info.DEFAULTS;

/**
 * Spec
 */
const name = Info.displayName ?? 'Unknown';

export default Dev.describe(name, async (e) => {
  const storage = TestDb.Spec.name;
  const store = WebStore.init({ storage });
  const index = await WebStore.index(store);

  function docAtIndex<T>(i: number) {
    const doc = index.doc.current.docs[i];
    return doc ? index.store.doc.get<T>(doc.uri) : undefined;
  }

  type LocalStore = T['debug'] & Pick<P, 'fields' | 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    fields: DEFAULTS.fields.default,
    historyDesc: DEFAULTS.history.list.sort === 'desc',
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.fields = local.fields;
      d.props.margin = 10;
      d.debug.historyDesc = local.historyDesc;
    });

    ctx.debug.width(330);
    ctx.subject
      .size([320, null])
      .display('grid')
      .render<T>(async (e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(ctx, props.theme);

        if (debug.reload) return <DevReload />;

        const fields = props.fields ?? [];
        const doc = fields.includes('Doc') ? await docAtIndex(0) : undefined;

        const toggleVisibile = (field: t.InfoField) => {
          state.change((d) => {
            const next = PropList.Wrangle.toggleField(d.props.fields, field);
            local.fields = d.props.fields = next;
          });
        };

        const data: t.InfoData = {
          repo: { store, index },
          document: {
            // label: 'Foo',
            doc,
            object: { name: 'foobar', expand: { level: 2 } },
            onIconClick(e) {
              console.info('⚡️ document.onIconClick', e);
              toggleVisibile('Doc.Object');
            },
          },
          history: {
            // label: 'Foo',
            doc,
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
        };

        return <Info {...props} data={data} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Fields', (dev) => {
      const update = (fields?: t.InfoField[] | undefined) => {
        dev.change((d) => (d.props.fields = fields));
        local.fields = fields?.length === 0 ? undefined : fields;
      };
      const set = (label: string, fields: t.InfoField[]) => {
        dev.button(label, (e) => update(fields));
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
              update(fields);
            }}
          />
        );
      });
      dev.hr(0, [10, 10]).title('Common States');
      set('Repo / Doc', ['Repo', 'Doc', 'Doc.URI']);
      set('Repo / Doc / Object', ['Repo', 'Doc', 'Doc.URI', 'Doc.Object']);
      set('Repo / Doc / History ( + List )', [
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
      Dev.Theme.switch(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );

      dev.hr(-1, 5);
      dev.button('create doc', async (e) => {
        await store.doc.getOrCreate((d) => null);
        dev.redraw();
      });
      dev.button([`delete database: "${storage}"`, '💥'], async (e) => {
        await e.state.change((d) => (d.debug.reload = true));
        await TestDb.Spec.deleteDatabase();
      });
      dev.hr(-1, 5);
      dev.button(['write sample BLOB', '[Uint8Array]'], async (e) => {
        type T = { binary?: Uint8Array };
        const doc = await docAtIndex<T>(0);
        const length = Value.random(5000, 15000);
        const binary = new Uint8Array(new Array(length).fill(0));
        doc?.change((d) => (d.binary = binary));
        dev.redraw();
      });
      dev.button(['increment', 'count + 1'], async (e) => {
        type T = { count?: number };
        const doc = await docAtIndex<T>(0);
        doc?.change((d) => (d.count = (d.count ?? 0) + 1));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>(async (e) => {
      const { props, debug } = e.state;
      const crdt = (await docAtIndex(0))?.current;
      const data = {
        props,
        debug,
        'crdt:storage': storage,
        crdt,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
