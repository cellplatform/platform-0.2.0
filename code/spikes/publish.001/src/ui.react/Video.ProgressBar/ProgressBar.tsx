import { useState } from 'react';
import { Color, COLORS, css, R, t } from '../common';

export type ProgressBarProps = {
  percent?: number;
  style?: t.CssValue;
};

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const percent = R.clamp(0, 1, props.percent ?? 0);

  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => setOver(isOver);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      height: 30,
      display: 'flex',
      alignItems: 'center',
    }),
    groove: css({
      flex: 1,
      position: 'relative',
      borderRadius: 10,
      backdropFilter: `blur(5px)`,
      backgroundColor: Color.alpha(COLORS.DARK, isOver ? 0.06 : 0.01),
      border: `solid 1px`,
      borderColor: Color.alpha(COLORS.DARK, isOver ? 0.12 : 0.06),
      height: isOver ? 6 : 2,
      transition: `height 200ms, background-color 200ms, border-color 200ms`,
    }),
    thumb: css({
      borderRadius: 10,
      width: `${percent * 100}%`,
      height: '100%',
      minWidth: 10,
      backgroundColor: isOver ? COLORS.RED : Color.alpha(COLORS.DARK, 0.3),
      transition: `background-color 200ms`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)} onMouseEnter={over(true)} onMouseLeave={over(false)}>
      <div {...styles.groove}>
        <div {...styles.thumb} />
      </div>
    </div>
  );
};
