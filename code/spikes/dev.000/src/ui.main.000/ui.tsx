import { useEffect } from 'react';
import { COLORS, Color, Keyboard, PeerRepoList, PeerUI, css, rx, type t } from './common';

export type SampleLayoutProps = {
  model: t.RepoListModel;
  network: t.NetworkStore;
  selectedStream?: MediaStream;
  style?: t.CssValue;
};

export const SampleLayout: React.FC<SampleLayoutProps> = (props) => {
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
      <PeerRepoList model={props.model} network={network} focusOnLoad={true} avatarTray={false} />
    </div>
  );

  const elMain = (
    <PeerUI.Video stream={props.selectedStream} muted={true} style={styles.main} empty={''} />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elLeft}
      {elMain}
    </div>
  );
};
