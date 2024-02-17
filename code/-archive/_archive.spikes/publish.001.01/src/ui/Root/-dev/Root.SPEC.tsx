import { Dev } from '../../../test.ui';
import { Root, RootProps } from '..';

type T = { props: RootProps };
const initial: T = { props: {} };

export default Dev.describe('Root', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => <Root {...e.state.props} />);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);

    dev.title('UNDP Report - January Update');

    dev
      .TODO('Look at images within "intro" video')
      .TODO('"Start Here" video banner')
      .TODO('Video Index (make more like spotify "album/playlist" card view)')
      .TODO('Update CHANGELOG')
      .TODO('Get Rowans machine building again (revert platform-0.2.0 branch)')
      .TODO('Deploy')
      .TODO('Close out old issues')
      .TODO('Commitment Badge')
      .TODO('Timestamps addressable URL (searchParams)')
      .TODO('"Group Scale" diagram and video - as sample for "Diagram Builder" UI (SPEC)')
      .TODO(
        'Pull out "Programme" as data type (pogrammaticaly from "executing/parsing" the MD files',
      ).TODO(`
      Add time durations in:      
      - project.undp/data/4/examples-library.md`);
  });
});
