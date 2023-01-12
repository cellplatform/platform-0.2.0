import { Dev, css, expect, Lorem } from '../../test.ui';
import { Card, CardProps } from '.';

type T = { props: CardProps };
const initial: T = {
  props: {
    padding: [25, 30],
    userSelect: true,
    shadow: true,
    showAsCard: true,
  },
};

export default Dev.describe('Card', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.host.tracelineColor(-0.05);
    ctx.component
      .display('grid')
      .size(450, null)
      .render<T>((e) => {
        const { props } = e.state;

        const styles = {
          base: css({}),
          body: css({
            backgroundColor: 'rgba(255, 0, 0, 0.05)' /* RED */,
            lineHeight: 1.3,
          }),
        };

        const elBody = <div {...styles.body}>{Lorem.toString()}</div>;
        return (
          <Card {...props} onClick={() => console.info('⚡️ onClick')}>
            {elBody}
          </Card>
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.ObjectView name={'info'} data={e.state} expand={3} />);

    dev
      .title('Properties')
      .boolean((btn) =>
        btn
          .label('userSelect')
          .value((e) => Boolean(e.state.props.userSelect))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'userSelect'))),
      )
      .boolean((btn) =>
        btn
          .label('shadow')
          .value((e) => Boolean(e.state.props.shadow))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'shadow'))),
      )
      .boolean((btn) =>
        btn
          .label('showAsCard')
          .value((e) => Boolean(e.state.props.showAsCard))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'showAsCard'))),
      )
      .boolean((btn) =>
        btn
          .label('padding')
          .value((e) => Boolean(e.state.props.padding))
          .onClick((e) =>
            e.change(({ props }) => {
              props.padding = Boolean(props.padding) ? undefined : initial.props.padding;
            }),
          ),
      )
      .hr()
      .boolean((btn) =>
        btn
          .label('background.color (opacity: 0.5)')
          .value((e) => e.state.props.background?.color === 0.5)
          .onClick((e) =>
            e.change(({ props }) => {
              props.background = { ...Util.toBackground(props), color: e.current ? 1 : 0.5 };
            }),
          ),
      )
      .boolean((btn) =>
        btn
          .label('background.blur (8px)')
          .value((e) => e.state.props.background?.blur === 8)
          .onClick((e) =>
            e.change(({ props }) => {
              props.background = { ...Util.toBackground(props), blur: e.current ? 8 : undefined };
            }),
          ),
      );
  });
});

/**
 * [Helpers]
 */

const Util = {
  toBackground(props: CardProps) {
    return props.background || (props.background = {});
  },
};
