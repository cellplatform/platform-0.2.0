import { DEFAULTS, Info } from '.';
import { Dev, DevReload, Doc, Immutable, Json, rx, SampleCrdt, Value, type t } from '../../test.ui';
import { SpecData, type SpecDataFlags } from './-SPEC.data';

export { SpecData };

type P = t.InfoProps;
type D = {
  reload?: boolean;
  docuri?: t.UriString;
  flags: SpecDataFlags;
};

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, async (e) => {
  const db = await SampleCrdt.init();
  const { store } = db.repo;

  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });

  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, { flags: SpecData.defaults.flags })),
  } as const;

  let doc: t.Doc | undefined;
  type F = t.InfoField | undefined;
  const setFields = (fields?: F[]) => State.props.change((d) => (d.fields = fields));

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<D>(e);
    const sample = SampleCrdt.dev(store, State.debug);

    const props$ = State.props.events().changed$;
    const debug$ = State.debug.events().changed$;

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.props = Json.stringify(State.props.current);
        local.debug = Json.stringify(State.debug.current);
      });

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => dev.redraw());

    doc = await sample.get();

    ctx.debug.width(330);
    ctx.subject
      .size([320, null])
      .display('grid')
      .render<D>(async () => {
        const props = State.props.current;
        const debug = State.debug.current;

        Dev.Theme.background(ctx, props.theme);
        if (debug.reload) return <DevReload theme={props.theme} />;

        const fields = props.fields ?? [];
        const docuri = debug.docuri;

        const doc = fields.includes('Doc') ? await store.doc.get(docuri) : undefined;
        const repo = db.repo;
        const flags = debug.flags;
        const data = SpecData.asObject({ doc, repo, flags });

        return (
          <Info
            {...props}
            data={data}
            repos={{ [db.name]: repo }}
            style={{ minHeight: 300 }}
            onVisibleToggle={(e) => console.info('⚡️ onVisibleToggle', e)}
            onDocToggleClick={(e) => console.info('⚡️ onDocToggleClick', e)}
            onBeforeObjectRender={(mutate, ctx) => {
              mutate['foo'] = 123;
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);
    const sample = SampleCrdt.dev(db.repo.store, State.debug);

    dev.section('Fields', (dev) => {
      dev.row(() => {
        const props = State.props.current;
        return (
          <Info.FieldSelector
            selected={props.fields}
            onClick={(e) => setFields(e.next<t.InfoField>(DEFAULTS.fields.default))}
          />
        );
      });

      dev.title('Common States');

      const config = (label: string | [string, string], fields: t.InfoField[]) => {
        dev.button(label, (e) => setFields(fields));
      };

      dev.button('(prepend): Visible', (e) => {
        const fields = State.props.current.fields ?? [];
        if (!fields.includes('Visible')) setFields(['Visible', ...fields]);
      });
      dev.hr(-1, 5);
      config('Repo / Doc', ['Repo', 'Doc', 'Doc.URI']);
      config('Repo / Doc / Object', ['Repo', 'Doc', 'Doc.URI', 'Doc.Object']);
      config('Repo / Doc / History + List', [
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
      Dev.Theme.immutable(dev, State.props);
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const state = State.props;
        const current = () => !!state.current.enabled;
        btn
          .label(() => `enabled`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'enabled')));
      });
    });

    dev.hr(5, 20);

    dev.section(['Sample State', 'CRDT'], (dev) => {
      dev.button((btn) => {
        btn
          .label(`create`)
          .enabled(() => !doc)
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
        const value = () => !!State.debug.current.flags.historyDesc;
        btn
          .label((e) => `data.history.list.sort: "${value() ? 'desc' : 'asc'}"`)
          .value((e) => value())
          .onClick((e) => State.debug.change((d) => Dev.toggle(d.flags, 'historyDesc')));
      });
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = () => !!State.debug.current.flags.uris;
        btn
          .label(() => `data.document.doc ← URI string`)
          .value(() => value())
          .onClick(() => State.debug.change((d) => Dev.toggle(d.flags, 'uris')));
      });
      dev.boolean((btn) => {
        const value = () => !!State.debug.current.flags.docLens;
        btn
          .label(() => `data.document.lens`)
          .value(() => value())
          .onClick(() => State.debug.change((d) => Dev.toggle(d.flags, 'docLens')));
      });
      dev.boolean((btn) => {
        const value = () => !!State.debug.current.flags.docArray;
        btn
          .label(() => `data.document ← [array]`)
          .value(() => value())
          .onClick(() => State.debug.change((d) => Dev.toggle(d.flags, 'docArray')));
      });
      dev.boolean((btn) => {
        const value = () => !!State.debug.current.flags.docIconClickHandler;
        btn
          .label(() => `data.document.icon.onClick`)
          .value(() => value())
          .onClick(() => State.debug.change((d) => Dev.toggle(d.flags, 'docIconClickHandler')));
      });
    });

    dev.hr(1, 20);

    dev.section('Mutate', (dev) => {
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

      mutate(['Write BLOB', '[Uint8Array]'], (e) => {
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
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>(() => {
      const props = State.props.current;
      const debug = State.debug.current;
      const data = {
        docuri: Doc.Uri.id(debug.docuri, { shorten: 5 }),
        props,
        'crdt:store:db': db.name,
        'crdt:doc': doc,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
