import { Color, PeerUI, css, type t } from './common';

export type SampleLayoutProps = {
  network: t.NetworkStore;
  stream?: MediaStream;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const SampleLayout: React.FC<SampleLayoutProps> = (props) => {
  const { network } = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const color = theme.fg;
  const styles = {
    base: css({ position: 'relative', color, display: 'grid' }),
    peerId: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
    video: css({ Absolute: 0, pointerEvents: 'none' }),
  };

  const elPeerId = !props.stream && (
    <div {...styles.peerId}>
      <PeerUI.Button.PeerUri
        theme={theme.name}
        clipboard={true}
        fontSize={26}
        prefix={'self'}
        id={network.peer.id}
        style={{ width: 200 }}
      />
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
