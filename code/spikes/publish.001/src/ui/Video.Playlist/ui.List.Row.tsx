import { Color, COLORS, css, t, rx, Button, Time, Value } from '../common';
import { Icons } from '../Icons.mjs';

export type RowProps = {
  index: number;
  item: t.PlaylistItem;
  style?: t.CssValue;
  onClick?: t.PlaylistItemClickHandler;
};

export const Row: React.FC<RowProps> = (props) => {
  const { item, index } = props;
  const duration = item.duration ? Time.duration(item.duration) : undefined;

  const handleClick = () => {
    props.onClick?.({ item, index });
  };

  /**
   * [Render]
   */
  const CYAN = COLORS.CYAN;
  const styles = {
    base: css({
      borderBottom: `dashed 1px ${Color.alpha(CYAN, 0.3)}`,
      ':last-child': { borderBottom: 'none' },
    }),
    body: css({
      display: 'grid',
      gridTemplateColumns: `auto 1fr auto`,
      columnGap: 20,
      PaddingY: 6,
      paddingLeft: 20,
      paddingRight: 25,
    }),
    icon: css({}),
    text: css({
      boxSizing: 'border-box',
      display: 'grid',
      alignContent: 'center',
      paddingBottom: 3,
    }),
    status: css({
      width: 150,
      display: 'grid',
      placeItems: 'center',
      color: Color.alpha(CYAN, 0.7),
      fontSize: 18,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <Button style={styles.body} onClick={handleClick}>
        <>
          <div {...styles.icon}>
            <Icons.Play.Outline size={40} color={CYAN} />
          </div>
          <div {...styles.text}>{item.text}</div>
          <div {...styles.status}>{duration?.toString()}</div>
        </>
      </Button>
    </div>
  );
};
