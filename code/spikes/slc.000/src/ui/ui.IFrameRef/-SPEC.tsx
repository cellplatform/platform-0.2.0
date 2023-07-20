import { Dev } from '../../test.ui';
import { IFrameRef, type IFrameRefProps } from '.';

const DEFAULTS = {
  LandingPage: 'https://slc-1dot1ggiz.vercel.app/',
  EUSIC: 'https://slc-eusic-ph1bc4ut7-tdb.vercel.app/',
};

type T = { props: IFrameRefProps };
const initial: T = {
  props: {
    src: DEFAULTS.LandingPage,
  },
};

export default Dev.describe('Landing.IFrame', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(350);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <IFrameRef {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section(['Load Target:', 'URL'], (dev) => {
      const target = (title: string, url: string) => {
        dev.button((btn) => {
          btn
            .label(`url → "${title}"`)
            .right((e) => (e.state.props.src === url ? `←` : ''))
            .onClick((e) =>
              e.change((d) => {
                d.props.src = url;
                d.props.title = title; // (optional meta-data context).
              }),
            );
        });
      };

      target('Root Landing Page', DEFAULTS.LandingPage);
      target('EUSIC', DEFAULTS.EUSIC);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Landing.IFrame'} data={data} expand={1} />;
    });
  });
});
