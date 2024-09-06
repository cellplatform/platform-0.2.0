import { Dev, Doc, Immutable, Json, rx, SampleCrdt, Value } from '../../test.ui';
import { Info } from '../ui.Info';
import { SpecData, type SpecDataFlags } from '../ui.Info/-SPEC.data';

import { DEFAULTS } from '.';
import { type t } from './common';

type P = t.InfoStatefulProps;
type D = {
  docuri?: t.UriString;
  flags: SpecDataFlags;
  render?: boolean;
};

/**
 * Spec
 */
const name = DEFAULTS.Stateful.displayName;

export default Dev.describe(name, async (e) => {
  const db = await SampleCrdt.init();
  const repo = db.repo;

  type LocalStore = { props?: string; debug?: string; data?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({ props: undefined, debug: undefined, data: undefined });

  const flags = SpecData.defaults.flags;
  const clonerRef = Immutable.clonerRef;
  const State = {
    props: clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: clonerRef<D>(Json.parse<D>(local.debug, { render: true, flags })),
    data: clonerRef(Json.parse<t.InfoData>(local.data, SpecData.asObject(repo.name, { flags }))),
  } as const;

  let doc: t.Doc | undefined;

  const Data = {
    update() {
      State.data.change((d) => {
        const docs = Info.Data.documents(d);
        if (docs[0]) docs[0].uri = doc?.uri;
      });
    },
  } as const;

  const setFields = async (fields?: (t.InfoField | undefined)[]) => {
    State.props.change((d) => (d.fields = fields));
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<D>(e);
    const sample = SampleCrdt.dev(db.repo.store, State.debug);

    const props$ = State.props.events().changed$;
    const debug$ = State.debug.events().changed$;
    const data$ = State.data.events().changed$;

    rx.merge(props$, debug$, data$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.props = Json.stringify(State.props.current);
        local.debug = Json.stringify(State.debug.current);
        local.data = Json.stringify(State.data.current);
      });
    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    doc = await sample.get();
    Data.update();

    ctx.debug.width(330);
    ctx.subject
      .size([320, null])
      .display('grid')
      .render<D>(() => {
        const props = State.props.current;
        const debug = State.debug.current;
        Dev.Theme.background(dev, props.theme, 1);

        if (!debug.render) return null;

        return (
          <Info.Stateful
            {...props}
            repos={{ [db.name]: db.repo }}
            data={State.data}
            style={{ minHeight: 300, margin: 10 }}
            onReady={(e) => {
              console.info(`⚡️ Info.Stateful.onReady:`, e);
              e.dispose$.subscribe(() => console.info(`⚡️ Info.Stateful.onReady → dispose 💥`));

              const changed$ = State.data?.events(e.dispose$).changed$;
              changed$?.pipe(rx.debounceTime(150)).subscribe((e) => dev.redraw());
            }}
            onHistoryItemClick={(e) => console.info('⚡️ onHistoryItemClick', e)}
            onVisibleToggle={(e) => console.info('⚡️ onVisibleToggle', e)}
            onDocToggleClick={(e) => console.info('⚡️ onDocToggleClick', e)}
            onChange={(e) => console.info('⚡️ onChange', e)}
            onBeforeObjectRender={(mutate, ctx) => {
              mutate['foo'] = 123; // Sample render mutation (safe 🐷).
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
        dev.button(label, () => setFields(fields));
      };

      config(['Repo / Doc', '(simple)'], ['Visible', 'Doc', 'Doc.Repo', 'Doc.URI', 'Doc.Object']);
      config('Repo / Doc / History + List', [
        'Repo',
        'Doc',
        'Doc.URI',
        'Doc.Object',
        'Doc.History',
        'Doc.History.Genesis',
        'Doc.History.List',
        'Doc.History.List.Detail',
        'Doc.History.List.NavPaging',
      ]);
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.props, 1);
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
          .onClick(async () => {
            doc = await sample.get();
            Data.update();
          });
      });
      dev.button((btn) => {
        btn
          .label(`delete`)
          .right((e) => (doc ? `crdt:${Doc.Uri.shorten(doc.uri)}` : ''))
          .enabled((e) => !!doc)
          .onClick(async (e) => {
            await sample.delete();
            doc = undefined;
            local.data = undefined;
            Data.update();
          });
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

      dev.boolean((btn) => {
        const state = State.debug;
        const current = () => !!state.current.render;
        btn
          .label(() => `render`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'render')));
      });

      dev.hr(-1, 5);
      dev.button(['reset: local', 'storage'], () => {
        local.data = undefined;
        local.props = undefined;
        local.debug = undefined;
        location.reload();
      });
      dev.button('reset: local.data', () => {
        local.data = undefined;
        location.reload();
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>(() => {
      const props = State.props.current;
      const data = {
        props,
        data: State.data.current,
        'data.instance': State.data.instance,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
