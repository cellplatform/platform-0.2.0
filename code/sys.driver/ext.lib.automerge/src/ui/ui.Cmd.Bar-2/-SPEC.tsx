import { CmdBar } from 'sys.ui.react.common';
import type { CmdBarStatefulProps } from 'sys.ui.react.common/src/types';

import { Dev, Doc, Pkg, sampleCrdt, type t } from '../../test.ui';
import { Info } from '../ui.Info';
import { Sync } from '../../crdt.sync';

type P = CmdBarStatefulProps;
type T = { props: P; debug: { docuri?: t.UriString; useLens?: boolean } };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = `${Pkg.name}:Crdt.CmdBar`;

export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & Pick<P, 'theme' | 'useKeyboard'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    docuri: undefined,
    useLens: true,
    useKeyboard: true,
  });

  let doc: t.Doc | undefined;
  const db = await sampleCrdt({ broadcastAdapter: true });
  const ensureSample = async (state: t.DevCtxState<T>) => {
    const uri = state.current.debug.docuri;
    const exists = uri ? await db.store.doc.exists(uri) : false;
    doc = exists ? await db.store.doc.get(uri) : await db.store.doc.getOrCreate((d) => null);
    state.change((d) => (local.docuri = d.debug.docuri = doc?.uri));
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.useKeyboard = local.useKeyboard;
      d.debug.useLens = local.useLens;
      d.debug.docuri = local.docuri;
    });

    await ensureSample(state);

    ctx.debug.width(330);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);

        return (
          <CmdBar.Stateful
            {...props}
            state={doc}
            onReady={(e) => {
              console.info('⚡️ CmdBar.Stateful.onReady:', e);
              if (doc) Sync.Textbox.listen(e.textbox, doc, e.paths.text);
            }}
          />
        );
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.header.border(-0.1).render((e) => {
      const { debug, props } = state.current;
      const { store, index } = db;
      const ref = debug.docuri;
      return (
        <Info
          stateful={true}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: { store, index },
            document: {
              ref,
              object: {
                visible: false,
                expand: { level: 2 },
                beforeRender(mutate) {},
              },
            },
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (e) => (local.theme = e));
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.useKeyboard;
        btn
          .label((e) => `useKeyboard`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'useKeyboard')));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });

    dev.hr(5, 20);

    dev.section('Sample CRDT', (dev) => {
      dev.button('ensure exists', (e) => ensureSample(state));
      dev.button('delete', async (e) => {
        const uri = state.current.debug.docuri;
        if (uri) await db.store.doc.delete(uri);
        doc = undefined;
        state.change((d) => (local.docuri = d.debug.docuri = undefined));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>(async (e) => {
      const { props, debug } = e.state;
      const data = {
        props,
        docuri: Doc.Uri.id(debug.docuri, { shorten: 5 }),
        doc: doc?.current,
      };
      return <Dev.Object name={name} data={data} expand={{ paths: ['$'] }} fontSize={11} />;
    });
  });
});
