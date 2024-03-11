import { Hash, Icons, css, type t } from './common';

export function accessToken(data: t.InfoData): t.PropListItem | undefined {
  const accessToken = data.endpoint?.accessToken;
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
      {accessToken ? <Icons.Key.On size={14} /> : <Icons.Key.Off size={14} />}
      {accessToken ? `${Hash.shorten(accessToken, [6, 8])}` : undefined}
    </div>
  );

  return {
    label: 'Access Token (JWT)',
    value,
  };
}

export const auth = { accessToken } as const;
