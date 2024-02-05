import type { Farcaster } from '@privy-io/react-auth';
import { css, type t } from './common';

export type FCUsernameProps = {
  data: Farcaster;
  style?: t.CssValue;
};

export const FCUsername: React.FC<FCUsernameProps> = (props) => {
  const { data } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: 'auto auto',
      columnGap: '5px',
    }),
    pfp: css({ Size: 16, borderRadius: 16 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`${data.username}`}</div>
      {data.pfp && <img src={data.pfp} {...styles.pfp} />}
    </div>
  );
};
