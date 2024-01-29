import { COLORS, Color, PeerRepoList, css, type t } from './common';

export type SampleEdgeProps = {
  edge: t.SampleEdge;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};

export const SampleEdge: React.FC<SampleEdgeProps> = (props) => {
  const { edge } = props;
  const visible = edge.visible ?? true;

  /**
   * Render
   */
  const border = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const styles = {
    base: css({
      width: 250,
      borderLeft: edge.kind === 'Right' ? border : undefined,
      borderRight: edge.kind === 'Left' ? border : undefined,
    }),
  };

  if (!visible) return <div />;

  return (
    <PeerRepoList
      model={edge.model}
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
    const dbname = edge.model.store.info.storage?.name ?? '';
    return dbname ? `repo:db:${dbname}` : '';
  },

  debugAlign(edge: t.SampleEdge): t.PeerRepoListPropsDebugLabel['align'] {
    return edge.kind;
  },
} as const;
