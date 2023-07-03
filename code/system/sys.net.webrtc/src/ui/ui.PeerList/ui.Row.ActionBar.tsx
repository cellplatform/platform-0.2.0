import { useState } from 'react';
import { Button, Color, COLORS, css, Icons, type t } from '../common';

export type ActionBarProps = {
  peerConnections: t.PeerConnectionsByPeer;
  style?: t.CssValue;
};

export const ActionBar: React.FC<ActionBarProps> = (props) => {
  const [isCloseOver, setCloseOver] = useState(false);

  /**
   * [Handlers]
   */
  const close = () => {
    props.peerConnections.data.forEach((data) => data.dispose());
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      justifyContent: 'end',
      alignContent: 'center',
    }),
  };

  const elClose = (
    <Button onClick={close} onMouse={(e) => setCloseOver(e.isOver)} tooltip={'Close Connection'}>
      <Icons.Delete.Bin
        size={22}
        color={isCloseOver ? COLORS.RED : Color.alpha(COLORS.DARK, 0.7)}
      />
    </Button>
  );

  return <div {...css(styles.base, props.style)}>{elClose}</div>;
};
