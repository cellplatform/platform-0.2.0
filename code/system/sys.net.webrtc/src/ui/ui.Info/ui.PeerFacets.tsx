import { COLORS, Color, DEFAULTS, FC, css, t } from './common';
import { Icon } from './ui.PeerFacets.Icon';
import { ToolButton, ToolButtonProps } from './ui.ToolButton';

export type PeerFacetsHandler = (e: PeerFacetsHandlerArgs) => void;
export type PeerFacetsHandlerArgs = { kind: t.WebRtcInfoPeerFacet };

export type PeerFacetsProps = {
  style?: t.CssValue;
  disabled?: t.WebRtcInfoPeerFacet[];
  onClick?: PeerFacetsHandler;
};

const View: React.FC<PeerFacetsProps> = (props) => {
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
      columnGap: 1,
    }),
    div: css({
      position: 'relative',
      backgroundColor: Color.alpha(COLORS.DARK, 0.12),
      width: 1,
      MarginX: 10,
    }),
  };

  const icon = (kind: t.WebRtcInfoPeerFacet) => <Icon kind={kind} />;
  const tool = (kind: t.WebRtcInfoPeerFacet, options: Partial<ToolButtonProps> = {}) => {
    const disabled = Wrangle.disabled(props, kind);
    const onClick = () => props.onClick?.({ kind });
    return (
      <ToolButton {...options} enabled={!disabled} onClick={onClick}>
        {icon(kind)}
      </ToolButton>
    );
  };

  const elDivider = <div {...styles.div} />;

  return (
    <div {...css(styles.base, props.style)}>
      {tool('Video')}
      {tool('Mic')}
      {tool('Screen')}
      {elDivider}
      {tool('Identity')}
      {elDivider}
      {tool('StateDoc', { style: { paddingRight: 0 } })}
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  disabled(props: PeerFacetsProps, kind: t.WebRtcInfoPeerFacet) {
    return (props.disabled ?? []).includes(kind);
  },
};

/**
 * Export
 */
const FIELDS: t.WebRtcInfoPeerFacet[] = ['Mic', 'Video', 'Screen', 'Identity', 'StateDoc'];
type Fields = {
  FIELDS: typeof FIELDS;
};
export const PeerFacets = FC.decorate<PeerFacetsProps, Fields>(
  View,
  { FIELDS },
  { displayName: 'PeerFacets' },
);
