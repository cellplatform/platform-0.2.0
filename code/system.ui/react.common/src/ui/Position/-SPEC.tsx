import { Dev, type t, css } from '../../test.ui';
import { Position } from '.';

const DEFAULTS = Position.DEFAULTS;

type T = { props: t.PositionProps };
const initial: T = { props: {} };

export default Dev.describe('Position', (e) => {
  type LocalStore = Pick<t.PositionProps, 'position'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.Position');
  const local = localstore.object({
    position: DEFAULTS.position,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.position = local.position;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const styles = {
          base: css({ fontSize: 30 }),
        };
        return (
          <Position {...e.state.props}>
            <div {...styles.base}>{`🌳`}</div>
          </Position>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO().hr(5, 20);

    dev.row((e) => {
      return (
        <div {...css({ display: 'grid', placeItems: 'center' })}>
          <Position.Selector
            selected={e.state.props.position}
            onSelect={(e) => {
              state.change((d) => (d.props.position = e.pos));
              local.position = e.pos;
            }}
          />
        </div>
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Position'} data={data} expand={1} />;
    });
  });
});
