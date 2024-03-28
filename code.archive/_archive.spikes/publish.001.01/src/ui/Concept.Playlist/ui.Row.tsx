import { useState } from 'react';

import { Button, Color, COLORS, css, t, Time } from '../common';
import { Icons } from '../Icons.mjs';

export type RowProps = {
  index: number;
  item: t.PlaylistItem;
  style?: t.CssValue;
  onClick?: t.PlaylistItemClickHandler;
};

export const Row: React.FC<RowProps> = (props) => {
  const { item, index } = props;
  const duration = item.secs ? Time.duration(item.secs * 1000) : undefined;

  const [isOver, setOver] = useState(false);

  const handleClick = () => {
    props.onClick?.({ data: item, index });
  };

  const handleMouse: t.ButtonMouseHandler = (e) => {
    setOver(e.isOver);
  };

  /**
   * [Render]
   */
  const CYAN = COLORS.CYAN;
  const styles = {
    base: css({
      backgroundColor: Color.alpha(CYAN, isOver ? 0.12 : 0),
      borderBottom: `dashed 1px ${Color.alpha(CYAN, 0.3)}`,
      ':last-child': { borderBottom: 'none' },
    }),
    body: css({
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: `auto 1fr auto`,
      columnGap: 20,
      PaddingY: 8,
      paddingLeft: 20,
      paddingRight: 60,
      color: COLORS.DARK,
    }),
    icon: css({
      display: 'grid',
      placeItems: 'center',
    }),
    text: css({
      boxSizing: 'border-box',
      display: 'grid',
      alignContent: 'center',
      paddingBottom: 3,
    }),
    status: css({
      width: 80,
      display: 'grid',
      placeItems: 'center',
      color: Color.alpha(CYAN, isOver ? 1 : 0.7),
      fontSize: 18,
    }),
  };

  const Icon = isOver ? Icons.Play.Filled : Icons.Play.Outline;

  return (
    <div {...css(styles.base, props.style)}>
      <Button style={styles.body} onClick={handleClick} onMouse={handleMouse}>
        <>
          <div {...styles.icon}>
            <Icon size={40} color={CYAN} />
          </div>
          <div {...styles.text}>{item.text}</div>
          <div {...styles.status}>{duration?.toString()}</div>
        </>
      </Button>
    </div>
  );
};
