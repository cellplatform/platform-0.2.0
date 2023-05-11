import { COLORS, Color, DEFAULTS, FC, R, css, t } from './common';
import { PeerControlButton, PeerControlButtonProps } from './ui.PeerControls.Button';

export type PeerControlsClickHandler = (e: PeerControlsClickHandlerArgs) => void;
export type PeerControlsClickHandlerArgs = {
  kind: t.WebRtcInfoPeerFacet;
  peerid: t.PeerId;
  is: { spinning: boolean; disabled: boolean; off: boolean };
};

export type PeerControlsProps = {
  peerid: t.PeerId;
  spinning?: t.WebRtcInfoPeerFacet[];
  off?: t.WebRtcInfoPeerFacet[];
  disabled?: t.WebRtcInfoPeerFacet[];
  style?: t.CssValue;
  spinnerColor?: string | number;
  onClick?: PeerControlsClickHandler;
};

const View: React.FC<PeerControlsProps> = (props) => {
  const { peerid } = props;

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

  const tool = (kind: t.WebRtcInfoPeerFacet, options: Partial<PeerControlButtonProps> = {}) => {
    const is = {
      spinning: Wrangle.is.spinning(props, kind),
      disabled: Wrangle.is.disabled(props, kind),
      off: Wrangle.is.off(props, kind),
    };
    const enabled = !is.disabled;
    const onClick = () => props.onClick?.({ kind, peerid, is });
    return (
      <PeerControlButton
        {...options}
        kind={kind}
        enabled={enabled}
        off={is.off}
        spinning={is.spinning}
        spinnerColor={props.spinnerColor}
        onClick={onClick}
      />
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
  is: {
    disabled(props: PeerControlsProps, kind: t.WebRtcInfoPeerFacet) {
      return includes(props.disabled, kind);
    },

    off(props: PeerControlsProps, kind: t.WebRtcInfoPeerFacet) {
      return includes(props.off, kind);
    },

    spinning(props: PeerControlsProps, kind: t.WebRtcInfoPeerFacet) {
      return includes(props.spinning, kind);
    },
  },

  fields: {
    disabled(props: PeerControlsProps, kind: t.WebRtcInfoPeerFacet, value: boolean) {
      return fields(props.disabled, kind, value);
    },

    off(props: PeerControlsProps, kind: t.WebRtcInfoPeerFacet, value: boolean) {
      return fields(props.off, kind, value);
    },

    spinning(props: PeerControlsProps, kind: t.WebRtcInfoPeerFacet, value: boolean) {
      return fields(props.spinning, kind, value);
    },
  },
};

function includes(list: t.WebRtcInfoPeerFacet[] = [], kind: t.WebRtcInfoPeerFacet) {
  return list.includes(kind);
}

function fields(list: t.WebRtcInfoPeerFacet[] = [], kind: t.WebRtcInfoPeerFacet, value: boolean) {
  return value ? R.uniq([...list, kind]) : list.filter((item) => item !== kind);
}

/**
 * Export
 */
const FIELDS: t.WebRtcInfoPeerFacet[] = ['Video', 'Mic', 'Screen', 'Identity', 'StateDoc'];
type Fields = {
  FIELDS: typeof FIELDS;
  Wrangle: typeof Wrangle;
};
export const PeerControls = FC.decorate<PeerControlsProps, Fields>(
  View,
  { FIELDS, Wrangle },
  { displayName: 'PeerFacets' },
);
