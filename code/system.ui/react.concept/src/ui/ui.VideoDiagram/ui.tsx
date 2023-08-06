import { useState } from 'react';

import { SplitLayout, css, type t } from './common';
import { ImagePanel } from './ui.Panel.Image';
import { VideoPanel } from './ui.Panel.Video';

export const View: React.FC<t.VideoDiagramProps> = (props) => {
  const { debug = false } = props;

  const [status, setStatus] = useState<t.VideoStatus>();

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
        <ImagePanel video={props.video} status={status} />
        <VideoPanel
          video={props.video}
          muted={props.muted}
          playing={props.playing}
          timestamp={props.timestamp}
          onStatus={(e) => {
            setStatus(e.status);
            props.onVideoStatus?.(e);
          }}
        />
      </SplitLayout>
    </div>
  );
};
