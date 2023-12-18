import { PeerRepoList } from 'ext.lib.automerge.webrtc';
import { PeerUI } from 'ext.lib.peerjs';
import { COLORS, Color, css, type t } from './common';

export type ViewProps = {
  stream?: MediaStream;
  repo: t.RepoListModel;
  network: t.WebrtcStore;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};

export const View: React.FC<ViewProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '230px 1fr',
    }),
    left: css({
      backgroundColor: Color.alpha(COLORS.WHITE, 0.8),
      backdropFilter: 'blur(20px)',
      borderRight: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      display: 'grid',
    }),
    main: css({}),
  };

  const elLeft = (
    <div {...styles.left}>
      <PeerRepoList
        repo={props.repo}
        network={props.network}
        onStreamSelection={props.onStreamSelection}
      />
    </div>
  );

  const elMain = <PeerUI.Video stream={props.stream} muted={true} style={styles.main} empty={''} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elLeft}
      {elMain}
    </div>
  );
};
