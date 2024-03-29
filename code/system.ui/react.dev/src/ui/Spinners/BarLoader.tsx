import Bar from 'react-spinners/BarLoader';
import { COLORS, css, type t } from '../common';

export type BarLoaderProps = {
  style?: t.CssValue;
};

export const BarLoader: React.FC<BarLoaderProps> = (props) => {
  const width = 80;
  const styles = {
    base: css({
      position: 'relative',
      width,
      borderRadius: 10,
      overflow: 'hidden',
      opacity: 0.5,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Bar color={COLORS.DARK} width={width} />
    </div>
  );
};
