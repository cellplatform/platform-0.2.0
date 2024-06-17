import { css, type t } from './common';
import { SampleEdge } from './ui.Subject.Edge';
import { SampleMiddle } from './ui.Subject.Middle';

export type SampleProps = {
  left: t.SampleEdge;
  right: t.SampleEdge;
  overlay?: JSX.Element;
  stream?: MediaStream;
  style?: t.CssValue;
  onStreamSelection?: t.PeerStreamSelectionHandler;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const { stream, onStreamSelection } = props;

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative' }),
    body: css({ Absolute: 0, display: 'grid', gridTemplateColumns: 'auto 1fr auto' }),
    overlay: css({ Absolute: 0, display: 'grid' }),
  };

  const elBody = (
    <div {...styles.body}>
      <SampleEdge edge={props.left} onStreamSelection={onStreamSelection} />
      <SampleMiddle left={props.left} right={props.right} stream={stream} />
      <SampleEdge edge={props.right} onStreamSelection={onStreamSelection} />
    </div>
  );

  const elOverlay = props.overlay && <div {...styles.overlay}>{props.overlay}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elBody}
      {elOverlay}
    </div>
  );
};
