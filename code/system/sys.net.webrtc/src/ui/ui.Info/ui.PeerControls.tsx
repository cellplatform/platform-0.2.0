import { COLORS, Color, DEFAULTS, FC, css, t } from './common';
import { Icon } from './ui.PeerControls.Icon';
import { ToolButton, ToolButtonProps } from './ui.ToolButton';

export type PeerFacetsHandler = (e: PeerFacetsHandlerArgs) => void;
export type PeerFacetsHandlerArgs = { kind: t.WebRtcInfoPeerFacet };

export type PeerControlsProps = {
  disabled?: t.WebRtcInfoPeerFacet[];
  selected?: t.WebRtcInfoPeerFacet[];
  spinning?: t.WebRtcInfoPeerFacet[];
  style?: t.CssValue;
  spinnerColor?: string | number;
  onClick?: PeerFacetsHandler;
};

const View: React.FC<PeerControlsProps> = (props) => {
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

  const tool = (kind: t.WebRtcInfoPeerFacet, options: Partial<ToolButtonProps> = {}) => {
    const disabled = Wrangle.disabled(props, kind);
    const selected = Wrangle.selected(props, kind);

    const enabled = !disabled;
    const onClick = () => props.onClick?.({ kind });
    return (
      <ToolButton
        {...options}
        enabled={enabled}
        selected={selected}
        spinning={Wrangle.spinning(props, kind)}
        spinnerColor={props.spinnerColor}
        onClick={onClick}
      >
        <Icon kind={kind} selected={selected} enabled={enabled} />
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
      {tool('StateDoc', { paddingX: [5, 0], clickable: false })}
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  disabled(props: PeerControlsProps, kind: t.WebRtcInfoPeerFacet) {
    return Wrangle.includes(props.disabled, kind);
  },

  selected(props: PeerControlsProps, kind: t.WebRtcInfoPeerFacet) {
    return Wrangle.includes(props.selected, kind);
  },

  spinning(props: PeerControlsProps, kind: t.WebRtcInfoPeerFacet) {
    return Wrangle.includes(props.spinning, kind);
  },

  includes(list: t.WebRtcInfoPeerFacet[] = [], kind: t.WebRtcInfoPeerFacet) {
    return list.includes(kind);
  },
};

/**
 * Export
 */
const FIELDS: t.WebRtcInfoPeerFacet[] = ['Video', 'Mic', 'Screen', 'Identity', 'StateDoc'];
type Fields = {
  FIELDS: typeof FIELDS;
};
export const PeerControls = FC.decorate<PeerControlsProps, Fields>(
  View,
  { FIELDS },
  { displayName: 'PeerFacets' },
);
