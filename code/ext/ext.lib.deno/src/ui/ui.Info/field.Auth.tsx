import { Hash, Icons, css, type t } from './common';

export function accessToken(data: t.InfoData, fields: t.InfoField[]): t.PropListItem | undefined {
  const auth = data.auth;
  const jwt = auth?.accessToken;

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
      {jwt ? <Icons.Key.On size={14} /> : <Icons.Key.Off size={14} />}
      {jwt ? `${Hash.shorten(jwt, [6, 8])}` : undefined}
    </div>
  );

  const label = auth?.label || 'Access Token (JWT)';
  return { label, value };
}

export const auth = { accessToken } as const;
