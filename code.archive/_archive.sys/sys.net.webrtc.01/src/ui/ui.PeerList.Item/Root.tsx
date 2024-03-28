import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, type t, rx } from '../common';
import { ActionBar } from './ui.Item.ActionBar';

export type PeerListItemProps = {
  connections?: t.PeerConnectionsByPeer;
  debug?: boolean;
  style?: t.CssValue;
  onCloseRequest?: () => void;
};

export const PeerListItem: React.FC<PeerListItemProps> = (props) => {
  const { debug = false } = props;
  if (!props.connections) return null;

  const peer = props.connections.peer;

  console.log('peer', peer);
  console.log('connetions', props.connections);

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
        <ActionBar onCloseRequest={props.onCloseRequest} />
      </div>
    </div>
  );
};
