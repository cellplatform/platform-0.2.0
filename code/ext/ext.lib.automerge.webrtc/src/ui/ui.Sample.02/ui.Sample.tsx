import { useState } from 'react';

import { PeerRepoList } from '../ui.PeerRepoList';
import { COLORS, Color, css, type t } from './common';
import { SampleMiddle } from './ui.Sample.Middle';

export type SampleProps = {
  left: t.SampleEdge;
  right: t.SampleEdge;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const border = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
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
    left: css({ borderRight: border }),
    right: css({ borderLeft: border }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PeerRepoList edge={props.left} style={styles.left} onStreamSelection={onStreamSelection} />
      <SampleMiddle left={props.left} right={props.right} stream={stream} />
      <PeerRepoList edge={props.right} style={styles.right} onStreamSelection={onStreamSelection} />
    </div>
  );
};
