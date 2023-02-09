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
      gridTemplateColumns: '40px 15px 1fr 30px',
    }),
  };

  return (
    <div {...css(styles.base, props.style)} onClick={onRowClick}>
      <div {...styles.body}>
        <RowThumbnail peerConnections={peerConnections} />
        <div className={'gap'} />
        <RowBody peerConnections={peerConnections} debug={debug} />
        <ActionBar peerConnections={peerConnections} />
      </div>
    </div>
  );
};
