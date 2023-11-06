import { RepoList } from '.';
import { Dev, WebStore, type t, Time, Button } from '../../test.ui';
import { Info } from '../ui.Info';

type T = { props: t.RepoListProps };
const name = RepoList.displayName ?? '';

export default Dev.describe(name, (e) => {
  const store = WebStore.init();

  let ref: t.RepoListRef;
  const initial: T = { props: { store } };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

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
              ref = e;
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
        const select = (label: string, target: t.LabelListItemTarget) => {
          return (
            <Button
              label={label}
              style={{ marginLeft: 8 }}
              onClick={() => Time.delay(0, () => ref.select(target))}
            />
          );
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
          .onClick((e) => {});
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
