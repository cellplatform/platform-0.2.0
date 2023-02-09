import { useEffect, useRef, useState } from 'react';

import { css, t } from './common';
import { ActionBar } from './ui.PeerList.Row.ActionBar';
import { RowBody } from './ui.PeerList.Row.Body';
import { RowThumbnail } from './ui.PeerList.Row.Thumbnail';

export type RowProps = {
  peerConnections: t.PeerConnectionSet;
  debug?: boolean;
  style?: t.CssValue;
};

export const Row: React.FC<RowProps> = (props) => {
  const { peerConnections, debug = true } = props;

  /**
   * [Handlers]
   */
  const onRowClick = () => {
    console.debug('peer(connections):', peerConnections);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      cursor: 'default',
    }),
    body: css({
      display: 'grid',
      gridTemplateColumns: '40px 10px 1fr 22px',
    }),
    peerid: css({
      Absolute: [null, null, -11, 0],
      fontSize: 7,
    }),
  };

  const elPeerId = debug && <div {...styles.peerid}>{`peer:${peerConnections.peer}`}</div>;

  return (
    <div {...css(styles.base, props.style)} onClick={onRowClick}>
      {elPeerId}
      <div {...styles.body}>
        <RowThumbnail peerConnections={peerConnections} />
        <div className={'gap'} />
        <RowBody peerConnections={peerConnections} />
        <ActionBar peerConnections={peerConnections} />
      </div>
    </div>
  );
};
