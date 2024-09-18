import { Info } from '.';
import {
  AuthEnv,
  Cmd,
  Delete,
  Dev,
  Hash,
  Immutable,
  Json,
  PropList,
  rx,
  Time,
  type t,
} from '../../test.ui';
import { DEFAULTS } from './common';

type P = t.InfoProps;
type D = {
  privy?: t.PrivyInterface;
  status?: t.AuthStatus;
  signature?: string;
  selectedChain?: t.EvmChainName;
  accessToken?: string;
};

/**
 * Spec
 * https://docs.privy.io/
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });

  let privy: t.PrivyInterface | undefined;
  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, {})),
  } as const;

  type F = t.InfoField | undefined;
  const setFields = (fields?: F[]) => State.props.change((d) => (d.fields = fields));

  const getData = (): t.InfoData => {
    const debug = State.debug.current;
    const jwt = debug.accessToken;
    return {
      provider: AuthEnv.provider,
      accessToken: { jwt },
      wallet: { list: { label: 'Public Key' } },
      chain: {
        selected: debug.selectedChain,
        onSelected(e) {
          console.info(`⚡️ onSelected`, e);
          State.props.change((d) => (d.data!.chain!.selected = e.chain));
          State.debug.change((d) => (d.selectedChain = e.chain));
        },
      },
      farcaster: {
        cmd: fc,
        identity: {
          // fid: true,
          onClick: (e) => console.info(`⚡️ farcaster.identity.onClick`, e),
        },
        signer: {
          // forceVisible: true,
        },
      },
    };
  };

  /**
   * Commands for Farcaster.
   */
  const doc = Immutable.clonerRef({}); // NB: Default simple "cloner" immutable.
  const fc = Cmd.create<t.FarcasterCmd>(doc) as t.Cmd<t.FarcasterCmd>; // TODO: should not need the "as" cast.

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);

    const props$ = State.props.events().changed$;
    const debug$ = State.debug.events().changed$;

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.props = Json.stringify(State.props.current);
        local.debug = Json.stringify(State.debug.current);
      });

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => ctx.redraw());

    ctx.debug.width(380);
    ctx.subject
      .size([360, null])
      .display('grid')
      .render<D>(async (e) => {
        const props = State.props.current;
        Dev.Theme.background(ctx, props.theme, 1);
        return (
          <Info
            {...props}
            data={getData()}
            margin={24}
            onReady={(e) => {
              console.info(`⚡️ onReady`, e);
            }}
            onChange={(e) => {
              console.info(`⚡️ onChange`, e);
              privy = e.privy;
              State.debug.change((d) => {
                d.status = e.status;
                d.accessToken = e.accessToken;
              });
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);

    dev.section('Fields', (dev) => {
      dev.row(() => {
        return (
          <Info.FieldSelector
            selected={State.props.current.fields}
            onClick={(e) => setFields(e.next<t.InfoField>(DEFAULTS.props.fields))}
          />
        );
      });
    });

    dev.section('Common States', (dev) => {
      const commonFields = (label: string, fn?: () => t.InfoField[]) => {
        dev.button((btn) => {
          btn.label(label).onClick((e) => {
            if (!fn) return;

            const props = State.props.current;
            const fields = {
              prev: PropList.Wrangle.fields(props.fields),
              next: fn(),
            } as const;

            const value = e.is.meta ? [...fields.prev, ...fields.next] : fields.next;
            setFields(value);
          });
        });
      };

      commonFields('all', () => DEFAULTS.fields.all);
      commonFields('common', () => [
        'Login',
        'Login.SMS',
        'Login.Farcaster',
        'Id.User',
        'AccessToken',
        'Id.User.Phone',
        'Farcaster',
        'Wallet.Link',
        'Wallet.List',
        'Wallet.List.Title',
        'Refresh',
      ]);
      dev.hr(-1, 5);
      commonFields('wallet view', () => [
        'Login',
        'Wallet.Link',
        'Wallet.List',
        'Wallet.List.Title',
        'Refresh',
      ]);
      commonFields('wallet view (chain selector)', () => [
        'Login',
        'Wallet.Link',
        'Wallet.List',
        'Chain.List',
        'Chain.List.Title',
        'Refresh',
      ]);
      dev.hr(-1, 5);
      commonFields('farcaster', () => [
        'Login',
        'Login.SMS',
        'Login.Farcaster',
        'Farcaster',
        'Wallet.List',
        'Wallet.List.Title',
        'Refresh',
      ]);

      dev.hr(-1, 5);

      dev.button('filter: !phone', () => {
        const props = State.props.current;
        let fields = (props.fields ?? []).filter(Boolean) as t.InfoField[];
        setFields(fields.filter((e) => e !== 'Id.User.Phone'));
      });
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.props);
      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const state = State.props;
        const current = () => !!state.current.enabled;
        btn
          .label(() => `enabled`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'enabled')));
      });

      dev.boolean((btn) => {
        const state = State.props;
        const current = () => !!state.current.clipboard;
        btn
          .label(() => `clipboard`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'clipboard')));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);

      dev.button((btn) => {
        const state = State.debug;
        const isEnabled = () => state.current.status?.user?.wallet?.walletClientType === 'privy';
        btn
          .label(`sign message`)
          .right(() => (isEnabled() ? `(privy)` : ''))
          .enabled(() => isEnabled())
          .onClick(async () => {
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
              State.debug.change((d) => (d.signature = Hash.shorten(signature ?? '', 4)));
            } catch (error) {
              console.log('signing error:', error);
            }
          });
      });

      dev.hr(-1, 5);

      dev.button(['tmp: send cast', 'farcaster'], async () => {
        const method = fc.method('send:cast', 'send:cast:res');
        const text = 'hello world 👋';
        console.log('send cast:', text);
        const res = await method({ text }).promise();
        console.log('res', res);
      });
         * TODO 🐷
         */
        // const accessToken =
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>((e) => {
      const props = State.props.current;

      const user = e.state.status?.user as any;
      if (user) {
        const date = Time.day(user.createdAt).format('YYYY-MM-DD hh:mm A');
        user.createdAt = date;
      }

      const data = {
        props,
        status: e.state.status,
        'status:user': user,
        signature: e.state.signature,
      };

      return <Dev.Object name={name} data={Delete.empty(data)} expand={1} />;
    });
  });
});
