import { SplitLayout, css, type t } from './common';
import { ImagePanel } from './ui.Panel.Image';
import { VideoPanel } from './ui.Panel.Video';

export const View: React.FC<t.VideoDiagramProps> = (props) => {
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
        <ImagePanel image={props.image} />
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
