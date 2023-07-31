import { useRef } from 'react';
import { Wrangle } from './Wrangle.mjs';
import { DEFAULTS, FC, css, useMouseState, type t } from './common';

const View: React.FC<t.ProgressBarProps> = (props) => {
  const {
    thumbColor = DEFAULTS.thumbColor,
    bufferedColor = DEFAULTS.bufferedColor,
    height = DEFAULTS.height,
    enabled = DEFAULTS.enabled,
  } = props;

  const progress = Wrangle.toPercent(props.percent);
  const buffered = Wrangle.toPercent(props.buffered);

  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMouseState({
    onDown(e) {
      if (!enabled) return;
      if (ref.current && props.onClick) {
        const el = ref.current;
        const totalWidth = el.offsetWidth;
        const position = e.clientX - el.getBoundingClientRect().left;
        const progress = Wrangle.toPercent(position / totalWidth);
        props.onClick({ percent: progress });
      }
    },
  });

  /**
   * [Render]
   */
  const trackHeight = mouse.isOver && enabled ? 10 : 5;
  const transition = `height 0.15s, background-color 0.15s`;
  const thumbCss = (progress: t.Percent = 0, color: string) => {
    return css({
      display: progress > 0 ? 'block' : 'none',
      borderRadius: 20,
      backgroundColor: color,
      Absolute: [0, null, 0, 0],
      width: `${progress * 100}%`,
      height: trackHeight,
      transition,
    });
  };

  const styles = {
    base: css({
      position: 'relative',
      height,
      display: 'grid',
      alignContent: 'center',
      opacity: enabled ? 1 : 0.8,
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
    buffered: thumbCss(buffered, bufferedColor),
    thumb: thumbCss(progress, thumbColor),
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
  { displayName: 'ProgressBar' },
);
