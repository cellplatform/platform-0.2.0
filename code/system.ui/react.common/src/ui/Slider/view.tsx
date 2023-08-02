import { useEffect, useRef } from 'react';
import { DEFAULTS, css, useMouseState, useRedraw, type t } from './common';

import { Wrangle } from './Wrangle.mjs';
import { Thumb } from './view.Thumb';
import { Track } from './view.Track';

type M = React.MouseEventHandler;

export const View: React.FC<t.SliderProps> = (props) => {
  const { enabled = DEFAULTS.enabled } = props;
  const { thumb, track } = Wrangle.props(props);
  const percent = Wrangle.percent(props.percent);
  const height = Math.max(thumb.size, track.height);

  /**
   * Handlers
   */
  const removeTransientEvents = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', removeTransientEvents);
  };

  const onDown: M = (e) => {
    if (!enabled || !ref.current) return;
    if (props.onChange) {
      const percent = Wrangle.elementToPercent(ref.current, e.clientX);
      props.onChange({ percent });
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', removeTransientEvents);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!enabled || !ref.current) return;
    const percent = Wrangle.elementToPercent(ref.current, e.clientX);
    props.onChange?.({ percent });
  };

  /**
   * Hooks
   */
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMouseState({ onDown });
  const totalWidth = ref.current?.offsetWidth ?? -1;
  const redraw = useRedraw();
  useEffect(redraw, [Boolean(ref.current)]); // NB: ensure the thumb renders (which is waiting for the [ref] → totalWidth).

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
    <Thumb
      totalWidth={totalWidth}
      percent={percent}
      thumb={thumb}
      enabled={enabled}
      pressed={mouse.isDown}
    />
  );

  return (
    <div ref={ref} {...css(styles.base, props.style)} {...mouse.handlers}>
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
