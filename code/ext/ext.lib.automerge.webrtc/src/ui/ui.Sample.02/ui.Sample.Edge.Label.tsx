import { COLORS, Color, css, useMouse, type t } from './common';

export type EdgeLabelProps = {
  edge: t.SampleEdge;
  offsetLabel?: t.SampleEdgeLabel;
  style?: t.CssValue;
};

export const EdgeLabel: React.FC<EdgeLabelProps> = (props) => {
  const { edge, offsetLabel = { text: wrangle.defaultLabelText(props) } } = props;
  const mouse = useMouse();

  if (!offsetLabel.text) return null;

  /**
   * Render
   */
  const styles = {
    base: css({
      Absolute: offsetLabel.absolute ?? [-20, 0, null, 0],
      userSelect: 'none',
      fontFamily: 'monospace',
      fontSize: 9,
      color: Color.alpha(COLORS.DARK, mouse.is.over ? 1 : 0.15),
      transition: `color 0.2s`,
      display: 'grid',
      justifyContent: edge.kind === 'Left' ? 'start' : 'end',
      PaddingX: 8,
    }),
  };

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <div>{offsetLabel.text}</div>
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  defaultLabelText(props: t.SampleEdgeProps) {
    const { edge } = props;
    const dbname = edge.repo.store.info.storage?.name;
    return `repo:db:${dbname}` ?? '';
  },
} as const;
