import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useRef, useState } from 'react';

import { Wrangle } from './Wrangle';
import { DEFAULTS, Keyboard, Pkg, PropList, rx, useMouse, type t } from './common';
import { Field } from './field';

export const Builder: React.FC<t.InfoProps> = (props) => {
  const {
    theme,
    enabled = DEFAULTS.enabled,
    clipboard = DEFAULTS.clipboard,
    data = DEFAULTS.data,
  } = props;
  const fields = PropList.Wrangle.fields(props.fields, DEFAULTS.fields.default);

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
        data: value ?? '-',
        clipboard: clipboard && enabled ? value && value : false,
      },
    };
  };

  const c = { privy, data, enabled, theme, fields };

  const items = PropList.builder<t.InfoField>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => Field.moduleVerify(data, theme))
    .field('AccessToken', () => Field.accessToken(data, theme))
    .field('Id.User', () => copyable('User', user?.id))
    .field('Id.User.Phone', () => user && copyable('Phone', phone))
    .field('Id.App.Privy', copyable('Privy App', provider?.appId))
    .field('Id.App.WalletConnect', copyable('WalletConnect Project', provider?.walletConnectId))
    .field('Login', () => Field.login(privy, enabled, theme))
    .field('Link.Wallet', () => user && Field.linkWallet({ ...c, wallets }))
    .field('Link.Farcaster', () => user && Field.linkFarcaster({ ...c, modifiers }))
    .field('Wallet.List', () => Field.walletsList({ ...c, wallets, modifiers, refresh$ }))
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
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      flipped={props.flipped}
      padding={props.card ? [20, 25, 30, 25] : undefined}
      margin={props.margin}
      theme={theme}
      style={props.style}
      onMouseEnter={mouse.handlers.onMouseEnter}
      onMouseLeave={mouse.handlers.onMouseLeave}
    />
  );
};
