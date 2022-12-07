import { Color, COLORS, css, R, t } from '../common';
import { TimeMap as TimeMapUtil } from '../Video.Diagram/TimeMap.mjs';

type Seconds = number;

export type TimeMapProps = {
  timemap: t.DocTimeWindow[];
  isOver?: boolean;
  duration?: Seconds;
  style?: t.CssValue;
};

export const TimeMap: React.FC<TimeMapProps> = (props) => {
  const { duration = 0, isOver = false } = props;

  if (duration === 0) return null;
  if (props.timemap.length === 0) return null;
  const timemap = TimeMapUtil.sortedTimeMap(props.timemap);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      userSelect: 'none',
      Flex: 'x-stretch-stretch',
    }),
    block: css({
      Absolute: [0, null, 0, 0],
      borderRight: `solid 1px `,
      borderColor: isOver ? COLORS.RED : Color.alpha(COLORS.DARK, 0.2),
      transition: `border-color 200ms`,
    }),
  };

  const elBlocks = timemap.map((item, i) => {
    const percent = toPercent(item, duration) * 100;
    if (percent === 0) return;
    return <div key={i} {...styles.block} style={{ width: `${percent}%` }} />;
  });

  return <div {...css(styles.base, props.style)}>{elBlocks}</div>;
};

/**
 * [Helpers]
 */

function toPercent(item: t.DocTimeWindow, duration: Seconds) {
  if (duration === 0) return 0;
  return R.clamp(0, 1, (item.start ?? 0) / duration);
}
