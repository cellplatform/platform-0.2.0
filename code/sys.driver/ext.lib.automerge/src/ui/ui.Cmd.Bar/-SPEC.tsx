import { CmdBar, DEFAULTS } from '.';
import { Color, Dev, Doc, Pkg, Time, css, sampleCrdt, slug, type t } from '../../test.ui';
import { Info } from '../ui.Info';
import { RepoList } from '../ui.RepoList';

type P = t.CmdBarProps;
type T = { props: P; debug: { docuri?: t.UriString; useLens?: boolean } };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & Pick<P, 'theme' | 'focusOnReady'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    focusOnReady: true,
    docuri: undefined,
    useLens: true,
  });

  const db = await sampleCrdt({ broadcastAdapter: true });
  let model: t.RepoListModel;
  let listRef: t.RepoListRef;
  let doc: t.Doc | undefined;

  const ctrl = CmdBar.Ctrl.create();

  let _lens: t.Lens | undefined;
  const getLens = () => {
    if (!_lens) _lens = doc ? Doc.lens(doc, ['mylens'], (d) => (d.mylens = {})) : undefined;
    return _lens;
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.instance = slug();
      d.props.theme = local.theme;
      d.props.focusOnReady = local.focusOnReady;
      d.props.paths = DEFAULTS.paths;
      d.debug.useLens = local.useLens;
      d.debug.docuri = local.docuri;
    });

    model = await RepoList.model(db.store, {
      behaviors: ['Copyable', 'Deletable'],
      onReady: (e) => (listRef = e.ref),
      async onActiveChanged(e) {
        console.info(`⚡️ onActiveChanged`, e);
        const uri = e.item.uri;
        doc = uri ? await db.store.doc.get(uri) : undefined;
        state.change((d) => (local.docuri = d.debug.docuri = uri));
      },
    });

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
            <div {...styles.instance}>{`instance: ${props.instance || 'unknown'}`}</div>
            <CmdBar
              {...props}
              ctrl={ctrl.cmd}
              doc={debug.useLens ? getLens() : doc}
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
                visible: true,
                expand: { level: 2 },
                beforeRender(mutate) {
                  const resolve = CmdBar.Path.resolver(props.paths);
                  return resolve.toObject(mutate);
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

    dev.section(['Controls', 'Cmd'], (dev) => {
      dev.button('focus', (e) => Time.delay(0, () => ctrl.focus({})));
      // dev.button('invoke', (e) => ctrl.invoke({}));
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

    dev.section('Data', (dev) => {
      dev.button(['reset {doc}', '(reloads) 💥'], (e) => {
        doc?.change((d) => Object.keys(d).forEach((key) => delete d[key]));
        location.reload();
      });
      dev.hr(-1, 5);
      dev.button(['increment: {doc.tmp}', 'tmp + 1'], async (e) => {
        type T = { tmp?: number };
        const doc = await db.docAtIndex<T>(0);
        doc?.change((d) => (d.tmp = (d.tmp ?? 0) + 1));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer
      .border(-0.1)
      .padding(0)
      .render<T>((e) => {
        const { props, debug } = e.state;
        const data = {
          docuri: Doc.Uri.id(debug.docuri, { shorten: 5 }),
          props,
        };

        const styles = {
          base: css({ position: 'relative' }),
          object: css({ padding: 10 }),
          list: css({ border: `solid 1px ${Color.alpha(Color.DARK, 0.15)}` }),
        };

        const elObject = (
          <div {...styles.object}>
            <Dev.Object name={name} data={data} expand={1} fontSize={11} />
          </div>
        );

        const elList = (
          <div {...styles.list}>
            <RepoList model={model} onReady={(e) => e.ref.select(0)} style={{}} />
          </div>
        );

        return (
          <div {...styles.base}>
            {elObject}
            {elList}
          </div>
        );
      });
  });
});
