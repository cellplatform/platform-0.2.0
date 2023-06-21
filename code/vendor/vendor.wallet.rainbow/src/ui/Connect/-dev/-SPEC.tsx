import { Connect, type ConnectProps } from '..';
import { Dev, type t } from '../../../test.ui';

const { DEFAULTS } = Connect;
const config: t.ConnectConfig = {
  appName: 'Foo',
  projectId: '4d190498d1b5bc687c6118ed29015c65',
};

type T = { props: ConnectProps };
const initial: T = {
  props: { config },
};

/**
 * Refs:
 *    https://www.rainbowkit.com/docs/
 *
 */
export default Dev.describe('Connect', (e) => {
  type LocalStore = { autoload: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:vendor.wallet.rainbow.Connect');
  const local = localstore.object({
    autoload: DEFAULTS.autoload,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.autoload = local.autoload;
    });

    ctx.host.tracelineColor(-0.03);
    ctx.subject.display('grid').render<T>((e) => {
      return <Connect {...e.state.props} />;
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const label = (state: T) => {
          const isDefault = state.props.autoload === DEFAULTS.autoload;
          return `autoload ${isDefault ? '(default)' : ''}`;
        };
        btn
          .label((e) => label(e.state))
          .value((e) => Boolean(e.state.props.autoload))
          .onClick((e) => e.change((d) => (local.autoload = Dev.toggle(d.props, 'autoload'))));
      });
    });

    dev.hr(-1, 5);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        Component: { props: e.state.props },
      };
      return <Dev.Object name={'Connect'} data={data} expand={1} />;
    });
  });
});
