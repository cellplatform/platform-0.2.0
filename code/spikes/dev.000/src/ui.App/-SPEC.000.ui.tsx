import { useEffect, useState } from 'react';
import { COLORS, CmdBar, Color, PeerRepoList, PeerUI, css, type t } from './common';

export type ViewProps = {
  stream?: MediaStream;
  model: t.RepoListModel;
  network: t.NetworkStore;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};

export const View: React.FC<ViewProps> = (props) => {
  const { network } = props;
  const [lens, setLens] = useState<t.Lens>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const doc = network.shared.doc;
    if (doc) setLens(network.shared.namespace.lens('cmdbar', {}));
  }, [network.shared.doc.instance]);

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    body: css({
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
    footer: css({}),
  };

  const elLeft = (
    <div {...styles.left}>
      <PeerRepoList
        model={props.model}
        network={network}
        onStreamSelection={props.onStreamSelection}
        focusOnLoad={true}
      />
    </div>
  );

  const elMain = <PeerUI.Video stream={props.stream} muted={true} style={styles.main} empty={''} />;

  const elBody = (
    <div {...styles.body}>
      {elLeft}
      {elMain}
    </div>
  );

  const elFooter = <CmdBar doc={lens} style={styles.footer} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elBody}
      {elFooter}
    </div>
  );
};
