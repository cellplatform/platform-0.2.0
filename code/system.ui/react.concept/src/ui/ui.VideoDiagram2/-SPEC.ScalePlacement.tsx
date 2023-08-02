import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, EdgePosition, Slider } from './common';

export type ScalePlacementProps = {
  style?: t.CssValue;
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
        // selected={e.state.props.slug?.video?.position}
        onSelect={(e) => {
          // state.change((d) => {
          // const id = DEFAULTS.sample.id;
          // const slug = d.props.slug ?? (d.props.slug = { id });
          // const video = slug.video ?? (slug.video = {});
          // video.position = local.videoPosition = e.pos;
          // });
        }}
      />

      <div {...styles.slider}>
        <Slider width={width - 20} thumb={{ size: 15 }} track={{ height: 15 }} />
      </div>
    </div>
  );
};
