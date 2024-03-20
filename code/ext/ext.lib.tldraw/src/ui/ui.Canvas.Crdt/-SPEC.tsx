import { CanvasCrdt, DEFAULTS } from '.';
import { Dev, DevReload, Pkg, TestDb, type t } from '../../test.ui';
import { SampleCrdt, type SampleCrdtRef } from './-SPEC-crdt';

type TEnv = { store?: t.Store; docuri?: string; peerid?: string };
type P = t.CanvasCrdtProps;
type T = { props: P; debug: { docuri?: string; reload?: boolean } };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & Pick<P, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: undefined,
    docuri: undefined,
  });

  let crdt: SampleCrdtRef | undefined;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const env = (ctx.env ?? {}) as TEnv;
    console.info(`${name}:env:`, env);

    // NB: pass store/docuri in from environemnt if available, otherwise local store will be used.
    crdt = await SampleCrdt.init(env.docuri ?? local.docuri, { store: env.store });
    if (!env.docuri) local.docuri = crdt.doc.uri;

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.userId = 'foo-1234';
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        if (debug.reload) return <DevReload />;

        Dev.Theme.background(dev, props.theme);
        const userId = env.peerid || props.userId;
        return <CanvasCrdt {...props} doc={crdt?.doc} userId={userId} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const env = (dev.ctx.env ?? {}) as TEnv;

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );
    });

    dev.hr(5, 20);

    dev.section('State', (dev) => {
      dev.row((e) => crdt?.render({ Margin: [15, 0, 0, 0] }));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

      if (!env.store) {
        // NB: only render button if the CRDT is generated locally and not passed into the environment.
        dev.hr(-1, 5);
        dev.button([`delete database: "${crdt?.storage}"`, '💥'], async (e) => {
          e.state.change((d) => (d.debug.reload = true));
          await TestDb.Spec.deleteDatabase();
        });
      }
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const env = dev.ctx.env as TEnv | undefined;
      const data = {
        ...e.state,
        env: { docuri: env?.docuri, peerid: env?.peerid },
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
