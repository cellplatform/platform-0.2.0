import { Dev, type t } from '../../test.ui';
import { PlayButton } from '.';

const DEFAULTS = PlayButton.DEFAULTS;

type T = { props: t.PlayButtonProps };
const initial: T = { props: {} };

export default Dev.describe('PlayButton', (e) => {
  type LocalStore = Pick<t.PlayButtonProps, 'status' | 'enabled' | 'spinning' | 'size'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.media.video.PlayButton');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
    status: DEFAULTS.status,
    size: DEFAULTS.size,
    spinning: DEFAULTS.spinning,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.enabled = local.enabled;
      d.props.status = local.status;
      d.props.size = local.size;
      d.props.spinning = local.spinning;
    });

    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return (
          <PlayButton
            {...e.state.props}
            onClick={(e) => {
              console.info(`⚡️ onClick`, e);
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.spinning);
        btn
          .label((e) => `spinning`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.spinning = Dev.toggle(d.props, 'spinning'))));
      });

      dev.hr(3, 15);

      const status = (status: t.PlayButtonStatus) => {
        dev.button((btn) => {
          btn
            .label(`status: “${status}”`)
            .right((e) => e.state.props.status === status && `←`)
            .onClick((e) => e.change((d) => (local.status = d.props.status = status)));
        });
      };
      status('Play');
      status('Pause');
      dev.hr(-1, 5);
      status('Replay');
    });

    dev.hr(5, 20);

    dev.section('Size', (dev) => {
      const button = (value: t.PlayButtonSize) => {
        dev.button((btn) => {
          btn
            .label(`size: ${value}`)
            .right((e) => e.state.props.size === value && `←`)
            .onClick((e) => e.change((d) => (local.size = d.props.size = value)));
        });
      };
      PlayButton.sizes.forEach(button);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'PlayButton'} data={data} expand={1} />;
    });
  });
});
