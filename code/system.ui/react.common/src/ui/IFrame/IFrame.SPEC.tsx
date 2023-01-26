import { Dev } from '../../test.ui';
import { IFrame, IFrameProps } from './IFrame';

const DEFAULTS = IFrame.DEFAULTS;

type T = { props: IFrameProps; debug: { backgroundImage: boolean } };
const initial: T = {
  props: {
    src: 'https://en.wikipedia.org/wiki/World_Wide_Web_Consortium',
    allow: 'camera; microphone',
  },
  debug: { backgroundImage: false },
};

export default Dev.describe('IFrame', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .display('grid')
      .size('fill')
      .render<T>((e) => <IFrame {...e.state.props} onLoad={() => console.info('⚡️ onLoad')} />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'IFrame.spec'} data={e.state} expand={1} />);

    dev.boolean((btn) =>
      btn
        .label('host.backgroundImage')
        .value((e) => e.state.debug.backgroundImage)
        .onClick((e) => {
          const next = !e.state.current.debug.backgroundImage;
          const url =
            'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80';
          e.change((d) => (d.debug.backgroundImage = next));
          e.ctx.host.backgroundImage(next ? { url, opacity: 0.3 } : null);
        }),
    );

    dev.hr();

    dev.section('Load', (dev) => {
      const load = (label: string, url?: string) => {
        dev.button(`src: ${label}`, (e) => e.change((d) => (d.props.src = url)));
      };

      load('Wikipedia', 'https://en.wikipedia.org/wiki/World_Wide_Web_Consortium');
      load('Google (blocked)', 'https://google.com');
      dev.hr();
      dev.button('HTML (srcDoc)', (e) =>
        e.change((d) => (d.props.src = { html: '<h1>Hello 👋<h1>' })),
      );
      dev.hr();
      dev.button('`undefined`', (e) => e.change((d) => (d.props.src = undefined)));
    });

    dev.hr();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('allowFullScreen')
          .value((e) => e.state.props.allowFullScreen)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'allowFullScreen'))),
      );

      dev.boolean((btn) => {
        const label = (props: IFrameProps) => `loading: "${props.loading ?? DEFAULTS.loading}"`;
        btn
          .label((e) => label(e.state.props))
          .value((e) => (e.state.props.loading ?? DEFAULTS.loading) === DEFAULTS.loading)
          .onClick((e) =>
            e.change((d) => {
              const next = (d.props.loading ?? DEFAULTS.loading) === 'lazy' ? 'eager' : 'lazy';
              d.props.loading = next;
            }),
          );
      });
    });
  });
});
