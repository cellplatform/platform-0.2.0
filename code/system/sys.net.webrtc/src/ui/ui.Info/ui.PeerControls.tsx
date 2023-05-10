import { COLORS, Color, DEFAULTS, css, t } from './common';
import { Icon } from './ui.PeerControls.Icon';
import { ToolButton } from './ui.ToolButton';

export type PeerControlsProps = {
  style?: t.CssValue;
};

export const PeerControls: React.FC<PeerControlsProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      userSelect: 'none',
      fontSize: DEFAULTS.fontSize,
      minHeight: DEFAULTS.minRowHeight,
      display: 'grid',
      gridTemplateColumns: 'repeat(7, auto)',
    }),
    div: css({
      position: 'relative',
      backgroundColor: Color.alpha(COLORS.DARK, 0.12),
      width: 1,
      MarginX: 10,
    }),
  };

  const icon = (kind: t.WebRtcInfoPeerControl) => <Icon kind={kind} />;

  const elDivider = <div {...styles.div} />;

  return (
    <div {...css(styles.base, props.style)}>
      <ToolButton>{icon('Video')}</ToolButton>
      <ToolButton>{icon('Mic')}</ToolButton>
      <ToolButton>{icon('Screen')}</ToolButton>
      {elDivider}
      <ToolButton>{icon('Identity')}</ToolButton>
      {elDivider}
      <ToolButton style={{ paddingRight: 0 }}>{icon('StateDoc')}</ToolButton>
    </div>
  );
};
