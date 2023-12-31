import { useState } from 'react';

import { css, type t } from './common';
import { SampleEdge } from './ui.Sample.Edge';
import { SampleMiddle } from './ui.Sample.Middle';

export type SampleProps = {
  left: t.SampleEdge;
  right: t.SampleEdge;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const [stream, setStream] = useState<MediaStream>();

  /**
   * Handlers
   */
  const onStreamSelection: t.PeerStreamSelectionHandler = (e) => setStream(e.selected);

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '250px 1fr 250px',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <SampleEdge edge={props.left} onStreamSelection={onStreamSelection} />
      <SampleMiddle left={props.left} right={props.right} stream={stream} />
      <SampleEdge edge={props.right} onStreamSelection={onStreamSelection} />
    </div>
  );
};
