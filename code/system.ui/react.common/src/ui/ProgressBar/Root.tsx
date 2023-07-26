import { useEffect, useState, useRef } from 'react';
import { COLORS, Color, DEFAULTS, FC, css, type t, useMouseState } from './common';

const View: React.FC<t.ProgressBarProps> = (props) => {
  const { thumbColor = DEFAULTS.thumbColor, height = DEFAULTS.height } = props;
  const progress = Wrangle.percent(props.percent);

  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMouseState({
    onDown(e) {
      if (ref.current && props.onClick) {
        const el = ref.current;
        const totalWidth = el.offsetWidth;
        const position = e.clientX - el.getBoundingClientRect().left;
        const progress = Wrangle.percent(position / totalWidth);
        props.onClick({ percent: progress });
      }
    },
  });

  /**
   * [Render]
   */
  const trackHeight = mouse.isOver ? 10 : 5;
  const transition = `height 0.15s, background-color 0.15s`;
  const styles = {
    base: css({
      height,
      display: 'grid',
      alignContent: 'center',
    }),
    track: css({
      position: 'relative',
      height: trackHeight,
      borderRadius: 20,
      backgroundColor: Color.alpha(COLORS.DARK, 0.1),
      overflow: 'hidden',
      transition,
    }),
    thumb: css({
      borderRadius: 20,
      backgroundColor: thumbColor,
      Absolute: [0, null, 0, 0],
      width: `${progress * 100}%`,
      height: trackHeight,
      transition,
    }),
  };

  return (
    <div ref={ref} {...css(styles.base, props.style)} {...mouse.handlers}>
      <div {...styles.track}>
        <div {...styles.thumb} />
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  percent(value?: number) {
    if (!value) return DEFAULTS.percent;
    return Math.max(0, Math.min(1, value));
  },
} as const;

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const ProgressBar = FC.decorate<t.ProgressBarProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'ProgressBar' },
);
