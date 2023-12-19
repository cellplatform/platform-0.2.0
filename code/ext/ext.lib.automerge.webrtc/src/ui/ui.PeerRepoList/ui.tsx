import { COLORS, Color, RepoList, PeerUI, css, type t } from './common';
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
      <RepoList model={model} behaviors={['Shareable']} />
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
        <PeerUI.Connector
          peer={network.peer}
          behaviors={props.focusOnLoad ? ['Focus.OnLoad'] : []}
        />
      </div>
    </div>
  );
};
