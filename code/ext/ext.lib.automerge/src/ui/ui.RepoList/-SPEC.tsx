import { RepoList } from '.';
import { Dev, TestDb, Time, WebStore, type t } from '../../test.ui';
import { SpecInfo } from './-SPEC.Info';

type T = { props: t.RepoListProps };
const name = RepoList.displayName ?? '';
const initial: T = { props: {} };

export default Dev.describe(name, async (e) => {
  const storage = TestDb.Spec.name;
  const store = WebStore.init({ storage });
  const model = await RepoList.model(store, {
    onDatabaseClick: (e) => console.info(`⚡️ onDatabaseClick`, e),
    onShareClick: (e) => console.info(`⚡️ onShareClick`, e),
  });
  const ref = RepoList.Ref(model);

  type LocalStore = Pick<t.RepoListProps, 'behaviors'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.automerge.ui.RepoList');
  const local = localstore.object({
    behaviors: RepoList.DEFAULTS.behaviors.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.behaviors = local.behaviors;
    });

    model.index.doc.events().changed$.subscribe(() => dev.redraw());

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([330, null])
      .display('grid')
      .render<T>((e) => {
        const renderCount: t.RenderCountProps = {
          prefix: 'list.render-',
          absolute: [-20, 2, null, null],
          opacity: 0.2,
        };
        return <RepoList {...e.state.props} list={model} renderCount={renderCount} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.row((e) => <SpecInfo model={model} />);

    dev.hr(5, 20);

    dev.row((e) => {
      return (
        <RepoList.Config
          selected={e.state.props.behaviors}
          onChange={(e) => {
            state.change((d) => (d.props.behaviors = e.next));
            local.behaviors = e.next;
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('ref ( ƒ )', (dev) => {
      const select = (target: t.LabelListItemTarget) => {
        const focus = true;
        Time.delay(0, () => ref.select(target, focus));
      };
      dev.button('select: first', (e) => select('First'));
      dev.button('select: last', (e) => select('Last'));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.button(`delete database: "${storage}"`, (e) => TestDb.Spec.deleteDatabases());

      dev.hr(5, 20);

      dev.button('tmp', async (e) => {
        type D = { '.meta': Meta };
        type Meta = {
          ephemeral?: boolean;
        };
        const doc = await model.store.doc.getOrCreate<D>((d) => (d['.meta'] = {}));
        console.log('doc.toObject()', doc.toObject());
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: e.state.props,
        db: storage,
        'db.index': `${model.index.db.name}[${model.index.total}]`,
        index: model.index.doc.toObject(),
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
