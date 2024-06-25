import { Button, Icons, css, type t } from './common';

type Args = t.InfoFieldArgs & {
  wallets: t.ConnectedWallet[];
  refresh?: () => void;
};

export function refresh(args: Args): t.PropListItem | undefined {
  const { privy, fields, theme } = args;
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
