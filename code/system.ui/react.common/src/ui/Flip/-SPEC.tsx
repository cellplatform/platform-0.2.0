import { COLORS, css, Dev } from '../../test.ui';
import { Flip, FlipProps } from '.';

type T = {
  props: FlipProps;
  debug: { content?: boolean };
};
const initial: T = {
  props: { flipped: false },
  debug: { content: true },
};

export default Dev.describe('Flip', (e) => {
  type LocalStore = T['debug'];
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.Flip');
  const local = localstore.object({
    content: initial.debug.content,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    state.change((d) => {
      d.debug.content = local.content;
    });

    ctx.subject
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        const debug = e.state.debug;

        const styles = {
          side: css({
            padding: 10,
            backgroundColor: COLORS.WHITE,
          }),
        };

        const elFront = <div {...styles.side}>🐷 Frontside</div>;
        const elBack = (
          <div {...styles.side}>
            <div>🐷 Backside</div>
            <div>{Dev.Lorem.words(20)}</div>
          </div>
        );

        const props = {
          ...e.state.props,
          front: debug.content ? elFront : undefined,
          back: debug.content ? elBack : undefined,
        };

        return <Flip {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `flipped`)
          .value((e) => e.state.props.flipped)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'flipped'))),
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `content`)
          .value((e) => e.state.debug.content)
          .onClick((e) => e.change((d) => (local.content = Dev.toggle(d.debug, 'content')))),
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Flip'} data={data} expand={1} />;
    });
  });
});
