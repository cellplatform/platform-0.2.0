import { SplitLayout, css, type t } from './common';
import { VideoPanel } from './ui.Panel.Video';
import { ImagePanel } from './ui.Panel.Image';

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
        <ImagePanel />
        <VideoPanel
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
