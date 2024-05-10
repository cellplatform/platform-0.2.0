import { MediaStream } from '..';
import { Icons } from '../../Icons';
import { Color, css, type t } from './common';

export type SampleProps = t.VideoProps & { streamRef: string; bus: t.EventBus<any> };

export const Sample: React.FC<SampleProps> = (props) => {
  const { streamRef, bus } = props;
  const { stream } = MediaStream.useVideoStreamState({ ref: streamRef, bus });
  const wifi = MediaStream.useOfflineState();
  const borderRadius = 30;
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.format(-0.02),
      border: `solid 1px ${Color.format(-0.03)}`,
      borderRadius,
    }),
    overlay: css({
      Absolute: 0,
      Flex: 'center-center',
      pointerEvents: 'none',
    }),
    video: css({
      opacity: wifi.online ? 1 : 0.2,
    }),
  };

  const elOffline = wifi.offline && (
    <div {...styles.overlay}>
      <Icons.Wifi.Off />
    </div>
  );

  return (
    <div {...styles.base}>
      <MediaStream.Video
        {...props}
        stream={stream}
        borderRadius={borderRadius}
        style={styles.video}
        width={300}
        height={200}
      />
      {elOffline}
    </div>
  );
};
