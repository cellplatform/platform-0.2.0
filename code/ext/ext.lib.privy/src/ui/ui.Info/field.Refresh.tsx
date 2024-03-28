import { Icons, css, Button, type t } from './common';

export function refresh(args: {
  privy: t.PrivyInterface;
  wallets: t.ConnectedWallet[];
  data: t.InfoData;
  fields: t.InfoField[];
  enabled: boolean;
  theme?: t.CommonTheme;
  refresh?: () => void;
}): t.PropListItem | undefined {
  const { privy, data, fields, theme } = args;
  let enabled = args.enabled;
  if (!privy.ready) enabled = false;
  if (!privy.authenticated) return undefined;

  const onClick = () => args.refresh?.();

  const styles = {
    center: css({ Flex: 'x-center-center' }),
  };

  return {
    label: '',
    value: (
      <Button onClick={onClick} enabled={enabled} theme={theme}>
        <div {...styles.center}>
          <Icons.Refresh size={16} offset={[-1, -1]} margin={[0, 2, 0, 0]} />
          {fields.includes('Refresh.Label') && <div>{'Refresh'}</div>}
        </div>
      </Button>
    ),
  };
}
