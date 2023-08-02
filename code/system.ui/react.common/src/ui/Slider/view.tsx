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
    const detach = document.removeEventListener;
    detach('mousemove', onMouseMove);
    detach('mouseup', removeTransientEvents);
    detach('selectstart', onSelectStart);
  };

  const onDown: M = (e) => {
    if (!enabled || !ref.current) return;
    if (props.onChange) {
      // Start listening to mouse movement.
      const attach = document.addEventListener;
      attach('mousemove', onMouseMove);
      attach('mouseup', removeTransientEvents);
      attach('selectstart', onSelectStart);

      // Fire event.
      const percent = Wrangle.elementToPercent(ref.current, e.clientX);
      props.onChange({ percent });
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!enabled || !ref.current) return;
    const percent = Wrangle.elementToPercent(ref.current, e.clientX);
    props.onChange?.({ percent });
  };

  const onSelectStart = (e: Event) => {
    e.preventDefault();
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
