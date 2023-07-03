import QRCodeLib from 'qrcode';
import { useEffect, useRef } from 'react';
import { css, FC, type t } from '../common';

type Pixels = number;
const DEFAULTS = { size: 128 };

export type QRCodeProps = {
  value?: string;
  size?: Pixels;
  style?: t.CssValue;
};

const View: React.FC<QRCodeProps> = (props) => {
  const { size = DEFAULTS.size, value } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Lifecycle
   */
  useEffect(() => {
    QRCodeLib.toCanvas(
      canvasRef.current,
      value ?? '',
      { errorCorrectionLevel: 'H', width: size },
      (error) => {},
    );
  }, [canvasRef.current, props.value, size]);

  /**
   * [Render]
   */
  const styles = {
    base: css({ Size: size }),
  };

  return <canvas ref={canvasRef} {...css(styles.base, props.style)} />;
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
