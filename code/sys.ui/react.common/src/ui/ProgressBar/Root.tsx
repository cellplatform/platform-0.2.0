import { useRef } from 'react';
import { Wrangle } from './u';
import { DEFAULTS, FC, css, useMouse, type t } from './common';

const View: React.FC<t.ProgressBarProps> = (props) => {
  const {
    thumbColor = DEFAULTS.thumbColor,
    bufferedColor = DEFAULTS.bufferedColor,
    height = DEFAULTS.height,
    enabled = DEFAULTS.enabled,
  } = props;

  const percent = Wrangle.percent(props.percent);
  const buffered = Wrangle.percent(props.buffered);

  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMouse({
    onDown(e) {
      if (!enabled) return;
      if (ref.current && props.onClick) {
        const el = ref.current;
        const totalWidth = el.offsetWidth;
        const position = e.clientX - el.getBoundingClientRect().left;
        const percent = totalWidth <= 0 ? 0 : Wrangle.percent(position / totalWidth);
        props.onClick({
          percent,
          timestamp(total = 0) {
            total = Math.max(0, total);
            return total * percent;
          },
        });
      }
    },
  });

  /**
   * [Render]
   */
  const trackHeight = mouse.is.over && enabled ? 10 : 5;
  const transition = `height 0.15s, background-color 0.15s, opacity 0.15s`;
  const thumbCss = (progress: t.Percent = 0, color: string, disabledOpacity?: number) => {
    return css({
      display: progress > 0 ? 'block' : 'none',
      borderRadius: 20,
      backgroundColor: color,
      Absolute: [0, null, 0, 0],
      width: `${progress * 100}%`,
      height: trackHeight,
      transition,
      opacity: enabled ? 1 : disabledOpacity ?? 1,
    });
  };

  const styles = {
    base: css({
      position: 'relative',
      height,
      display: 'grid',
      alignContent: 'center',
      filter: enabled ? undefined : 'grayscale(100%)',
      transition: 'opacity 0.15s, filter 0.15s',
    }),
    track: css({
      position: 'relative',
      height: trackHeight,
      borderRadius: 20,
      backgroundColor: DEFAULTS.trackColor,
      overflow: 'hidden',
      transition,
    }),
    buffered: thumbCss(buffered, bufferedColor, 0.25),
    thumb: thumbCss(percent, thumbColor, 0.15),
  };

  return (
    <div ref={ref} {...css(styles.base, props.style)} {...mouse.handlers}>
      <div {...styles.track}>
        <div {...styles.buffered} />
        <div {...styles.thumb} />
      </div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Wrangle: typeof Wrangle;
};
export const ProgressBar = FC.decorate<t.ProgressBarProps, Fields>(
  View,
  { DEFAULTS, Wrangle },
  { displayName: DEFAULTS.displayName },
);
