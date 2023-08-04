import { SplitLayout } from '.';
import { COLORS, Color, Dev, css, type t } from '../../test.ui';

const DEFAULTS = SplitLayout.DEFAULTS;

type T = { props: t.SplitLayoutProps };
const initial: T = { props: {} };
const name = SplitLayout.displayName ?? '';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.SplitLayoutProps, 'debug' | 'split' | 'axis'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.SplitHorizonLayout');
  const local = localstore.object({
    split: DEFAULTS.split,
    axis: DEFAULTS.axis,
    debug: true,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.debug = local.debug;
      d.props.axis = local.axis;
      d.props.split = local.split;
      d.props.splitMin = 0.1;
      d.props.splitMax = 0.9;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return (
          <SplitLayout {...e.state.props}>
            <Sample />
            <Sample />
          </SplitLayout>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.hr(0, 5);
      dev.row((e) => {
        return (
          <SplitLayout.PropEditor
            {...e.state.props}
            onChange={(e) => {
              state.change((d) => {
                local.split = d.props.split = e.split;
                local.axis = d.props.axis = e.axis;
              });
            }}
          />
        );
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.debug);
        btn
          .label((e) => `debug`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debug = Dev.toggle(d.props, 'debug'))));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const props = e.state.props;
      const split = Number(SplitLayout.percent(e.state.props).toFixed(2));
      const data = {
        props: { ...props, split },
      };
      return <Dev.Object name={name} data={data} expand={2} />;
    });
  });
});

/**
 * Sample Components
 */
export type SampleProps = {
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      border: `dashed 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      borderRadius: 5,
      margin: 15,
      padding: 5,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷`}</div>
    </div>
  );
};
