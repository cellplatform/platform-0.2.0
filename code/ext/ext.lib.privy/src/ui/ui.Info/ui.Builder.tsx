import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useRef, useState } from 'react';

import { Wrangle } from './Wrangle';
import { DEFAULTS, Hash, Keyboard, Pkg, PropList, rx, useMouse, type t } from './common';
import { Field } from './field';

export const Builder: React.FC<t.InfoProps> = (props) => {
  const {
    theme,
    enabled = DEFAULTS.enabled,
    clipboard = DEFAULTS.clipboard,
    data = DEFAULTS.data,
  } = props;
  const fields = PropList.fields(props.fields, DEFAULTS.fields.default);

  const refreshRef$ = useRef<rx.Subject<void>>(new rx.Subject());
  const refresh$ = refreshRef$.current;

  const keyboard = Keyboard.useKeyboardState();
  const mouse = useMouse();
  const privy = usePrivy();
  const { wallets } = useWallets();
  const [ready, setReady] = useState(false);

  const [, setRedraw] = useState(0);
  const refresh = () => {
    setRedraw((prev) => prev + 1);
    refreshRef$.current.next();
  };

  const modifiers = {
    is: { over: mouse.is.over },
    keys: keyboard.current.modifiers,
  } as const;

  const user = privy.user;
  const phone = user?.phone?.number;
  const provider = data.provider;

  const copyable = (label: string, value?: string): t.PropListItem => {
    return {
      label,
      value: {
        body: value ?? '-',
        clipboard: clipboard && enabled ? value && value : false,
      },
    };
  };

  const c: t.InfoFieldArgs = { privy, data, enabled, theme, fields, modifiers };
  const shorten = (val?: string, length = 4) => Hash.shorten(val ?? '-', length);

  const items = PropList.builder<t.InfoField>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => Field.moduleVerify(c))
    .field('AccessToken', () => Field.accessToken(c))
    .field('Id.User', () => copyable('User', user?.id))
    .field('Id.User.Phone', () => user && copyable('Phone', phone))
    .field('Id.App.Privy', copyable('Privy App', `id:${shorten(provider?.appId, 4)}`))
    .field(
      'Id.App.WalletConnect',
      copyable('WalletConnect Project', `id:${shorten(provider?.walletConnectId, 4)}`),
    )
    .field('Login', () => Field.login(c))
    .field('Link.Wallet', () => user && Field.linkWallet({ ...c, wallets }))
    .field('Link.Farcaster', () => user && Field.linkFarcaster(c))
    .field('Wallet.List', () => Field.walletsList({ ...c, wallets, refresh$ }))
    .field('Chain.List', () => Field.chainList({ privy, data, enabled, modifiers, fields, theme }))
    .field('Refresh', () => Field.refresh({ ...c, wallets, refresh }))
    .items(fields);

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

  return (
    <PropList
      title={PropList.Info.title(props)}
      items={items}
      width={PropList.Info.width(props)}
      defaults={{ clipboard: false }}
      margin={props.margin}
      theme={theme}
      style={props.style}
      onMouseEnter={mouse.handlers.onMouseEnter}
      onMouseLeave={mouse.handlers.onMouseLeave}
    />
  );
};
