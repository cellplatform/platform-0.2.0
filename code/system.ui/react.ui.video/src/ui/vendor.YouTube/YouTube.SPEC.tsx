import { YouTube, YouTubeProps } from '.';
import { css, Dev, TextInput } from '../../test.ui';

const Wrangle = YouTube.Wrangle;

type T = { props: YouTubeProps; debug: { url?: string } };
const initial: T = {
  props: { width: 550, height: 315 },
  debug: {},
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

    dev.title('Load');

    const loadUrl = (title: string, url: string) => {
      dev.button(`load: ${title}`, async (e) => {
        const { id, start } = Wrangle.fromUrl(url);
        dev.change((d) => {
          d.props.id = id;
          d.props.start = start;
        });
      });
    };

    loadUrl('"cell" at `39s`', 'https://www.youtube.com/watch?v=URUJD5NEXC8&t=39s');
    loadUrl('baby elephant', 'https://www.youtube.com/watch?v=nlyYDuSdU38');

    dev.hr();

    dev.title('Paste Address');
    dev.row((e) => {
      const styles = {
        base: css({}),
      };

      const processUrl = async () => {
        const { id, start } = YouTube.Wrangle.fromUrl(e.state.debug.url);
        if (id) {
          await dev.change((d) => {
            d.props.id = id;
            d.props.start = start;
          });
        }
      };

      return (
        <div {...styles.base}>
          <TextInput
            value={e.state.debug.url}
            placeholder={'YouTube (URL)'}
            placeholderStyle={{ opacity: 0.3, italic: true }}
            onChanged={(e) => dev.change((d) => (d.debug.url = e.to))}
            onEnter={processUrl}
          />
        </div>
      );
    });
  });
});
