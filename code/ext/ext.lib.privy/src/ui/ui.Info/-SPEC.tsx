import { Info } from '.';
import { AuthEnv, Delete, Dev, Hash, Pkg, PropList, Time, type t } from '../../test.ui';

type P = t.InfoProps;
type T = {
  props: P;
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
const name = Info.displayName ?? 'Unknown';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<P, 'fields' | 'enabled' | 'clipboard' | 'theme'> & {
    selectedChain?: t.EvmChainName;
  };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.ui.${name}`);
  const local = localstore.object({
    theme: undefined,
    enabled: DEFAULTS.enabled,
    fields: DEFAULTS.fields.default,
    selectedChain: DEFAULTS.data.chain!.selected,
    clipboard: DEFAULTS.clipboard,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.enabled = local.enabled;
      d.props.fields = local.fields;
      d.props.clipboard = local.clipboard;

      d.props.data = {
        provider: AuthEnv.provider,
        accessToken: {},
        wallet: { list: { title: 'Public Key' } },
        chain: {
          selected: local.selectedChain,
          onSelected(e) {
            console.info(`⚡️ onSelected`, e);
            state.change((d) => (d.props.data!.chain!.selected = e.chain));
            local.selectedChain = e.chain;
          },
        },
        farcaster: {
          onClick(e) {
            console.info(`⚡️ farcaster.onClick`, e);
          },
        },
      };
    });

    ctx.debug.width(380);
    ctx.subject
      .size([360, null])
      .display('grid')
      .render<T>((e) => {
        const { props } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);

        return (
          <Info
            {...props}
            margin={24}
            onReady={(e) => console.info(`⚡️ onReady`, e)}
            onChange={(e) => {
              console.info(`⚡️ onChange`, e);
              state.change((d) => {
                d.status = e.status;
                d.privy = e.privy;
                d.props.data!.accessToken!.jwt = e.accessToken;
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
            all={DEFAULTS.fields.all}
            selected={props.fields}
            onClick={(ev) => {
              const fields =
                ev.action === 'Reset:Default'
                  ? DEFAULTS.fields.default
                  : (ev.next as t.InfoField[]);
              dev.change((d) => (d.props.fields = fields));
              local.fields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });

    dev.section('Common States', (dev) => {
      const button = (label: string, fn?: () => t.InfoField[]) => {
        dev.button((btn) => {
          btn
            .label(label)
            .enabled((e) => true)
            .onClick((e) => {
              if (!fn) return;

              const fields = {
                prev: PropList.Wrangle.fields(state.current.props.fields),
                next: fn(),
              } as const;

              const value = e.is.meta ? [...fields.prev, ...fields.next] : fields.next;
              e.change((d) => (local.fields = d.props.fields = value));
            });
        });
      };

      button('all', () => DEFAULTS.fields.all);
      button('common', () => [
        'Login',
        'Login.SMS',
        'Login.Farcaster',
        'Id.User',
        'Id.User.Phone',
        'Link.Farcaster',
        'Link.Wallet',
        'Wallet.List',
        'Wallet.List.Title',
        'Refresh',
      ]);
      dev.hr(-1, 5);
      button('wallet view', () => [
        'Login',
        'Link.Wallet',
        'Wallet.List',
        'Wallet.List.Title',
        'Refresh',
      ]);
      button('wallet view (chain selector)', () => [
        'Login',
        'Link.Wallet',
        'Wallet.List',
        'Chain.List',
        'Chain.List.Title',
        'Refresh',
      ]);
      dev.hr(-1, 5);
      button('farcaster', () => ['Login', 'Login.SMS', 'Login.Farcaster', 'Link.Farcaster']);
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });

      dev.hr(-1, 5);

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
      };

      return <Dev.Object name={name} data={Delete.empty(data)} expand={1} />;
    });
  });
});
