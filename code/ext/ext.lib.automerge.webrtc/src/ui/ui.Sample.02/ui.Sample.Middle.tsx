import { css, type t } from './common';
import { Footer } from './ui.Sample.Middle.Footer';
import { usePeerMonitor } from './use.Peer.Monitor';

export type SampleMiddleProps = {
  left: t.SampleEdge;
  right: t.SampleEdge;
  style?: t.CssValue;
};

export const SampleMiddle: React.FC<SampleMiddleProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div></div>
      <Footer left={props.left} right={props.right} />
    </div>
  );
};
