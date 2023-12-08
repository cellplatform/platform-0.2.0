import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

import { Wrangle } from './Wrangle';
import { DEFAULTS, Keyboard, Pkg, PropList, useMouse, type t } from './common';
import { Field } from './field';

export const Builder: React.FC<t.InfoProps> = (props) => {
  const {
    enabled = DEFAULTS.enabled,
    fields = DEFAULTS.fields.default,
    clipboard = DEFAULTS.clipboard,
    data = DEFAULTS.data,
  } = props;

  const keyboard = Keyboard.useKeyboardState();
  const mouse = useMouse();
  const privy = usePrivy();
  const { wallets } = useWallets();
  const [ready, setReady] = useState(false);

  const [, setRedraw] = useState(0);
  const redraw = () => setRedraw((prev) => prev + 1);

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

  const items = PropList.builder<t.InfoField>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => Field.moduleVerify(data))
    .field('Id.User', () => copyable('User', user?.id))
    .field('Id.User.Phone', () => user && copyable('Phone', phone))
    .field('Id.App.Privy', copyable('Privy App', provider?.appId))
    .field('Id.App.WalletConnect', copyable('WalletConnect Project', provider?.walletConnectId))
    .field('Auth.Login', () => Field.login(privy, enabled))
    .field(
      'Auth.Link.Wallet',
      () => user && Field.linkWallet(privy, data, wallets, fields, enabled),
    )
    .field('Wallet.List', () =>
      Field.walletsList({ privy, data, wallets, enabled, modifiers, fields }),
    )
    .field('Chain.List', () => Field.chainList({ privy, data, enabled, modifiers, fields }))
    .field('Refresh', () => Field.refresh({ privy, data, wallets, fields, enabled, redraw }))
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
      style={props.style}
      onMouseEnter={mouse.handlers.onMouseEnter}
      onMouseLeave={mouse.handlers.onMouseLeave}
    />
  );
};
