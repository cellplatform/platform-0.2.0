import { COLORS, Color, css, type t } from './common';

export type ApiProps = {
  edge: t.Edge;
  style?: t.CssValue;
};

export const Api: React.FC<ApiProps> = (props) => {
  const { edge } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      display: 'grid',
      alignContent: 'center',
      transform: edge === 'Right' ? 'scaleX(-1)' : undefined,
    }),
    body: css({
      display: 'grid',
      alignContent: 'center',
      gridTemplateColumns: '1fr auto',
    }),
    bar: css({
      width: 20,
      height: 6,
      backgroundColor: Color.alpha(COLORS.DARK, 0.1),
      alignSelf: 'center',
    }),
    head: css({
      position: 'relative',
      border: `solid 5px ${Color.alpha(COLORS.DARK, 0.1)}`,
      Size: 10,
      borderRadius: '100%',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.bar}></div>
        <div {...styles.head}></div>
      </div>
    </div>
  );
};
