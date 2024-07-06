import { CmdBar, DEFAULTS } from '.';
import { css, Dev, Doc, Pkg, SampleCrdt, slug, Time, type t } from '../../test.ui';
import { Info } from '../ui.Info';

type P = t.CmdBarProps;
type T = {
  docuri?: t.UriString;
  props: P;
  debug: { useLens?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & Pick<T, 'docuri'> & Pick<P, 'theme' | 'focusOnReady'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    focusOnReady: true,
    docuri: undefined,
    useLens: true,
  });

  const cmdbar = CmdBar.Ctrl.create();
  const db = await SampleCrdt.init({ broadcastAdapter: true });

  const lensPath: t.ObjectPath = ['foobar'];
  let doc: t.Doc | undefined;

  const SampleLens = {
    path: ['foobar'] as t.ObjectPath,
    get() {
      if (!doc) return undefined;
      return Doc.lens(doc, lensPath, (d) => (d[lensPath[0]] = {}));
    },
  } as const;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    const sample = SampleCrdt.dev(state, local, db.store);

    await state.change((d) => {
      d.props.instance = slug();
      d.props.theme = local.theme;
      d.props.focusOnReady = local.focusOnReady;
      d.props.paths = DEFAULTS.paths;
      d.debug.useLens = local.useLens;
      d.docuri = local.docuri;
    });
    doc = await sample.get();

    ctx.debug.width(350);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(dev, props.theme, 1);

        const styles = {
          base: css({ position: 'relative' }),
          instance: css({
            Absolute: [null, 8, -20, null],
            userSelect: 'none',
            fontFamily: 'monospace',
            fontSize: 10,
            opacity: 0.2,
          }),
        };
        return (
          <div {...styles.base}>
            <div {...styles.instance}>{`component:instance:${props.instance || 'unknown'}`}</div>
            <CmdBar
              {...props}
              ctrl={cmdbar.cmd}
              doc={debug.useLens ? SampleLens.get() : doc}
              onReady={(e) => console.info(`⚡️ onReady:`, e)}
              onText={(e) => console.info(`⚡️ onText:`, e)}
              onCommand={(e) => console.info(`⚡️ onCommand:`, e)}
              onInvoke={(e) => console.info(`⚡️ onInvoke:`, e)}
            />
          </div>
        );
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.header.border(-0.1).render((e) => {
      const { debug, props, docuri } = state.current;
      const { store, index } = db;
      return (
        <Info
          stateful={true}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: { store, index },
            document: {
              ref: docuri,
              object: {
                visible: true,
                expand: { level: 2 },
                lens: debug.useLens ? SampleLens.path : undefined,
                beforeRender(mutate) {
                  // const resolve = CmdBar.Path.resolver(props.paths);
                  // return resolve.toObject(mutate);
                },
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
    const sample = SampleCrdt.dev(state, local, db.store);

    dev.section('Properties', (dev) => {
      Dev.Theme.switcher(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.focusOnReady;
        btn
          .label((e) => `focusOnReady`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.focusOnReady = Dev.toggle(d.props, 'focusOnReady'))),
          );
      });
    });

    dev.hr(5, 20);

    dev.section(['Ctrl', 'Command'], (dev) => {
      dev.button('focus', (e) => Time.delay(0, () => cmdbar.focus({})));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.useLens;
        btn
          .label((e) => `use lens`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.useLens = Dev.toggle(d.debug, 'useLens'))));
      });
    });

    dev.hr(5, 20);

    dev.section(['Sample State', 'CRDT'], (dev) => {
      dev.button((btn) => {
        btn
          .label(`create`)
          .enabled((e) => !doc)
          .onClick(async (e) => (doc = await sample.get()));
      });
      dev.button((btn) => {
        btn
          .label(`delete`)
          .enabled((e) => !!doc)
          .onClick(async (e) => (doc = await sample.delete()));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>(async (e) => {
      const { props, docuri } = e.state;
      const data = {
        props,
        docuri: Doc.Uri.id(docuri, { shorten: 5 }),
        doc: doc?.current,
      };
      return <Dev.Object name={name} data={data} expand={{ paths: ['$'] }} fontSize={11} />;
    });
  });
});
