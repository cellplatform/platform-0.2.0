import { Dev, type t } from '../../test.ui';
import { PlayBar } from '.';
import { VideoPlayer } from '../ui.VideoPlayer';
import { SAMPLE } from '../ui.VideoPlayer/-dev/-Sample.mjs';

const DEFAULTS = PlayBar.DEFAULTS;

type T = {
  props: t.PlayBarProps;
  debug: { devBg?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('PlayBar', (e) => {
  /**
   * LocalStorage
   */
  type LocalStore = Pick<T['debug'], 'devBg'> & Pick<t.PlayBarProps, 'enabled'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.PlayBar');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
    devBg: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.enabled = local.enabled;
      d.debug.devBg = local.devBg;
    });

    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        ctx.subject.backgroundColor(debug.devBg ? 1 : 0);
        const margin = debug.devBg ? 5 : 0;

        return <PlayBar {...e.state.props} style={{ margin }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      const { props } = e.state;
      return <VideoPlayer video={SAMPLE.VIMEO.Tubes} enabled={props.enabled} borderRadius={10} />;
    });

    dev.hr(0, 15);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.devBg);
        btn
          .label((e) => `background`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.devBg = Dev.toggle(d.debug, 'devBg'))));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'PlayBar'} data={data} expand={1} />;
    });
  });
});
