import { COLORS, Color, DEFAULTS, Icons, css, t } from './common';
import { PeerCtrls } from './ui.PeerCtrls';
import { usePeerRowController } from './usePeerRowController.mjs';

export type PeerRowProps = {
  peerid: t.PeerId;
  events?: t.WebRtcEvents;
  isSelf?: boolean;
  isSelected?: boolean;
  isOverParent?: boolean;
  useController?: boolean;
  style?: t.CssValue;
  onSelect?: t.WebRtcInfoPeerRowSelectHandler;
  onCtrlClick?: t.WebRtcInfoPeerCtrlsClickHandler;
};

export const PeerRow: React.FC<PeerRowProps> = (props) => {
  const { events, peerid, isSelected, isSelf, isOverParent } = props;

  const ctrlr = usePeerRowController({
    peerid,
    events,
    isSelf,
    enabled: props.useController ?? false,
  });

  /**
   * [Render]
   */
  const icoColor = Color.alpha(COLORS.DARK, 0.8);
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      userSelect: 'none',
      fontSize: DEFAULTS.fontSize,
      minHeight: DEFAULTS.minRowHeight,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
    icoPerson: css({
      transform: isSelf ? `scaleX(-1)` : undefined,
    }),
    left: css({
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: 'auto auto auto 1fr',
      columnGap: 5,
    }),
    label: css({ opacity: 0.3 }),
    selected: css({
      Size: 5,
      borderRadius: 5,
      backgroundColor: COLORS.BLUE,
      opacity: isSelected ? 1 : 0,
    }),
  };

  const elLeft = (
    <div {...styles.left} onMouseDown={() => props.onSelect?.({ peerid })}>
      <div {...styles.selected} />
      <Icons.Person size={15} color={icoColor} style={styles.icoPerson} />
      <div {...styles.label}>{isSelf ? 'me' : ''}</div>
      <div />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elLeft}
      <PeerCtrls
        peerid={peerid}
        off={ctrlr.off}
        isSelf={isSelf}
        isOverParent={isOverParent}
        onClick={(e) => {
          ctrlr.onCtrlClick(e);
          props.onCtrlClick?.(e);
        }}
      />
    </div>
  );
};
