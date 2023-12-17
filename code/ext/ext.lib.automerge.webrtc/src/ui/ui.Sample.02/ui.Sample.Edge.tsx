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
    <PeerRepoList
      repo={edge.repo}
      network={edge.network}
      style={styles.base}
      debug={{
        label: {
          text: wrangle.debugLabelText(edge),
          align: wrangle.debugAlign(edge),
        },
      }}
      onStreamSelection={props.onStreamSelection}
    />
  );
};

/**
 * Helpers
 */
const wrangle = {
  debugLabelText(edge: t.SampleEdge) {
    const dbname = edge.repo.store.info.storage?.name ?? '';
    return dbname ? `repo:db:${dbname}` : '';
  },

  debugAlign(edge: t.SampleEdge): t.PeerRepoListPropsDebugLabel['align'] {
    return edge.kind;
  },
} as const;
