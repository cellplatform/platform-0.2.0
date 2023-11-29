import { css, type t } from './common';
import { Connection } from '../ui.Connection';

export type SampleMiddleProps = {
  left: t.SampleEdge;
  right: t.SampleEdge;
  style?: t.CssValue;
};

export const SampleMiddle: React.FC<SampleMiddleProps> = (props) => {
  const left = Wrangle.connectionEdge(props.left);
  const right = Wrangle.connectionEdge(props.right);

  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid', gridTemplateRows: '1fr auto' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div></div>
      <Connection left={left} right={right} />
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  connectionEdge(edge: t.SampleEdge): t.ConnectionEdge {
    const { kind, network } = edge;
    return { kind, network };
  },
} as const;
