import { COLORS, Color, css, type t } from './common';
import { Api } from './ui.Api';

export type FooterProps = {
  isConnected?: boolean;
  style?: t.CssValue;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { isConnected } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      height: 60,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
    }),
    middle: css({
      display: 'grid',
      alignContent: 'center',
      PaddingX: 8,
    }),
    connected: css({
      borderTop: `dashed 1px ${Color.alpha(COLORS.MAGENTA, 0.3)}`,
      opacity: isConnected ? 1 : 0,
      transition: `opacity 0.3s`,
    }),
  };

  const elMiddle = (
    <div {...styles.middle}>
      <div {...styles.connected} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Api edge={'Left'} />
      {elMiddle}
      <Api edge={'Right'} />
    </div>
  );
};
