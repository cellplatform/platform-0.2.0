import { COLORS, Color, css, type t, Filesize } from './common';

export type ApiProps = {
  edge: t.SampleEdge['kind'];
  bytes?: number;
  style?: t.CssValue;
};

export const Api: React.FC<ApiProps> = (props) => {
  const { edge, bytes = 0 } = props;
  const is = {
    left: edge === 'Left',
    right: edge === 'Right',
  } as const;

  const label = bytes > 0 ? Filesize(bytes) : undefined;

  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid', alignContent: 'center' }),
    body: css({ display: 'grid', alignContent: 'center', gridTemplateColumns: 'auto auto' }),
    bar: css({
      width: 20,
      height: 6,
      backgroundColor: Color.alpha(COLORS.DARK, 0.2),
      alignSelf: 'center',
    }),
    head: css({
      position: 'relative',
      border: `solid 5px ${Color.alpha(COLORS.DARK, 0.2)}`,
      Size: 10,
      borderRadius: '100%',
      display: 'grid',
      justifyContent: 'center',
    }),
    label: css({
      position: 'relative',
      fontSize: 10,
      fontFamily: 'monospace',
      letterSpacing: -0.1,
      top: -22,
      opacity: 0.4,
      width: 60,
      textAlign: 'center',
      overflow: 'hidden',
    }),
  };

  const elBar = <div {...styles.bar}></div>;
  const elHead = <div {...styles.head}>{label && <div {...styles.label}>{label}</div>}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        {is.left ? elBar : elHead}
        {is.left ? elHead : elBar}
      </div>
    </div>
  );
};
