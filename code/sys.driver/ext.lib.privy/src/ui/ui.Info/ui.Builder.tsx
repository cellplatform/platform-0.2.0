import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useRef, useState } from 'react';

import { DEFAULTS, Hash, Keyboard, Pkg, PropList, rx, useMouse, type t } from './common';
import { Field } from './field';
import { Wrangle } from './u';
import { useFarcaster } from './use.Farcaster';

const DEF = DEFAULTS.props;
const short = (val?: string, length = 4) => Hash.shorten(val ?? '-', length);

export const Builder: React.FC<t.InfoProps> = (props) => {
  const { enabled = true, clipboard = DEF.clipboard, data = DEF.data, theme } = props;
  const fields = PropList.fields(props.fields, DEFAULTS.fields.default);

  const refreshRef$ = useRef<rx.Subject<void>>(new rx.Subject());
  const refresh$ = refreshRef$.current;

  const [ready, setReady] = useState(false);
  const keyboard = Keyboard.useKeyboardState();
  const fc = useFarcaster({ data });
  const mouse = useMouse();
  const privy = usePrivy();
  const { wallets } = useWallets();

  const [, setRedraw] = useState(0);
  const refresh = () => {
    setRedraw((n) => n + 1);
    refreshRef$.current.next();
  };

  const user = privy.user;
  const phone = user?.phone?.number;
  const provider = data.provider;
  const modifiers: t.InfoFieldModifiers = {
    is: { over: mouse.is.over },
    keys: keyboard.current.modifiers,
  };
  const ctx: t.InfoFieldArgs = { privy, data, enabled, theme, fields, modifiers };

  const copyable = (label: string, value?: string): t.PropListItem => {
    const canCopy = !!(clipboard && enabled && value ? value : false);
    return {
      label,
      value: {
        body: value ?? '-',
        onClick:
          canCopy &&
          ((e) => {
            navigator.clipboard.writeText(String(value));
            e.message('copied');
          }),
      },
    };
  };

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const run = async () => {
      const status = Wrangle.toStatus(privy);
      const accessToken = (await privy.getAccessToken()) || undefined;
      const args: t.InfoStatusHandlerArgs = { status, privy, wallets, accessToken };
      props.onChange?.(args);
      if (!ready && privy.ready) {
        props.onReady?.(args);
        setReady(true);
      }
    };
    run();
  }, [Wrangle.privyDeps(privy), ready]);

  const items = PropList.builder<t.InfoField>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => Field.moduleVerify(ctx))
    .field('AccessToken', () => Field.accessToken(ctx))
    .field('Id.User', () => copyable('User', user?.id))
    .field('Id.User.Phone', () => user && copyable('Phone', phone))
    .field('Id.App.Privy', copyable('Privy App', `id:${short(provider?.appId, 4)}`))
    .field(
      'Id.App.WalletConnect',
      copyable('WalletConnect Project', `id:${short(provider?.walletConnectId, 4)}`),
    )
    .field('Login', () => Field.login(ctx))
    .field('Wallet.Link', () => user && Field.walletLink({ ...ctx, wallets }))
    .field('Wallet.List', () => Field.walletsList({ ...ctx, wallets, refresh$ }))
    .field('Chain.List', () => Field.chainList({ privy, data, enabled, modifiers, fields, theme }))
    .field('Farcaster', () => user && Field.farcaster({ ...ctx, ...fc }))
    .field('Refresh', () => Field.refresh({ ...ctx, wallets, refresh }))
    .items(fields);

  return (
    <PropList
      loading={!ready}
      title={PropList.Info.title(props)}
      items={items}
      width={PropList.Info.width(props)}
      margin={props.margin}
      theme={theme}
      style={props.style}
      onMouseEnter={mouse.handlers.onMouseEnter}
      onMouseLeave={mouse.handlers.onMouseLeave}
    />
  );
};
