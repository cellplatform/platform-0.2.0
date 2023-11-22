import { COLORS, Color, css, type t } from './common';
import { SampleEdge } from './ui.Sample.Edge';
import { SampleMiddle } from './ui.Sample.Middle';

export type SampleProps = {
  left: t.SampleEdge;
  right: t.SampleEdge;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  /**
   * Render
   */
  const border = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '250px 1fr 250px',
    }),
    left: css({ borderRight: border }),
    right: css({ borderLeft: border }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <SampleEdge edge={props.left} style={styles.left} />
      <SampleMiddle left={props.left} right={props.right} />
      <SampleEdge edge={props.right} style={styles.right} />
    </div>
  );
};
