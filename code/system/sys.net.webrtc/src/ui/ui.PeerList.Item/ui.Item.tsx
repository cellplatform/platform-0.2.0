import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';
import { ActionBar } from './ui.Item.ActionBar';

export type PeerListItemProps = {
  // self: t.PeerId;
  // peer: t.PeerConnectionsByPeer;
  debug?: boolean;
  style?: t.CssValue;
};

export const PeerListItem: React.FC<PeerListItemProps> = (props) => {
  const { debug = false } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      cursor: 'default',

      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
    main: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    closeAction: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.main}>left</div>
      <div {...styles.closeAction}>
        <ActionBar onCloseRequest={() => console.log('close TODO')} />
      </div>
    </div>
  );
};
