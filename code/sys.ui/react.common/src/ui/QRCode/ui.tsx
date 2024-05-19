import QRCodeLib from 'qrcode';
import { useEffect, useRef } from 'react';
import { DEFAULTS, css, type t } from './common';

export const View: React.FC<t.QRCodeProps> = (props) => {
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
