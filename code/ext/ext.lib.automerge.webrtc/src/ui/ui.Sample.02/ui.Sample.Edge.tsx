import { COLORS, Color, Crdt, Webrtc, css, type t } from './common';
import { EdgeLabel } from './ui.Sample.Edge.Label';

export const SampleEdge: React.FC<t.SampleEdgeProps> = (props) => {
  const { edge } = props;

  /**
   * Render
   */
  const border = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: COLORS.WHITE,
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    footer: css({ borderTop: border }),
    avatars: css({ padding: 8, borderBottom: border }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <EdgeLabel edge={edge} offsetLabel={props.offsetLabel} />
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
