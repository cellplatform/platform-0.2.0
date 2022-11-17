import { useState } from 'react';

import { Color, css, State, t, useClickOutside, Spinner } from '../common';
import { VideoDiagram } from '../Video.Diagram';
import { useOverlayDef } from './useOverlayDef.mjs';

export type OverlayFrameProps = {
  instance: t.StateInstance;
  def: t.OverlayDef;
  style?: t.CssValue;
};

export const OverlayFrame: React.FC<OverlayFrameProps> = (props) => {
  const { instance } = props;

  const outside = useClickOutside((e) => State.withEvents(instance, (e) => e.overlay.close()));

  const def = useOverlayDef(instance, props.def);

  const [isOver, setOver] = useState(false);
  const [isOverBody, setOverBody] = useState(false);
  const over = (isOver: boolean) => () => setOver(isOver);
  const overBody = (isOver: boolean) => () => setOverBody(isOver);
  const isOverGutter = isOver && !isOverBody;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.format(0.8),
      backdropFilter: `blur(${isOverGutter ? 8 : 40}px)`,
    }),
    body: css({
      Absolute: 30,
      borderRadius: 8,
      boxSizing: 'border-box',
      padding: 30,
      overflow: 'hidden',
      boxShadow: `0 0 60px 0 ${Color.format(-0.1)}`,
      border: `solid 1px `,
      '@media (max-width: 1100px)': { opacity: 0, pointerEvents: 'none' },

      borderColor: Color.format(1),
      backgroundColor: Color.format(isOverGutter ? 0.2 : 1),
      transition: `background-color 350ms, border-color 150ms`,
    }),
  };

  const elSpinner = !def.ready && (
    <Spinner.Center style={{ Absolute: 0 }}>
      <Spinner size={64} />
    </Spinner.Center>
  );

  /**
   * TODO 🐷
   * LOAD THIS from a the def/data pulled from the Markdown YAML.
   */
  const elTmp = def.ready && (
    <VideoDiagram instance={instance} dimmed={isOverGutter} style={{ Absolute: 0 }} />
  );

  return (
    <div {...css(styles.base, props.style)} onMouseEnter={over(true)} onMouseLeave={over(false)}>
      <div
        {...styles.body}
        ref={outside.ref}
        onMouseEnter={overBody(true)}
        onMouseLeave={overBody(false)}
      >
        {elTmp}
        {elSpinner}
      </div>
    </div>
  );
};
