import { COLORS, Color, Crdt, Webrtc, css, type t } from './common';

export type SampleEdgeProps = {
  edge: t.SampleEdge;
  focusOnLoad?: boolean;
  style?: t.CssValue;
};

export const SampleEdge: React.FC<SampleEdgeProps> = (props) => {
  const { edge } = props;

  /**
   * Render
   */
  const border = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const styles = {
    base: css({
      backgroundColor: COLORS.WHITE,
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
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
          muted={true}
          onSelection={(e) => {
            console.info(`⚡️ AvatarTray.onSelection`, e);
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