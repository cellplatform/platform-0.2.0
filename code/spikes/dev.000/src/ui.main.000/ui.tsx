import { Color, PeerUI, css, type t, Button } from './common';

export type SampleLayoutProps = {
  network: t.NetworkStore;
  stream?: MediaStream;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const SampleLayout: React.FC<SampleLayoutProps> = (props) => {
  const { network } = props;

  /**
   * Handlers
   */
  const copyPeer = () => {
    const id = `peer:${network.peer.id}`;
    navigator.clipboard.writeText(id);
  };

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      display: 'grid',
    }),
    peerId: {
      base: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
      inner: css({ fontSize: 50, fontFamily: 'monospace', fontWeight: 600 }),
    },
    video: css({
      Absolute: 0,
      pointerEvents: 'none',
    }),
  };

  const elPeerId = (
    <div {...styles.peerId.base}>
      <div {...styles.peerId.inner}>
        <Button theme={theme.name} onClick={copyPeer}>{`self:${network.peer.id}`}</Button>
      </div>
    </div>
  );

  const elVideo = (
    <PeerUI.Video
      stream={props.stream}
      muted={true}
      empty={''}
      theme={theme.name}
      style={styles.video}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elPeerId}
      {elVideo}
    </div>
  );
};
