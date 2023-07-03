import { QRCode as BaseQRCode, css, type t } from '../common';

export type QRCodeProps = {
  href?: string;
  size?: number;
  style?: t.CssValue;
};

export const QRCode: React.FC<QRCodeProps> = (props) => {
  const { size = 120 } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      display: 'grid',
      placeItems: 'center',
      padding: 10,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <BaseQRCode value={props.href} size={size} />
    </div>
  );
};
