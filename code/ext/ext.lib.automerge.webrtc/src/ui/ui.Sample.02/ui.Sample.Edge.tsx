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
      width: visible ? 250 : 0,
      overflow: 'hidden',
      borderLeft: visible && edge.kind === 'Right' ? border : undefined,
      borderRight: visible && edge.kind === 'Left' ? border : undefined,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PeerRepoList
        model={edge.model}
        network={edge.network}
        debug={{
          label: {
            text: wrangle.debugLabelText(edge),
            align: wrangle.debugAlign(edge),
          },
        }}
        onStreamSelection={props.onStreamSelection}
      />
    </div>
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
