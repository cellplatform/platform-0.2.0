import { Card, CardProps } from '.';
import { css, Dev } from '../../test.ui';

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
    ctx.subject
      .display('grid')
      .size(450, null)
      .render<T>((e) => {
        const { props } = e.state;

        const styles = {
          base: css({}),
          body: css({
            backgroundColor: 'rgba(255, 0, 0, 0.03)' /* RED */,
            lineHeight: 1.3,
          }),
        };

        const elBody = <div {...styles.body}>{Dev.Lorem.toString()}</div>;
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
      .render<T>((e) => <Dev.Object name={'spec.Card'} data={e.state} expand={1} />);

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

      .button('load background', async (e) => {
        const url =
          'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80';
        const host = e.ctx.toObject().props.host;
        const current = host.backgroundImage?.url;
        e.ctx.host.backgroundImage(current ? null : { url, opacity: 0.8 });
        e.label(current ? 'load background' : 'unload background');
      })

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
          .label('background.blur (4px)')
          .value((e) => e.state.props.background?.blur === 4)
          .onClick((e) =>
            e.change(({ props }) => {
              props.background = { ...Util.toBackground(props), blur: e.current ? undefined : 4 };
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
