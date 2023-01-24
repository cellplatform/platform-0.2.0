import { Dev } from '../../test.ui';
import { YouTube, YouTubeProps } from '.';

type T = { props: YouTubeProps };
const initial: T = {
  props: {
    width: 550,
    height: 315,
  },
};

export default Dev.describe('YouTube', (e) => {
  type Local = { autoLoad: boolean };
  const local = Dev.LocalStorage<Local>('dev:sys.ui.video').object({ autoLoad: false });

  const load = (props: YouTubeProps) => {
    props.id = 'URUJD5NEXC8';
    props.start = 39;
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    if (local.autoLoad) {
      await state.change((d) => load(d.props));
    }

    ctx.subject
      //
      .display('grid')
      .render<T>((e) => <YouTube {...e.state.props} />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);

    dev.boolean((btn) =>
      btn
        .label('auto load')
        .value(() => local.autoLoad)
        .onClick((e) => {
          local.autoLoad = !local.autoLoad;
          e.value(local.autoLoad);
        }),
    );

    dev.hr();

    dev.button('load', (e) => {
      e.change(({ props }) => load(props));
    });
  });
});
