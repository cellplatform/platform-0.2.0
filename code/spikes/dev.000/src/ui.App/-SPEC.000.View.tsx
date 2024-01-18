import { COLORS, Color, PeerRepoList, PeerUI, css, type t } from './common';

export type ViewProps = {
  stream?: MediaStream;
  model: t.RepoListModel;
  network: t.NetworkStore;
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
        model={props.model}
        network={props.network}
        onStreamSelection={props.onStreamSelection}
        focusOnLoad={true}
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
