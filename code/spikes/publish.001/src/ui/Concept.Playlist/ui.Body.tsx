import { Color, COLORS, css, t } from '../common';
import { Row } from './ui.Row';

export type BodyProps = {
  items?: t.PlaylistItem[];
  style?: t.CssValue;
  onClick?: t.PlaylistItemClickHandler;
};

export const Body: React.FC<BodyProps> = (props) => {
  const { items = [] } = props;
  const isEmpty = items.length === 0;

  /**
   * [Render]
   */
  const CYAN = COLORS.CYAN;
  const EDGE_BORDER = `solid 1px ${Color.alpha(CYAN, 0.3)}`;
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.alpha(CYAN, 0.03),
      minHeight: isEmpty ? 90 : undefined,
      borderTop: EDGE_BORDER,
      borderBottom: EDGE_BORDER,
    }),
    empty: css({
      Absolute: 0,
      userSelect: 'none',
      display: 'grid',
      placeItems: 'center',
      fontStyle: 'italic',
      fontSize: 14,
      color: Color.alpha(CYAN, 0.7),
    }),
    rows: css({}),
  };

  const elEmpty = isEmpty && <div {...styles.empty}>{`Nothing to display`}</div>;

  const elRows = !isEmpty && (
    <div {...styles.rows}>
      {items.map((item, i) => {
        return <Row key={`row-${i}`} item={item} index={i} onClick={props.onClick} />;
      })}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elRows}
    </div>
  );
};
