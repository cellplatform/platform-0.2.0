import { COLORS, Color, RepoList, PeerUI, DEFAULTS, css, type t } from './common';
import { EdgeLabel } from './ui.EdgeLabel';

export const View: React.FC<t.PeerRepoListProps> = (props) => {
  const { model, network, debug = {} } = props;
  if (!(model && network)) return null;

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
      <RepoList model={model} behaviors={wrangle.repolistBehaviors(props)} />
      <div {...styles.footer}>
        <PeerUI.AvatarTray
          peer={network.peer}
          style={styles.avatars}
          muted={false}
          onSelection={(e) => {
            console.info(`⚡️ AvatarTray.onSelection`, e);
            props.onStreamSelection?.(e);
          }}
        />
        <PeerUI.Connector peer={network.peer} behaviors={wrangle.peerBehaviors(props)} />
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  repolistBehaviors(props: t.PeerRepoListProps): t.RepoListBehavior[] {
    const { shareable = DEFAULTS.shareable } = props;
    const res: t.RepoListBehavior[] = [];
    if (shareable) res.push('Shareable');
    if (props.focusOnLoad === 'RepoList') res.push('Focus.OnLoad');
    if (props.focusOnArrowKey === 'RepoList') res.push('Focus.OnArrowKey');
    return res;
  },

  peerBehaviors(props: t.PeerRepoListProps) {
    const res: t.ConnectorBehavior[] = [];
    if (props.focusOnLoad === 'Peer') res.push('Focus.OnLoad');
    if (props.focusOnArrowKey === 'Peer') res.push('Focus.OnArrowKey');
    return res;
  },
} as const;
