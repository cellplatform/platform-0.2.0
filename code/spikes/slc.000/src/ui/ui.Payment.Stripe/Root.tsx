import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from '../common';

export type PaymentStripeProps = {
  style?: t.CssValue;
};

export const PaymentStripe: React.FC<PaymentStripeProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 PaymentStripe`}</div>
    </div>
  );
};
