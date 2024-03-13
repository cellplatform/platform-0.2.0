import { Info } from '.';
import { Dev, Pkg, TestDb, Value, WebStore, type t } from '../../test.ui';

type T = { props: t.InfoProps };
const initial: T = { props: {} };
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

  type LocalStore = { selectedFields?: t.InfoField[] };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    selectedFields: DEFAULTS.fields.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.fields = local.selectedFields;
      d.props.margin = 10;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([320, null])
      .display('grid')
      .render<T>(async (e) => {
        const fields = e.state.props.fields ?? [];
        const doc = fields.includes('Doc') ? await docAtIndex(0) : undefined;

        return (
          <Info
            {...e.state.props}
            data={{
              repo: { store, index },
              document: {
                // label: '',
                doc,
                object: { name: 'foobar', expand: { level: 2 } },
                onIconClick(e) {
                  console.info('⚡️ document.onIconClick', e);
                  state.change((d) => {
                    const fields = d.props.fields ?? [];
                    d.props.fields = fields.includes('Doc.Object')
                      ? fields.filter((f) => f !== 'Doc.Object')
                      : [...fields, 'Doc.Object'];
                    local.selectedFields = d.props.fields;
                  });
                },
              },
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Fields', (dev) => {
      const update = (fields?: t.InfoField[] | undefined) => {
        dev.change((d) => (d.props.fields = fields));
        local.selectedFields = fields?.length === 0 ? undefined : fields;
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
                  : (ev.next as t.InfoProps['fields']);
              update(fields);
            }}
          />
        );
      });
      dev.hr(0, [10, 10]).title('Common States');
      dev.button('Repo / Doc', (e) => update(['Repo', 'Doc', 'Doc.URI']));
      dev.button('Repo / Doc / Object', (e) => update(['Repo', 'Doc', 'Doc.URI', 'Doc.Object']));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.button(['write sample BLOB', '[Uint8Array]'], async (e) => {
        type T = { binary?: Uint8Array };
        const doc = await docAtIndex<T>(0);
        const length = Value.random(5000, 15000);
        const binary = new Uint8Array(new Array(length).fill(0));
        doc?.change((d) => (d.binary = binary));
        dev.redraw();
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
