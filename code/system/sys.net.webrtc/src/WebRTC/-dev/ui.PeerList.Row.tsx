import { useState } from 'react';
import { Button, COLORS, css, Icons, MediaStream, Spinner, t } from './common';

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
      marginRight: 5,
      Size: thumbnailSize,
    }),
    body: css({}),
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
          {media && (
            <MediaStream.Video
              stream={media?.remote}
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
      </div>
      <div {...styles.right}>
        <Button onClick={close} onMouse={(e) => setCloseOver(e.isOver)}>
          <Icons.Close size={22} color={isCloseOver ? COLORS.BLUE : COLORS.DARK} />
        </Button>
      </div>
    </div>
  );
};
