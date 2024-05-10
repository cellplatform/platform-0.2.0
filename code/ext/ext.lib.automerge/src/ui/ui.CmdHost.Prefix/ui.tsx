import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Icons } from './common';

export const View: React.FC<t.RootProps> = (props) => {
  const [open, setOpen] = useState(false);

  /**
   * Handlers
   */
  const handleClick = () => setOpen((prev) => !prev);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      color: theme.color,
      borderRight: `solid 1px ${theme.alpha(0.1)}`,
    }),
    grid: css({ display: 'grid', placeItems: 'center' }),
    size: {
      width: open ? 150 : 42,
      transition: 'width 300ms ease',
    },
  };

  return (
    <div {...css(styles.base, styles.grid, styles.size, props.style)} onMouseDown={handleClick}>
      <Icons.Object size={20} color={theme.color} />
    </div>
  );
};
