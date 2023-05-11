import { useState } from 'react';
import { COLORS, Color, DEFAULTS, Icons, css, t } from './common';
import { PeerControls } from './ui.PeerControls';

export type PeerRowProps = {
  self?: t.Peer;
  data?: t.NetworkStatePeer;
  selected?: boolean;
  style?: t.CssValue;
};

export const PeerRow: React.FC<PeerRowProps> = (props) => {
  const { self, data, selected } = props;
  if (!self || !data) return null;

  const isSelf = self.id === data.id;
  const [muted, setMuted] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const connections = self.connectionsByPeer.find(({ peer }) => peer.remote === data.id);
  console.log('connections', connections); // TEMP 🐷

  /**
   * Handlers
   */
  const connect = async () => {
    setSpinning(true);

    console.log('connect');
    const res = await self.media(data.id, 'camera');
    console.log('connect:res', res);

    setSpinning(false);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      userSelect: 'none',
      fontSize: DEFAULTS.fontSize,
      minHeight: DEFAULTS.minRowHeight,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
    }),
    icoPerson: css({
      transform: isSelf ? `scaleX(-1)` : undefined,
    }),

    left: css({
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: 'auto auto 1fr',
      columnGap: 5,
    }),
    label: css({ opacity: 0.3 }),
    selected: css({
      Size: 5,
      borderRadius: 5,
      backgroundColor: COLORS.BLUE,
      opacity: selected ? 1 : 0,
    }),
  };

  const icoColor = Color.alpha(COLORS.DARK, 0.8);

  const elLeft = (
    <div {...styles.left}>
      <div {...styles.selected} />
      <Icons.Person size={15} color={icoColor} style={styles.icoPerson} />
      <div {...styles.label}>{isSelf ? 'me' : ''}</div>
    </div>
  );

  const elRight = <PeerControls />;

  return (
    <div {...css(styles.base, props.style)}>
      {elLeft}
      <div />
      {elRight}
    </div>
  );
};
