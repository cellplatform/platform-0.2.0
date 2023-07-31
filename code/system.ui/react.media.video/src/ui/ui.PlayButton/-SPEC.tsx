import { Dev, type t } from '../../test.ui';
import { PlayButton } from '.';

const DEFAULTS = PlayButton.DEFAULTS;

type T = { props: t.PlayButtonProps };
const initial: T = { props: {} };

export default Dev.describe('PlayButton', (e) => {
  type LocalStore = Pick<t.PlayButtonProps, 'status'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.media.video.PlayButton');
  const local = localstore.object({
    status: DEFAULTS.status,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.status = local.status;
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
      status('Replay');
      dev.hr(-1, 5);
      status('Spinning');
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
