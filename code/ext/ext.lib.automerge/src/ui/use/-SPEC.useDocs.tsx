import { Dev, DevReload, Pkg, TestDb, type t, css, Color } from '../../test.ui';
import { sampleCrdt } from '../ui.Info/-SPEC.crdt';
import { RepoList } from '../ui.RepoList';
import { SampleUseDocs } from './-SPEC.useDocs.views';

type Scope = 'all' | 'one' | 'none';
type T = { reload?: boolean; scope?: Scope };
const initial: T = {};

/**
 * Spec
 */
const name = 'useDocs';
export default Dev.describe(name, async (e) => {
  const db = await sampleCrdt();
  const index = db.index;
  const model = await RepoList.model(db.store, { behaviors: ['Copyable', 'Deletable'] });

  type LocalStore = Pick<T, 'scope'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ scope: 'all' });

  const getUris = (scope: Scope = 'all') => {
    if (scope === 'none') return [];
    const uris = index.doc.current.docs.map((item) => item.uri);
    return (scope === 'one' ? [uris[0]] : uris).filter(Boolean);
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.scope = local.scope;
    });

    const theme: t.CommonTheme = 'Dark';
    Dev.Theme.background(ctx, theme);
    ctx.debug.width(330);
    ctx.subject
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload) return <DevReload theme={theme} />;
        return <SampleUseDocs theme={theme} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

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
      dev.row(async (e) => {
        const styles = {
          base: css({ fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6 }),
          empty: css({ display: 'grid', placeItems: 'center' }),
        };
        const uris = getUris(e.state.scope);
        const elUris = uris.map((uri) => <div key={uri}>{uri}</div>);
        const elEmpty = elUris.length === 0 && <div {...styles.empty}>{'(empty)'}</div>;
        return <div {...styles.base}>{elEmpty || elUris}</div>;
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.button([`delete database: "${db.storage.name}"`, '💥'], async (e) => {
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
