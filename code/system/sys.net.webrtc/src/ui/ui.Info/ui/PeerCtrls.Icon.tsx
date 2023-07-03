import { COLORS, Color, Icons, type t } from '../common';

export type PeerCtrlIconProps = {
  kind: t.WebRtcInfoPeerFacet;
  enabled?: boolean;
  isSelf?: boolean;
  isOff?: boolean;
  isOver?: boolean;
  isOverParent?: boolean;
  keyboard?: t.KeyboardState;
  style?: t.CssValue;
};

export const PeerCtrlIcon: React.FC<PeerCtrlIconProps> = (props) => {
  const { isOverParent } = props;
  const { kind, isOff, isOver, isSelf } = Wrangle.props(props);
  const color = Wrangle.color(props);
  const keyModifiers = props.keyboard?.current.modifiers;

  if (kind === 'Mic') {
    const Icon = isOff ? Icons.Mic.Off : Icons.Mic.On;
    return <Icon size={14} color={color} />;
  }

  if (kind === 'Video') {
    const Icon = isOff ? Icons.Video.Off : Icons.Video.On;
    return <Icon size={14} color={color} />;
  }

  if (kind === 'Screen') {
    const Icon = isOff ? Icons.Screenshare.Stop : Icons.Screenshare.Start;
    return <Icon size={14} color={color} />;
  }

  if (kind === 'Identity') {
    return <Icons.Identity.Badge size={14} color={color} offset={[0, -1]} />;
  }

  if (kind === 'StateDoc') {
    const isClose = keyModifiers?.alt && !isSelf;
    const Icon = isClose ? Icons.Close : Icons.Network.Nodes;
    const opacity = !isOver && isClose ? 0.3 : 1;
    const col = isClose && isOver ? COLORS.RED : color;
    return <Icon size={15} color={col} opacity={opacity} />;
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
    return Color.alpha(COLORS.DARK, isOff ? 0.5 : 0.8);
  },
};
