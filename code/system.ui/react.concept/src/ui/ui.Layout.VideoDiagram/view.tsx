import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, SplitLayout } from './common';
import { VideoView } from './view.Video';

export const View: React.FC<t.VideoDiagramLayoutProps> = (props) => {
  const { debug = false } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <SplitLayout
        debug={debug}
        split={props.split}
        splitMin={props.splitMin}
        splitMax={props.splitMax}
      >
        <div />
        <VideoView />
      </SplitLayout>
    </div>
  );
};
