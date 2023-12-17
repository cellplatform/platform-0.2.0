import { COLORS, Color, css, type t } from './common';
import { PeerRepoList } from '../ui.PeerRepoList';

export type SampleEdgeProps = {
  edge: t.SampleEdge;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};

export const SampleEdge: React.FC<SampleEdgeProps> = (props) => {
  const { edge } = props;
  /**
   * Render
   */
  const border = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const styles = {
    base: css({
      borderLeft: edge.kind === 'Right' ? border : undefined,
      borderRight: edge.kind === 'Left' ? border : undefined,
    }),
  };

  return (
    <PeerRepoList edge={edge} style={styles.base} onStreamSelection={props.onStreamSelection} />
  );
};
