import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, SplitLayout } from './common';
import { VideoPlayer } from './ui.VideoPlayer';
import { Wrangle } from './Wrangle';

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
        <VideoPlayer
          video={props.video}
          muted={props.muted}
          playing={props.playing}
          timestamp={props.timestamp}
          onStatus={props.onVideoStatus}
        />
      </SplitLayout>
    </div>
  );
};
