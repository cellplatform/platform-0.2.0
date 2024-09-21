import { Hash, Icons, css, type t } from './common';

type Args = t.InfoFieldArgs;

export function accessToken(args: Args): t.PropListItem | undefined {
  const accessToken = args.data.accessToken;
  const jwt = accessToken?.jwt;

  const styles = {
    base: css({
      display: 'grid',
      alignContent: 'center',
      gridTemplateColumns: 'auto auto',
      columnGap: '3px',
    }),
  };
  const value = (
    <div {...styles.base}>
      {jwt ? `JWT:RFC:7519 → ${Hash.shorten(jwt, 4)}` : undefined}
      {jwt ? <Icons.Shield size={14} margin={[0, 0, 0, 6]} /> : '-'}
    </div>
  );

  return {
    label: accessToken?.label || 'Access Token',
    value,
  };
}
