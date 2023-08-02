import { useRef } from 'react';
import { DEFAULTS, css, useMouseState, type t } from './common';

import { Wrangle } from './Wrangle.mjs';
import { Thumb } from './view.Thumb';
import { Track } from './view.Track';

type M = React.MouseEventHandler;

export const View: React.FC<t.SliderProps> = (props) => {
  const { enabled = DEFAULTS.enabled } = props;
  const percent = Wrangle.percent(props.percent);
  const { thumb, track } = Wrangle.settings(props);
  const height = Math.max(thumb.size, track.height);

  /**
   * Handlers
   */
  const removeTransientEvents = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', removeTransientEvents);
  };

  const onDown: M = (e) => {
    if (!enabled || !ref.current) return;
    if (props.onChange) {
      const percent = Wrangle.elementToPercent(ref.current, e.clientX);
      props.onChange({ percent });
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', removeTransientEvents);
    }
  };

  const onMove = (e: MouseEvent) => {
    if (!enabled || !ref.current) return;
    const current = Wrangle.percent(props.percent);
    const percent = Wrangle.elementToPercent(ref.current, e.clientX);
    if (percent !== current) props.onChange?.({ percent });
  };

  /**
   * Hooks
   */
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMouseState({ onDown });
  const totalWidth = ref.current?.offsetWidth ?? -1;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      height,
      position: 'relative',
      display: 'grid',
    }),
  };

  const elThumb = totalWidth > -1 && (
    <Thumb enabled={enabled} percent={percent} totalWidth={totalWidth} thumb={thumb} />
  );

  return (
    <div ref={ref} {...css(styles.base, props.style)} {...mouse.handlers}>
      <Track enabled={enabled} percent={percent} track={track} />
      {elThumb}
    </div>
  );
};
