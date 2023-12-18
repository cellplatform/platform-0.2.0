import { COLORS, Color, RepoList, Webrtc, css, type t } from './common';
import { EdgeLabel } from './ui.EdgeLabel';

export const View: React.FC<t.PeerRepoListProps> = (props) => {
  const { repo, network, debug = {} } = props;

  if (!(repo && network)) return null;

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

  const elDebugLabel = debug.label && <EdgeLabel {...debug.label} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elDebugLabel}
      <RepoList list={repo} behaviors={['Shareable']} />
      <div {...styles.footer}>
        <Webrtc.AvatarTray
          peer={network.peer}
          style={styles.avatars}
          muted={false}
          onSelection={(e) => {
            console.info(`⚡️ AvatarTray.onSelection`, e);
            props.onStreamSelection?.(e);
          }}
        />
        <Webrtc.Connector
          peer={network.peer}
          behaviors={props.focusOnLoad ? ['Focus.OnLoad'] : []}
        />
      </div>
    </div>
  );
};
