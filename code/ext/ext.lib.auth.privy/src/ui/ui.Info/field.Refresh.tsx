import { Button, type t } from './common';

export function refresh(args: {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
  data: t.InfoData;
  fields: t.InfoField[];
  enabled: boolean;
  redraw?: () => void;
}): t.PropListItem | undefined {
  const { privy, data, fields } = args;
  let enabled = args.enabled;
  if (!privy.ready) enabled = false;

  const onClick = () => args.redraw?.();

  return {
    label: '',
    value: <Button onClick={onClick}>Refresh</Button>,
  };
}
