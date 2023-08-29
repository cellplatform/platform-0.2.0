import { Info } from '.';
import { Delete, Dev, Hash, Time, appId, walletConnectId, type t } from '../../test.ui';

type T = {
  props: t.InfoProps;
  privy?: t.PrivyInterface;
  status?: t.AuthStatus;
  signature?: string;
};
const initial: T = { props: {} };
const DEFAULTS = Info.DEFAULTS;

/**
 * Spec
 * https://docs.privy.io/
 */
const name = Info.displayName ?? '⚠️';
export default Dev.describe(name, (e) => {
  type LocalStore = { selectedFields?: t.InfoField[] } & Pick<t.InfoProps, 'useAuthProvider'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.driver.auth.privy.Info');
  const local = localstore.object({
    selectedFields: DEFAULTS.fields.default,
    useAuthProvider: DEFAULTS.useAuthProvider,
  });

  const State = {
    props(state: T): t.InfoProps {
      const data: t.InfoData = { provider: { appId, walletConnectId } };
      return { ...state.props, data };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.margin = 10;
      d.props.fields = local.selectedFields;
      d.props.useAuthProvider = local.useAuthProvider;
    });

    ctx.debug.width(380);
    ctx.subject
      .backgroundColor(1)
      .size([320, null])
      .display('grid')
      .render<T>((e) => {
        const props = State.props(e.state);
        return (
          <Info
            {...props}
            onChange={(e) => {
              console.info(`⚡️ onChange`, e);
              state.change((d) => {
                d.status = e.status;
                d.privy = e.privy;
              });
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
            style={{ Margin: [10, 40, 10, 30] }}
            all={DEFAULTS.fields.all}
            selected={props.fields}
            onClick={(ev) => {
              const fields =
                ev.action === 'Reset:Default'
                  ? DEFAULTS.fields.default
                  : (ev.next as t.InfoProps['fields']);
              dev.change((d) => (d.props.fields = fields));
              local.selectedFields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.useAuthProvider);
        btn
          .label((e) => `useAuthProvider`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.useAuthProvider = Dev.toggle(d.props, 'useAuthProvider'))),
          );
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button((btn) => {
        const enabled = (state: T) => state.status?.user?.wallet?.walletClientType === 'privy';
        btn
          .label(`sign message`)
          .right((e) => (enabled(e.state) ? `privy` : ''))
          .enabled((e) => enabled(e.state))
          .onClick(async (e) => {
            const { privy, status } = state.current;
            if (!privy || !status) return;

            const hash = Hash.sha256(state.current, { prefix: true });
            const message = `The hash of the current state is\n${hash}`;

            try {
              const signature = await privy.signMessage(message, {
                title: 'My Message Title',
                description: `Sign to attest that you have seen the current state`,
                buttonText: `Sign Message`,
              });
              await e.change((d) => (d.signature = signature));
            } catch (error) {
              console.log('error', error);
            }
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const user = e.state.status?.user as any;
      if (user) {
        const date = Time.day(user.createdAt).format('YYYY-MM-DD hh:mm A');
        user.createdAt = date;
      }

      const data = {
        props: e.state.props,
        status: e.state.status,
        'status:user': user,
        signature: Hash.shorten(e.state.signature ?? '', 4),
      };

      return <Dev.Object name={name} data={Delete.empty(data)} expand={1} />;
    });
  });
});
