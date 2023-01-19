import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type FooterProps = {
  footerRight?: string | JSX.Element;
  style?: t.CssValue;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { footerRight } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      minHeight: 60,
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    bottom: css({
      display: 'grid',
      gridTemplateColumns: `1fr auto`,
    }),
    bottomLeft: css({
      borderBottom: `solid 5px ${COLORS.CYAN}`,
    }),
    bottomRight: css({
      PaddingX: 35,
      fontSize: 22,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div></div>
      <div {...styles.bottom}>
        <div {...styles.bottomLeft} />
        {footerRight && <div {...styles.bottomRight}>{footerRight}</div>}
      </div>
    </div>
  );
};
