import { Color, COLORS, css, type t } from '../common';
import { useImporter } from './useImporter.mjs';

export type SpinnerPuffProps = {
  size?: number;
  color?: string | number;
  style?: t.CssValue;
};

type P = {
  loading?: boolean;
  size?: number;
  color?: string;
  cssOverride?: t.CSSProperties;
};

export const SpinnerPuff: React.FC<SpinnerPuffProps> = (props) => {
  const { size = 32 } = props;
  const color = props.color ? Color.format(props.color) : COLORS.DARK;

  const { Spinner } = useImporter<P>(import('react-spinners/PuffLoader'));
  if (!Spinner) return null;

  /**
   * [Render]
   */
  const override: t.CSSProperties = {};
  const styles = {
    base: css({ position: 'relative' }),
    inner: css({ position: 'relative', top: -5, left: -5 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.inner}>
        <Spinner color={color} loading={true} size={size} cssOverride={override} />
      </div>
    </div>
  );
};
