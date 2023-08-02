import { Dev, type t, css } from '../../test.ui';
import { VideoDiagram } from '.';
import { EdgePosition, Vimeo, Slider, Video } from './common';
import { ScalePlacement } from './-SPEC.ScalePlacement';

type T = { props: t.VideoDiagramProps };
const initial: T = { props: {} };

export default Dev.describe('VideoDiagram', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
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

    dev.section('Video', (dev) => {
      dev.row((e) => <ScalePlacement />);
      dev.hr(0, 5);
      dev.textbox((txt) => {
        txt
          .label((e) => 'Video Source (ID)')
          .placeholder('eg. Vimeo number')
          .value((e) => '')
          .onChange((e) => {})
          .onEnter((e) => {});
      });
    });

    dev.hr(5, 20);

    dev.section('Image', (dev) => {
      dev.row((e) => <ScalePlacement />);
      dev.hr(0, 5);
      dev.textbox((txt) => {
        txt
          .label((e) => 'Image Source')
          .placeholder('eg. domain.com/image.png')
          .value((e) => '')
          .onChange((e) => {})
          .onEnter((e) => {});
      });
    });

    dev.hr(5, 20);

    dev.TODO();
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      // dev.row((e) => <Video.PlayBar />);

      const data = e.state;
      return (
        <div>
          <Video.PlayBar style={{ marginBottom: 10 }} />
          <Dev.Object name={'VideoDiagram'} data={data} expand={1} />
        </div>
      );
    });
  });
});
