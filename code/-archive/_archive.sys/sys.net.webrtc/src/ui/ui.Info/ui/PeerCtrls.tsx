import { COLORS, Color, DEFAULTS, FC, Keyboard, R, css, type t } from '../common';
import { PeerCtrlButton, PeerCtrlButtonProps } from './PeerCtrls.Button';

export type PeerCtrlsProps = {
  peerid: t.PeerId;
  spinning?: t.WebRtcInfoPeerFacet[];
  disabled?: t.WebRtcInfoPeerFacet[];
  off?: t.WebRtcInfoPeerFacet[];
  isSelf?: boolean;
  isOverParent?: boolean;
  style?: t.CssValue;
  spinnerColor?: string | number;
  onClick?: t.WebRtcInfoPeerCtrlsClickHandler;
};

const View: React.FC<PeerCtrlsProps> = (props) => {
  const { peerid, isSelf = false, isOverParent } = props;
  const keyboard = Keyboard.useKeyboardState();

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

  const tool = (facet: t.WebRtcInfoPeerFacet, options: Partial<PeerCtrlButtonProps> = {}) => {
    const is = {
      self: isSelf,
      spinning: Wrangle.is.spinning(props, facet),
      disabled: Wrangle.is.disabled(props, facet),
      off: Wrangle.is.off(props, facet),
    };
    const onClick = () => {
      const isClose = Wrangle.is.close(props, keyboard, facet);
      const kind = isClose ? 'Close' : facet;
      props.onClick?.({ kind, peerid, is });
    };
    return (
      <PeerCtrlButton
        {...options}
        kind={facet}
        isSelf={isSelf}
        isOff={is.off}
        isSpinning={is.spinning}
        isOverParent={isOverParent}
        enabled={!is.disabled}
        spinnerColor={props.spinnerColor}
        keyboard={keyboard}
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
      {tool('StateDoc', { paddingX: [5, 0] })}
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  is: {
    disabled(props: PeerCtrlsProps, kind: t.WebRtcInfoPeerFacet) {
      return includes(props.disabled, kind);
    },

    off(props: PeerCtrlsProps, kind: t.WebRtcInfoPeerFacet) {
      return includes(props.off, kind);
    },

    spinning(props: PeerCtrlsProps, kind: t.WebRtcInfoPeerFacet) {
      return includes(props.spinning, kind);
    },

    close(props: PeerCtrlsProps, keyboard: t.KeyboardState, facet: t.WebRtcInfoPeerFacet) {
      const { isSelf } = props;
      const modifiers = keyboard.current.modifiers;
      return !isSelf && facet === 'StateDoc' && modifiers?.alt;
    },
  },

  fields: {
    disabled(props: PeerCtrlsProps, kind: t.WebRtcInfoPeerFacet, value: boolean) {
      return fields(props.disabled, kind, value);
    },

    off(props: PeerCtrlsProps, kind: t.WebRtcInfoPeerFacet, value: boolean) {
      return fields(props.off, kind, value);
    },

    spinning(props: PeerCtrlsProps, kind: t.WebRtcInfoPeerFacet, value: boolean) {
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
export const PeerCtrls = FC.decorate<PeerCtrlsProps, Fields>(
  View,
  { FIELDS, Wrangle },
  { displayName: 'PeerCtrls' },
);
