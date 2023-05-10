import { COLORS, Color, Icons, t } from './common';

export type IconProps = {
  kind: t.WebRtcInfoPeerControl;
  style?: t.CssValue;
};

export const Icon: React.FC<IconProps> = (props) => {
  const { kind } = props;
  const color = Color.alpha(COLORS.DARK, 0.8);

  if (kind === 'Mic') {
    return <Icons.Mic.On size={14} color={color} />;
  }

  if (kind === 'Video') {
    return <Icons.Video.On size={14} color={color} />;
  }

  if (kind === 'Screen') {
    return <Icons.Screenshare.Start size={14} color={color} />;
  }

  if (kind === 'Identity') {
    return <Icons.Identity.Badge size={14} color={color} offset={[0, -1]} />;
  }

  if (kind === 'StateDoc') {
    return <Icons.Network.Docs size={15} color={color} />;
  }

  return <div>{`Icon not supported: '${kind}'`}</div>;
};
