import { COLORS, Color, Icons, t } from './common';

export type PeerCtrlIconProps = {
  kind: t.WebRtcInfoPeerFacet;
  enabled?: boolean;
  isSelf?: boolean;
  isOff?: boolean;
  isOver?: boolean;
  keyboard?: t.KeyboardState;
  style?: t.CssValue;
};

export const PeerCtrlIcon: React.FC<PeerCtrlIconProps> = (props) => {
  const { kind, isOff, isOver, isSelf } = Wrangle.props(props);
  const color = Wrangle.color(props);
  const modifiers = props.keyboard?.current.modifiers;

  if (kind === 'Mic') {
    const Icon = isOff && !isOver ? Icons.Mic.Off : Icons.Mic.On;
    return <Icon size={14} color={color} />;
  }

  if (kind === 'Video') {
    const Icon = isOff && !isOver ? Icons.Video.Off : Icons.Video.On;
    return <Icon size={14} color={color} />;
  }

  if (kind === 'Screen') {
    const Icon = isOff && !isOver ? Icons.Screenshare.Stop : Icons.Screenshare.Start;
    return <Icon size={14} color={color} />;
  }

  if (kind === 'Identity') {
    return <Icons.Identity.Badge size={14} color={color} offset={[0, -1]} />;
  }

  if (kind === 'StateDoc') {
    const Icon = modifiers?.meta && !isSelf ? Icons.Close : Icons.Network.Docs;
    return <Icon size={15} color={color} />;
  }

  return <div>{`Icon not supported: '${kind}'`}</div>;
};

/**
 * Helpers
 */
const Wrangle = {
  props(props: PeerCtrlIconProps) {
    const { kind, enabled = true, isOff = false, isOver = false, isSelf = false } = props;
    return { kind, enabled, isOff, isOver, isSelf };
  },

  color(props: PeerCtrlIconProps) {
    const { enabled, isOff, isOver } = Wrangle.props(props);
    if (!enabled) return Color.alpha(COLORS.DARK, 0.8);
    if (isOver) return Color.alpha(COLORS.BLUE, 1);
    return Color.alpha(COLORS.DARK, isOff ? 0.3 : 0.8);
  },
};
