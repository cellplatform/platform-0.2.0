import type { CmdBarStatefulProps } from 'sys.ui.react.common/src/types';
import { Button, COLORS, Color, Dev, Doc, Pkg, css, sampleCrdt, type t } from '../../test.ui';

type P = CmdBarStatefulProps;
type T = { props: P; debug: { docuri?: t.UriString; useLens?: boolean } };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = 'Crdt.CmdBar';

export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & Pick<P, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    docuri: undefined,
    useLens: true,
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

        return <div>{`🐷 ${name}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (e) => (local.theme = e));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });

    dev.hr(5, 20);

    dev.section('Sample CRDT', (dev) => {
      dev.button('ensure exists', async (e) => {
        await ensureSample(state);
      });

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
        docuri: Doc.Uri.id(debug.docuri, { shorten: 5 }),
        doc: doc?.current,
        props,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
