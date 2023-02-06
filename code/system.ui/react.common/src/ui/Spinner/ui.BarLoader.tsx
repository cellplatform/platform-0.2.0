import { Color, COLORS, css, t } from '../common';
import { useImporter } from './useImporter.mjs';

export type SpinnerBarLoaderProps = {
  width?: number;
  color?: string | number;
  style?: t.CssValue;
};

type P = {
  loading?: boolean;
  width?: number;
  color?: string;
  cssOverride?: t.CSSProperties;
};

export const SpinnerBarLoader: React.FC<SpinnerBarLoaderProps> = (props) => {
  const { width = 100 } = props;
  const color = props.color ? Color.format(props.color) : COLORS.DARK;

  const { Spinner } = useImporter<P>(import('react-spinners/BarLoader'));
  if (!Spinner) return null;

  /**
   * [Render]
   */
  const override: t.CSSProperties = {};
  const styles = {
    base: css({
      position: 'relative',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Spinner color={color} loading={true} width={width} cssOverride={override} />
    </div>
  );
};
