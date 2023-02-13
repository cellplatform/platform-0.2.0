import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common';

import { QRCodeSVG } from 'qrcode.react';

type Pixels = number;

const DEFAULTS = {
  size: 128,
};

export type QRCodeProps = {
  value?: string;
  size?: Pixels;
  style?: t.CssValue;
};

const View: React.FC<QRCodeProps> = (props) => {
  const { size = DEFAULTS.size } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      Size: size,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <QRCodeSVG value={props.value ?? ''} size={size} />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULT: typeof DEFAULTS;
};
export const QRCode = FC.decorate<QRCodeProps, Fields>(
  View,
  { DEFAULT: DEFAULTS },
  { displayName: 'QRCode' },
);
