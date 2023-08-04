import { useEffect } from 'react';
import { DEFAULTS, css, useRedraw, type t } from './common';

import { Wrangle } from './Wrangle.mjs';
import { useEventMonitor } from './use.EventMonitor.mjs';
import { Thumb } from './ui.Thumb';
import { Track } from './ui.Track';

type M = React.MouseEventHandler;

export const View: React.FC<t.SliderProps> = (props) => {
  const { enabled = DEFAULTS.enabled, onChange } = props;
  const { thumb, track } = Wrangle.props(props);
  const percent = Wrangle.percent(props.percent);

  /**
   * Hooks
   */
  const monitor = useEventMonitor({ enabled, onChange });
  const totalWidth = monitor.el?.offsetWidth ?? -1;

  const redraw = useRedraw();
  useEffect(redraw, [Boolean(monitor.el)]); // NB: ensure the thumb renders (which is waiting for the [ref] → totalWidth).

  /**
   * [Render]
   */
  const width = props.width;
  const height = Math.max(thumb.size, track.height);
  const styles = {
    base: css({
      position: 'relative',
      width,
      height,
      filter: `grayscale(${enabled ? 0 : 100}%)`,
      opacity: enabled ? 1 : 0.6,
      transition: 'filter 0.2s, opacity 0.2s',
      display: 'grid',
    }),
  };

  const elThumb = totalWidth > -1 && (
    <Thumb
      totalWidth={totalWidth}
      percent={percent}
      height={height}
      thumb={thumb}
      enabled={enabled}
      pressed={monitor.pressed}
    />
  );

  return (
    <div ref={monitor.ref} {...css(styles.base, props.style)} {...monitor.handlers}>
      <Track
        totalWidth={totalWidth}
        percent={percent}
        track={track}
        thumb={thumb}
        enabled={enabled}
      />
      {elThumb}
    </div>
  );
};
