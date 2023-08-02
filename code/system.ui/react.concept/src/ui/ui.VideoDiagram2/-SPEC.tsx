import { Dev, type t, css } from '../../test.ui';
import { VideoDiagram } from '.';
import { EdgePosition, Vimeo } from './common';

type T = { props: t.VideoDiagramProps };
const initial: T = { props: {} };

export default Dev.describe('VideoDiagram', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <VideoDiagram {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <div {...css({ display: 'grid', placeItems: 'center' })}>
          <EdgePosition.Selector
            // selected={e.state.props.slug?.video?.position}
            onSelect={(e) => {
              state.change((d) => {
                // const id = DEFAULTS.sample.id;
                // const slug = d.props.slug ?? (d.props.slug = { id });
                // const video = slug.video ?? (slug.video = {});
                // video.position = local.videoPosition = e.pos;
              });
            }}
          />
        </div>
      );
    });

    dev.hr(5, 20);

    dev.TODO();
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'VideoDiagram'} data={data} expand={1} />;
    });
  });
});
