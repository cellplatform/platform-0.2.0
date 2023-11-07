import { RepoList } from '.';
import { Button, Dev, Time, WebStore, type t } from '../../test.ui';
import { Info } from '../ui.Info';

type T = { props: t.RepoListProps };
const name = RepoList.displayName ?? '';

export default Dev.describe(name, (e) => {
  const store = WebStore.init();
  let ref: t.RepoListRef;
  const initial: T = { props: { store } };

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
          absolute: [-20, 2, null, null],
          opacity: 0.2,
          prefix: 'list.render-',
        };
        return (
          <RepoList
            {...e.state.props}
            renderCount={renderCount}
            onReady={(e) => {
              console.info(`⚡️ RepoList.onReady`, e);
              ref = e.ref;
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.row((e) => <Info fields={['Module', 'Component']} data={{ component: { name } }} />);
    dev.hr(5, 20);

    dev.section('Ref ( ƒ )', (dev) => {
      dev.button((btn) => {
        const onClick = (target: t.LabelListItemTarget) => Time.delay(0, () => ref.select(target));
        const select = (label: string, target: t.LabelListItemTarget) => {
          return <Button label={label} style={{ marginLeft: 8 }} onClick={() => onClick(target)} />;
        };

        btn
          .label(`select`)
          .right((e) => {
            return (
              <div>
                {select('first', 'First')}
                {select('last', 'Last')}
              </div>
            );
          })
          .enabled((e) => true)
          .onClick((e) => onClick('First'));
      });
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
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
