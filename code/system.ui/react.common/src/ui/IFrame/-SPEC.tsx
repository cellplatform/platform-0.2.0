import { Dev, type t } from '../../test.ui';
import { IFrame, DEFAULTS } from '.';

const backgroundImage = {
  url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
  opacity: 0.3,
};

type T = {
  props: t.IFrameProps;
  debug: { bgImage: boolean };
};
const initial: T = {
  props: {
    src: 'https://en.wikipedia.org/wiki/World_Wide_Web_Consortium',
    allow: 'camera; microphone',
  },
  debug: { bgImage: true },
};

export default Dev.describe('IFrame', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.host.backgroundImage(backgroundImage);

    ctx.subject
      .display('grid')
      .size('fill')
      .render<T>((e) => (
        <IFrame {...e.state.props} onLoad={(e) => console.info('⚡️ onLoad:', e)} />
      ));
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'IFrame'} data={e.state} expand={1} />);

    dev.boolean((btn) =>
      btn
        .label('host.backgroundImage')
        .value((e) => e.state.debug.bgImage)
        .onClick((e) => {
          const next = !e.state.current.debug.bgImage;
          e.change((d) => (d.debug.bgImage = next));
          e.ctx.host.backgroundImage(next ? backgroundImage : null);
        }),
    );

    dev.hr(5, 20);

    dev.section('Load', (dev) => {
      const load = (label: string, url?: string) => {
        dev.button(`src: ${label}`, (e) => e.change((d) => (d.props.src = url)));
      };

      const local = new URL(`${location.origin}${location.pathname}`);
      load('local', local.href);
      load('local?dev=...', `${local.href}?dev=sys.ui.common.Center`);
      dev.hr(-1, 5);
      load('Wikipedia: "W3C"', 'https://en.wikipedia.org/wiki/World_Wide_Web_Consortium');
      load('Wikipedia: "Foobar" mobile format', 'https://en.m.wikipedia.org/wiki/Foobar');
      load('Google (← blocked)', 'https://google.com');
      dev.hr(-1, 5);
      dev.button('srcDoc (← <html>)', (e) => {
        e.change((d) => (d.props.src = { html: '<h1>Hello 👋<h1>' }));
      });
      dev.hr(-1, 5);
      dev.button('`undefined`', (e) => e.change((d) => (d.props.src = undefined)));
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('allowFullScreen')
          .value((e) => e.state.props.allowFullScreen)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'allowFullScreen'))),
      );

      dev.boolean((btn) => {
        const label = (props: t.IFrameProps) => `loading: "${props.loading ?? DEFAULTS.loading}"`;
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
