import { COLORS, Color, Crdt, Webrtc, css, type t } from './common';

export type SampleEdgeProps = {
  edge: t.SampleEdge;
  focusOnLoad?: boolean;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};

export const SampleEdge: React.FC<SampleEdgeProps> = (props) => {
  const { edge } = props;

  /**
   * Render
   */
  const border = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const styles = {
    base: css({ backgroundColor: COLORS.WHITE, display: 'grid', gridTemplateRows: '1fr auto' }),
    footer: css({ borderTop: border }),
    avatars: css({ padding: 8, borderBottom: border }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Crdt.RepoList list={edge.repo} behaviors={['Shareable']} />
      <div {...styles.footer}>
        <Webrtc.AvatarTray
          peer={edge.network.peer}
          style={styles.avatars}
          muted={false}
          onSelection={(e) => {
            console.info(`⚡️ AvatarTray.onSelection`, e);
            props.onStreamSelection?.(e);
          }}
        />
        <Webrtc.Connector
          peer={edge.network.peer}
          behaviors={props.focusOnLoad ? ['Focus.OnLoad'] : []}
        />
      </div>
    </div>
  );
};
