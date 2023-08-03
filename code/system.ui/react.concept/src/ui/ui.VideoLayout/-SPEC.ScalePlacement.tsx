import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, EdgePosition, Slider } from './common';

export type ScalePlacementPositionHandler = (e: ScalePlacementPositionHandlerArgs) => void;
export type ScalePlacementPositionHandlerArgs = {
  position: t.EdgePosition;
  pos: t.EdgePos;
};

export type ScalePlacementProps = {
  position?: t.PositionInput;
  style?: t.CssValue;
  onPositionChange?: ScalePlacementPositionHandler;
};

/**
 * TODO 🐷
 * - extract as primary UI concept.
 */
export const ScalePlacement: React.FC<ScalePlacementProps> = (props) => {
  const width = 100;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      width,
      display: 'grid',
      gridTemplateRows: 'auto auto',
      rowGap: '10px',
    }),
    slider: css({ display: 'grid', placeItems: 'center' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <EdgePosition.Selector
        size={width}
        selected={props.position}
        onChange={(e) => props.onPositionChange?.(e)}
      />

      <div {...styles.slider}>
        <Slider width={width - 20} thumb={{ size: 15 }} track={{ height: 15 }} />
      </div>
    </div>
  );
};
