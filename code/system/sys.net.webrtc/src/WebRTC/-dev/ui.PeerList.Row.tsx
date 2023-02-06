import { useState } from 'react';
import {
  AudioWaveform,
  Button,
  Color,
  COLORS,
  css,
  Icons,
  MediaStream,
  Spinner,
  t,
} from './common';

export type PeerRowProps = {
  connections: t.PeerConnectionSet;
  style?: t.CssValue;
};

export const PeerRow: React.FC<PeerRowProps> = (props) => {
  const { connections } = props;
  const { peer: peerid } = connections;

  const [ready, setReady] = useState(false);
  const [isCloseOver, setCloseOver] = useState(false);

  const media = connections.media.find((item) => item.stream)?.stream;
  const video = media?.remote;

  /**
   * [Handlers]
   */
  const close = () => {
    connections.data.forEach((data) => data.dispose());
  };

  /**
   * [Render]
   */
  const thumbnailSize = 40;
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
    }),
    left: css({
      marginRight: 10,
      Size: thumbnailSize,
    }),
    body: css({
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    right: css({}),
    peerid: css({ fontSize: 10, opacity: 0.3 }),
    thumbnail: {
      base: css({ position: 'relative' }),
      bg: css({
        Absolute: 0,
        Size: thumbnailSize,
        display: 'grid',
        placeItems: 'center',
        pointerEvents: 'none',
      }),
      spinner: css({}),
    },
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <div>
          {!ready && (
            <div {...styles.thumbnail.bg}>
              <Spinner.Orbit size={20} style={styles.thumbnail.spinner} />
            </div>
          )}
          {video && (
            <MediaStream.Video
              stream={video}
              muted={true}
              width={thumbnailSize}
              height={thumbnailSize}
              borderRadius={3}
              onLoadedData={() => setReady(true)}
            />
          )}
        </div>
      </div>
      <div {...styles.body}>
        <div {...styles.peerid}>{`peer:${peerid}`}</div>
        <AudioWaveform height={20} stream={video} style={{ position: 'relative', bottom: -7 }} />
      </div>
      <div {...styles.right}>
        <Button
          onClick={close}
          onMouse={(e) => setCloseOver(e.isOver)}
          tooltip={'Close Connection'}
        >
          <Icons.Close
            size={22}
            color={isCloseOver ? COLORS.BLUE : Color.alpha(COLORS.DARK, 0.7)}
            style={{ position: 'relative', top: -4, right: -4 }}
          />
        </Button>
      </div>
    </div>
  );
};
