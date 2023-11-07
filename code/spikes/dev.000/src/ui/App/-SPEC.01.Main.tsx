import { UI as Crdt } from 'ext.lib.automerge';
import { UI as Webrtc } from 'ext.lib.peerjs';
import { COLORS, Color, css, type t } from '../common';

export type MainProps = {
  stream?: MediaStream;
  store: t.WebStore;
  style?: t.CssValue;
};

export const Main: React.FC<MainProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '250px 1fr',
    }),
    left: css({
      borderRight: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
    right: css({}),
  };

  const elLeft = (
    <div {...styles.left}>
      <Crdt.RepoList store={props.store} />
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
