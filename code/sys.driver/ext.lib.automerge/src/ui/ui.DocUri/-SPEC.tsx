import { DEFAULTS, DocUri } from '.';
import { Dev, Doc, Immutable, Json, Pkg, SampleCrdt, rx } from '../../test.ui';
import { Info } from '../ui.Info';
import { type t } from './common';

type P = t.DocUriProps;
type D = { docuri?: string; useDoc?: boolean };

const LARGE_FONT = 40;
const HEAD = 2;

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });

  const initial = { props: { ...DEFAULTS.props, fontSize: LARGE_FONT } };
  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, () => initial.props)),
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, { useDoc: false })),
  } as const;

  const db = await SampleCrdt.init({});
  let doc: t.Doc | undefined;

  const Props = {
    get(): P {
      const props = State.props.current;
      const debug = State.debug.current;
      return {
        ...props,
        doc: debug.useDoc ? doc : doc?.uri,
      };
    },
  } as const;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<D>(e);
    const sample = SampleCrdt.dev(db.repo.store, State.debug);
    doc = await sample.get();

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
      .subscribe(() => ctx.redraw());

    ctx.debug.width(330);
    ctx.subject.display('grid').render<D>(() => {
      const props = Props.get();
      Dev.Theme.background(dev, props.theme, 1);

      return (
        <DocUri
          {...props}
          onMouse={(e) => console.info(`⚡️ DocUri.onMouse:`, e)}
          onCopy={(e) => console.info(`⚡️ DocUri.onCopy:💦`, e)}
        />
      );
    });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<D>(e);

    dev.header.border(-0.1).render<D>(() => {
      const { store, index } = db.repo;
      return (
        <Info.Stateful
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          repos={{ main: { store, index } }}
          data={{
            document: {
              uri: doc?.uri,
              repo: 'main',
              address: { head: true },
              object: { visible: false },
            },
          }}
        />
      );
    });
  });

  e.it('ui:debug', (e) => {
    const dev = Dev.tools<D>(e);
    const sample = SampleCrdt.dev(db.repo.store, State.debug);

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

      dev.boolean((btn) => {
        const value = () => !!State.props.current.fontSize;
        btn
          .label(() => `fontSize: ${value() ? `${LARGE_FONT}px` : '<undefined>'}`)
          .value(() => value())
          .onClick(() => {
            const next = value() ? undefined : LARGE_FONT;
            State.props.change((d) => (d.fontSize = next));
          });
      });

      dev.boolean((btn) => {
        const value = () => !!State.props.current.head;
        btn
          .label(() => `head: ${value() ? HEAD : '<undefined>'}`)
          .value(() => value())
          .onClick(() => {
            const next = value() ? undefined : HEAD;
            State.props.change((d) => (d.head = next));
          });
      });

      dev.boolean((btn) => {
        const value = () => !!State.props.current.clipboard;
        btn
          .label(() => `clipboard`)
          .value(() => value())
          .onClick(() => State.props.change((d) => Dev.toggle(d, 'clipboard')));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = () => !!State.debug.current.useDoc;
        btn
          .label(() => (value() ? `using Doc<T> URI` : `using string URI`))
          .value(() => value())
          .onClick(() => State.debug.change((d) => Dev.toggle(d, 'useDoc')));
      });
    });

    dev.hr(5, 20);

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
          .onClick(async () => (doc = await sample.delete()));
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
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>(() => {
      const props = Props.get();
      const data = {
        props: {
          ...props,
          doc: Doc.Is.doc(props.doc) ? props.doc : Doc.Uri.shorten(props.doc),
        },
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
