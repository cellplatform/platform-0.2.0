import { Info } from '.';
import { AuthEnv, Delete, Dev, Hash, Time, type t } from '../../test.ui';

type T = {
  props: t.InfoProps;
  privy?: t.PrivyInterface;
  status?: t.AuthStatus;
  accessToken?: string;
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
  type LocalStore = { selectedFields?: t.InfoField[]; selectedChain?: t.EvmChainName } & Pick<
    t.InfoProps,
    'enabled' | 'useAuthProvider' | 'clipboard'
  >;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.auth.privy.Info');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
    selectedFields: DEFAULTS.fields.default,
    useAuthProvider: DEFAULTS.useAuthProvider,
    selectedChain: DEFAULTS.data.chain!.selected,
    clipboard: DEFAULTS.clipboard,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.enabled = local.enabled;
      d.props.fields = local.selectedFields;
      d.props.clipboard = local.clipboard;
      d.props.useAuthProvider = local.useAuthProvider;

      d.props.data = {
        provider: AuthEnv.provider,
        chain: {
          selected: local.selectedChain,
          onSelected(e) {
            console.info(`⚡️ onSelected`, e);
            state.change((d) => (d.props.data!.chain!.selected = e.chain));
            local.selectedChain = e.chain;
          },
        },
      };
    });

    ctx.debug.width(380);
    ctx.subject
      .backgroundColor(1)
      .size([360, null])
      .display('grid')
      .render<T>((e) => {
        return (
          <Info
            {...e.state.props}
            margin={24}
            onReady={(e) => console.info(`⚡️ onReady`, e)}
            onChange={(e) => {
              const accessToken = Hash.shorten(e.accessToken ?? '', 7);
              console.info(`⚡️ onChange`, { ...e, accessToken });
              state.change((d) => {
                d.status = e.status;
                d.privy = e.privy;
                d.accessToken = accessToken;
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

    dev.section('Field Samples', (dev) => {
      const button = (label: string, fn?: () => t.InfoField[]) => {
        dev.button((btn) => {
          btn
            .label(label)
            .enabled((e) => true)
            .onClick((e) => {
              if (!fn) return;
              e.change((d) => (local.selectedFields = d.props.fields = fn()));
            });
        });
      };

      button('wallet view', () => ['Auth.Login', 'Auth.Link.Wallet', 'Wallet.List']);
      button('wallet view (chain selector)', () => [
        'Auth.Login',
        'Auth.Link.Wallet',
        'Wallet.List',
        'Chain.List',
        'Chain.List.Title',
      ]);
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.useAuthProvider);
        btn
          .label((e) => `useAuthProvider`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.useAuthProvider = Dev.toggle(d.props, 'useAuthProvider'))),
          );
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.clipboard);
        btn
          .label((e) => `clipboard`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.clipboard = Dev.toggle(d.props, 'clipboard'))));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button((btn) => {
        const enabled = (state: T) => state.status?.user?.wallet?.walletClientType === 'privy';
        btn
          .label(`sign message`)
          .right((e) => (enabled(e.state) ? `(privy)` : ''))
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
              await e.change((d) => (d.signature = Hash.shorten(signature ?? '', 4)));
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
        signature: e.state.signature,
        accessToken: e.state.accessToken,
      };

      return <Dev.Object name={name} data={Delete.empty(data)} expand={1} />;
    });
  });
});
