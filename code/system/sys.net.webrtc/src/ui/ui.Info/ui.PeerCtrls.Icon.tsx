import { COLORS, Color, Icons, t } from './common';

export type PeerCtrlIconProps = {
  kind: t.WebRtcInfoPeerFacet;
  enabled?: boolean;
  off?: boolean;
  over?: boolean;
  keyboard?: t.KeyboardState;
  style?: t.CssValue;
};

export const PeerCtrlIcon: React.FC<PeerCtrlIconProps> = (props) => {
  const { kind, off, over } = Wrangle.props(props);
  const color = Wrangle.color(props);
  const modifiers = props.keyboard?.current.modifiers;

  if (kind === 'Mic') {
    const Icon = off && !over ? Icons.Mic.Off : Icons.Mic.On;
    return <Icon size={14} color={color} />;
  }

  if (kind === 'Video') {
    const Icon = off && !over ? Icons.Video.Off : Icons.Video.On;
    return <Icon size={14} color={color} />;
  }

  if (kind === 'Screen') {
    const Icon = off && !over ? Icons.Screenshare.Stop : Icons.Screenshare.Start;
    return <Icon size={14} color={color} />;
  }

  if (kind === 'Identity') {
    return <Icons.Identity.Badge size={14} color={color} offset={[0, -1]} />;
  }

  if (kind === 'StateDoc') {
    const Icon = off && modifiers?.meta ? Icons.Close : Icons.Network.Docs;
    return <Icon size={15} color={color} />;
  }

  return <div>{`Icon not supported: '${kind}'`}</div>;
};

/**
 * Helpers
 */
const Wrangle = {
  props(props: PeerCtrlIconProps) {
    const { kind, enabled = true, off = false, over = false } = props;
    return { kind, enabled, off, over };
  },

  color(props: PeerCtrlIconProps) {
    const { enabled, off, over } = Wrangle.props(props);
    if (!enabled) return Color.alpha(COLORS.DARK, 0.8);
    if (over) return Color.alpha(COLORS.BLUE, 1);
    return Color.alpha(COLORS.DARK, off ? 0.3 : 0.8);
  },
};
