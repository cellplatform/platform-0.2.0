import { COLORS, css, Dev, DevReload, Pkg, SampleCrdt, TestDb, type t } from '../../test.ui';
import { RepoList } from '../ui.RepoList';
import { SampleUseDoc, SampleUseDocs } from './-SPEC.useDocs.views';

type Hook = 'useDocs' | 'useDoc';
type Scope = 'all' | 'one' | 'none' | 'error';
type T = {
  reload?: boolean;
  scope?: Scope;
  loadDelay?: boolean;
  hook?: Hook;
  options: t.UseDocsOptions;
};
const initial: T = { options: {} };
const LOAD_DELAY = 1500;
const ERROR_URI = 'automerge:fail';

/**
 * Spec
 */
const name = 'useDocs';
export default Dev.describe(name, async (e) => {
  let _loadDelay = 0;
  const db = await SampleCrdt.init({ debug: { loadDelay: () => _loadDelay } });
  const { store, index } = db.repo;
  let model: t.RepoListModel;

  type LocalStore = Pick<T, 'scope' | 'loadDelay' | 'hook'> &
    Pick<t.UseDocsOptions, 'redrawOnChange'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    scope: 'all',
    loadDelay: true,
    hook: 'useDocs',
    redrawOnChange: true,
  });

  const getUris = (scope: Scope = 'all') => {
    if (scope === 'none') return [];
    const uris = index.doc.current.docs.map((item) => item.uri);
    const res = (scope === 'one' ? [uris[0]] : uris).filter(Boolean);
    return scope === 'error' ? [...res, ERROR_URI] : res;
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.scope = local.scope;
      d.loadDelay = local.loadDelay;
      d.hook = local.hook;
      d.options.redrawOnChange = local.redrawOnChange;
    });

    model = await RepoList.model(store, {
      behaviors: ['Copyable', 'Deletable'],
      onActiveChanged: () => dev.redraw(),
    });
    _loadDelay = state.current.loadDelay ? LOAD_DELAY : 0; // NB: set a delay so we can notice the load behavior.

    const theme: t.CommonTheme = 'Dark';
    Dev.Theme.background(ctx, theme, null, 0.02);
    ctx.debug.width(330);
    ctx.subject
      .size([380, null])
      .display('grid')
      .render<T>((e) => {
        const { reload, hook, scope, options } = e.state;
        const refs = getUris(scope);
        if (reload) return <DevReload theme={theme} />;

        if (hook === 'useDocs') {
          return <SampleUseDocs theme={theme} store={store} refs={refs} options={options} />;
        }

        if (hook === 'useDoc') {
          const ref = scope === 'error' ? ERROR_URI : getUris(e.state.scope)[0];
          return <SampleUseDoc theme={theme} refs={ref} store={store} options={options} />;
        }

        return null;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Hook', (dev) => {
      const hook = (hook: Hook) => {
        dev.button((btn) => {
          btn
            .label(hook)
            .right((e) => (e.state.hook === hook ? `←` : ''))
            .enabled((e) => true)
            .onClick((e) => state.change((d) => (local.hook = d.hook = hook)));
        });
      };
      hook('useDocs');
      hook('useDoc');
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => !!state.options.redrawOnChange;
        btn
          .label((e) => `redrawOnChange`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.redrawOnChange = Dev.toggle(d.options, 'redrawOnChange')));
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Scope', (dev) => {
      const scope = (scope: Scope) => {
        dev.button((btn) => {
          btn
            .label(scope)
            .right((e) => (e.state.scope === scope ? `←` : ''))
            .enabled((e) => true)
            .onClick((e) => state.change((d) => (local.scope = d.scope = scope)));
        });
      };
      scope('all');
      scope('one');
      scope('none');
      dev.hr(-1, 5);
      scope('error');
      dev.hr(-1, 5);
      dev.row(async (e) => {
        const styles = {
          base: css({ fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6 }),
          empty: css({ display: 'grid', placeItems: 'center' }),
          bullet: css({ color: COLORS.MAGENTA, opacity: 0.4 }),
        };
        const uris = getUris(e.state.scope);
        const elUris = uris.map((uri, i) => (
          <div key={uri}>
            <span {...styles.bullet}>{`${i + 1}.`}</span> <span>{`${uri}`}</span>
          </div>
        ));
        const elEmpty = elUris.length === 0 && <div {...styles.empty}>{'(empty)'}</div>;
        return <div {...styles.base}>{elEmpty || elUris}</div>;
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.boolean((btn) => {
        const value = (state: T) => !!state.loadDelay;
        btn
          .label((e) => (value(e.state) ? `load delay: ${LOAD_DELAY}ms` : 'load delay: (none)'))
          .value((e) => value(e.state))
          .onClick(async (e) => {
            await e.change((d) => (local.loadDelay = Dev.toggle(d, 'loadDelay')));
            _loadDelay = local.loadDelay ? LOAD_DELAY : 0;
          });
      });
      dev.hr(-1, 5);
      dev.button([`delete database: "${db.name}"`, '💥'], async (e) => {
        await e.state.change((d) => (d.reload = true));
        await TestDb.Spec.deleteDatabase();
      });
    });
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .padding(0)
      .render((e) => {
        return <RepoList model={model} />;
      });
  });
});
