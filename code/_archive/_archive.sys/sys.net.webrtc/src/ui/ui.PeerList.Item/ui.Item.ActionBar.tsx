import { useState } from 'react';
import { Button, Color, COLORS, css, Icons, type t } from '../common';

export type ActionBarProps = {
  // peerConnections: t.PeerConnectionsByPeer;
  style?: t.CssValue;
  onCloseRequest?: () => void;
};

export const ActionBar: React.FC<ActionBarProps> = (props) => {
  const [isCloseOver, setCloseOver] = useState(false);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      justifyContent: 'end',
      alignContent: 'center',
      padding: 10,
    }),
  };

  const elClose = (
    <Button
      onClick={props.onCloseRequest}
      onMouse={(e) => setCloseOver(e.isOver)}
      tooltip={'Close Connection'}
    >
      <Icons.Delete.Bin
        size={22}
        color={isCloseOver ? COLORS.RED : Color.alpha(COLORS.DARK, 0.7)}
      />
    </Button>
  );

  return <div {...css(styles.base, props.style)}>{elClose}</div>;
};
