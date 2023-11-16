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
      gridTemplateColumns: '250px 1fr',
    }),
    left: css({ borderRight: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}` }),
    right: css({}),
  };

  const elLeft = (
    <div {...styles.left}>
      <Crdt.RepoList list={props.repo} />
    </div>
  );

  const elRight = <Webrtc.Video stream={props.stream} muted={true} style={styles.right} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elLeft}
      {elRight}
    </div>
  );
};
