import { UI as Crdt } from 'ext.lib.automerge';
import { UI as Webrtc } from 'ext.lib.peerjs';
import { COLORS, Color, css, type t } from './common';

export type ViewProps = {
  stream?: MediaStream;
  repo: t.RepoListModel;
  style?: t.CssValue;
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
    }),
    main: css({}),
  };

  const elLeft = (
    <div {...styles.left}>
      <Crdt.RepoList list={props.repo} />
    </div>
  );

  const elMain = <Webrtc.Video stream={props.stream} muted={true} style={styles.main} empty={''} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elLeft}
      {elMain}
    </div>
  );
};
