import { COLORS, Color, css, type t } from './common';
import { SampleEdge } from './ui.Sample.Edge';

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
    body: css({ display: 'grid', placeItems: 'center' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <SampleEdge edge={props.left} style={styles.left} />
      <div {...styles.body}>{`🐷 Sample`}</div>
      <SampleEdge edge={props.right} style={styles.right} />
    </div>
  );
};
