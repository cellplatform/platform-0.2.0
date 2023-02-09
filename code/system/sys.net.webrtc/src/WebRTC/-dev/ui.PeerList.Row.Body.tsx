import { useState } from 'react';
import {
  AudioWaveform,
  Button,
  Color,
  COLORS,
  css,
  Icons,
  MediaStream,
  Spinner,
  t,
  useSizeObserver,
} from './common';

export type RowBodyProps = {
  peerConnections: t.PeerConnectionSet;
  style?: t.CssValue;
};

export const RowBody: React.FC<RowBodyProps> = (props) => {
  const { peerConnections } = props;

  const media = peerConnections.media.find((item) => item.stream)?.stream;
  const video = media?.remote;
  const size = useSizeObserver();

  /**
   * [Handlers]
   */
  const startScreenShare = () => {
    /**
     * TODO 🐷
     * - [ ] Fire event through bus API.
     */
    console.log('peerConnections', peerConnections);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
    }),
    body: css({
      Absolute: [5, 5, 7, 5],
      Flex: 'x-center-start',
    }),
    waveform: css({ Absolute: [null, 0, -7, 0] }),
    btn: css({
      display: 'grid',
      placeItems: 'center',
      marginRight: 8,
    }),
  };

  const elWaveform = video && size.ready && (
    <AudioWaveform
      style={styles.waveform}
      height={20}
      width={size.rect.width}
      stream={video}
      lineWidth={0.5}
      lineColor={Color.alpha(COLORS.CYAN, 0.8)}
    />
  );

  const elScreenShare = (
    <Button style={styles.btn} onClick={startScreenShare} tooltip={'Start Screenshare'}>
      <Icons.Screenshare size={22} />
    </Button>
  );

  return (
    <div ref={size.ref} {...css(styles.base, props.style)}>
      <div {...styles.body}>
        {elScreenShare}
        {elScreenShare}
        {elScreenShare}
      </div>
      {elWaveform}
    </div>
  );
};
