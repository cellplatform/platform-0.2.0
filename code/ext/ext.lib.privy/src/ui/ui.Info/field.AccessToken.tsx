import { Hash, Icons, css, type t } from './common';

export function accessToken(data: t.InfoData): t.PropListItem | undefined {
  const accessToken = data.accessToken;
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
      {jwt ? <Icons.Key.On size={14} /> : <Icons.Key.Off size={14} />}
      {jwt ? `${Hash.shorten(jwt, 6)}` : undefined}
    </div>
  );

  const label = accessToken?.label || 'Access Token';
  return { label, value };
}
