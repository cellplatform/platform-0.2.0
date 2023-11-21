import { RepoList } from '.';
import { Dev, TestDb, Time, WebStore, type t } from '../../test.ui';
import { SpecInfo } from './-SPEC.Info';

type T = { props: t.RepoListProps };
const name = RepoList.displayName ?? '';
const initial: T = { props: {} };

export default Dev.describe(name, async (e) => {
  const storage = TestDb.Spec.name;
  const store = WebStore.init({ storage });
  const model = await RepoList.model(store);
  const ref = RepoList.Ref(model);

  type LocalStore = t.RepoListBehavior;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.automerge.ui.RepoList');
  const local = localstore.object({
    focusOnArrowKey: true,
    focusOnLoad: false,
  });

  const State = {
    behavior(props: t.RepoListProps): t.RepoListBehavior {
      return props.behavior || (props.behavior = {});
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      const b = State.behavior(d.props);
      b.focusOnArrowKey = local.focusOnArrowKey;
      b.focusOnLoad = local.focusOnLoad;
    });

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

    dev.section('ref ( ƒ )', (dev) => {
      const select = (target: t.LabelListItemTarget) => {
        const focus = true;
        Time.delay(0, () => ref.select(target, focus));
      };
      dev.button('select: first', (e) => select('First'));
      dev.button('select: last', (e) => select('Last'));
    });

    dev.hr(5, 20);

    dev.section('Props: Load Behavior', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.behavior?.focusOnArrowKey);
        btn
          .label((e) => `focusOnArrowKey`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => {
              const b = State.behavior(d.props);
              local.focusOnArrowKey = Dev.toggle(b, 'focusOnArrowKey');
            }),
          );
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.behavior?.focusOnLoad);
        btn
          .label((e) => `focusOnLoad`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => {
              const b = State.behavior(d.props);
              local.focusOnLoad = Dev.toggle(b, 'focusOnLoad');
            }),
          );
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.button(`delete database: "${storage}"`, async (e) => {
        await TestDb.Spec.deleteDatabases();
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      console.log('model', model);

      const data = {
        props: e.state.props,
        db: storage,
        'db.index': `${model.index.kind}[${model.index.total}]`,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
