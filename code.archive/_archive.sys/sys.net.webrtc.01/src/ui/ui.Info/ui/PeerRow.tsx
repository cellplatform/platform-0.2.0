import { COLORS, Color, DEFAULTS, Icons, css, type t } from '../common';
import { PeerCtrls } from './PeerCtrls';
import { VideoThumbnails } from './PeerRow.Video';
import { usePeerRowController } from '../hooks/usePeerRowController.mjs';

export type PeerRowProps = {
  peerid: t.PeerId;
  client?: t.WebRtcEvents;
  media?: t.PeerMediaConnection[];
  isSelf?: boolean;
  isSelected?: boolean;
  isOverParent?: boolean;
  useController?: boolean;
  style?: t.CssValue;
  onSelect?: t.WebRtcInfoPeerRowSelectHandler;
  onCtrlClick?: t.WebRtcInfoPeerCtrlsClickHandler;
};

export const PeerRow: React.FC<PeerRowProps> = (props) => {
  const { client, peerid, isSelected, isSelf, isOverParent, media = [] } = props;

  const ctrlr = usePeerRowController({
    peerid,
    client,
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
    leftContent: css({ Flex: 'x-center-center' }),
    label: css({ opacity: 0.3 }),
    selected: css({
      Size: 5,
      borderRadius: 5,
      backgroundColor: COLORS.BLUE,
      opacity: isSelected ? 1 : 0,
    }),
  };

  const elMeLabel = isSelf && media.length === 0 && <div {...styles.label}>{'me'}</div>;

  const elMedia = (
    <VideoThumbnails peerid={peerid} media={media} state={ctrlr.state.peer} isSelf={isSelf} />
  );

  const elLeft = (
    <div {...styles.left} onMouseDown={() => props.onSelect?.({ peerid })}>
      <div {...styles.selected} />
      <Icons.Person size={15} color={icoColor} style={styles.icoPerson} />
      <div {...styles.leftContent}>
        {elMeLabel}
        {elMedia}
      </div>
      <div />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elLeft}
      <PeerCtrls
        peerid={peerid}
        off={ctrlr.off}
        disabled={ctrlr.disabled}
        spinning={ctrlr.spinning}
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
