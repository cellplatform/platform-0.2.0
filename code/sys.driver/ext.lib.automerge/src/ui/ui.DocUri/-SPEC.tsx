import { DEFAULTS, DocUri } from '.';
import { Dev, Doc, Pkg, SampleCrdt } from '../../test.ui';
import { Info } from '../ui.Info';
import { type t } from './common';

type P = t.DocUriProps;
type T = { docuri?: string; props: P; debug: { useDoc?: boolean } };
const initial: T = { props: {}, debug: {} };

const LARGE_FONT = 40;
const HEAD = 2;

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & Pick<T, 'docuri'> & Pick<P, 'theme' | 'fontSize' | 'head'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    docuri: undefined,
    head: undefined,
    useDoc: false,
    fontSize: LARGE_FONT,
  });

  const db = await SampleCrdt.init({});
  let doc: t.Doc | undefined;

  const Props = {
    get(state: T): P {
      const { props, debug } = state;
      return {
        ...props,
        doc: debug.useDoc ? doc : doc?.uri,
      };
    },
  } as const;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    const sample = SampleCrdt.dev(state, local, db.store);

    await state.change((d) => {
      d.docuri = local.docuri;
      d.props.theme = local.theme;
      d.props.fontSize = local.fontSize;
      d.props.head = local.head;
      d.debug.useDoc = local.useDoc;
    });

    doc = await sample.get();

    ctx.debug.width(330);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const props = Props.get(e.state);
        Dev.Theme.background(dev, props.theme, 1);
        return <DocUri {...props} />;
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header.border(-0.1).render((e) => {
      const { store, index } = db;
      return (
        <Info
          stateful={true}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: { store, index },
            document: {
              ref: doc,
              uri: { head: true },
              object: { visible: false },
            },
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const sample = SampleCrdt.dev(state, local, db.store);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.fontSize;
        btn
          .label((e) => `fontSize: ${value(e.state) ? `${LARGE_FONT}px` : '<undefined>'}`)
          .value((e) => value(e.state))
          .onClick((e) => {
            const next = value(e.state.current) ? undefined : LARGE_FONT;
            e.change((d) => (local.fontSize = d.props.fontSize = next));
          });
      });

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.head;
        btn
          .label((e) => `head: ${value(e.state) ? HEAD : '<undefined>'}`)
          .value((e) => value(e.state))
          .onClick((e) => {
            const next = value(e.state.current) ? undefined : HEAD;
            e.change((d) => (local.head = d.props.head = next));
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.useDoc;
        btn
          .label((e) => (value(e.state) ? `using Doc<T> URI` : `using string URI`))
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.useDoc = Dev.toggle(d.debug, 'useDoc'))));
      });
    });

    dev.hr(5, 20);

    dev.section('Sample State', (dev) => {
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

      dev.hr(-1, 5);

      dev.button((btn) => {
        type T = { count: number };
        const getCount = () => doc?.current?.count ?? 0;
        btn
          .label(`increment`)
          .right((e) => `count: ${getCount()} + 1`)
          .enabled((e) => !!doc)
          .onClick((e) => {
            doc?.change((d) => (d.count = ((d as T).count || 0) + 1));
            dev.redraw('debug');
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const props = Props.get(e.state);
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
