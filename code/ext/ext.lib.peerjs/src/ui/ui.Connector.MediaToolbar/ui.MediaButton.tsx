import { useState } from 'react';
import { Button, COLORS, Icons, Spinner, css, type t } from './common';
import { Wrangle } from './Wrangle';

export const MediaButton: React.FC<t.MediaToolbarButtonProps> = (props) => {
  const { mediaKind, peer } = props;

  const [over, setOver] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const enabled = !spinning;

  const startMedia = async () => {
    if (spinning) return;
    setSpinning(true);
    const hasConn = Wrangle.hasConnectionOfKind(props, mediaKind);
    const remoteid = Wrangle.remoteid(props);
    if (!hasConn && remoteid) await peer?.connect.media(mediaKind, remoteid);
    setSpinning(false);
  };

  /**
   * Render
   */
  const iconColor = Wrangle.iconColor(props);
  const Size = 20;
  const styles = {
    base: css({ Size, position: 'relative', pointerEvents: enabled ? 'auto' : 'none' }),
    body: css({ Size, position: 'relative', display: 'grid', placeItems: 'center' }),
    spinner: css({ Absolute: 0, position: 'relative', display: 'grid', placeItems: 'center' }),
    icon: css({
      opacity: Wrangle.iconOpacity(props, { spinning, over }),
      transition: `opacity 0.1s`,
      filter: `blur(${spinning ? 2 : 0}px)`,
    }),
  };

  const Icon = WrangleLocal.icon(props);

  const elSpinner = spinning && (
    <div {...styles.spinner}>
      <Spinner.Bar width={20} color={iconColor} />
    </div>
  );

  return (
    <Button
      style={css(styles.base, props.style)}
      onClick={startMedia}
      onMouse={(e) => setOver(e.isOver)}
    >
      <div {...styles.body}>
        <Icon size={17} color={iconColor} style={styles.icon} />
        {elSpinner}
      </div>
    </Button>
  );
};

/**
 * Helpers
 */
const WrangleLocal = {
  icon(props: t.MediaToolbarButtonProps) {
    const { mediaKind } = props;
    if (mediaKind === 'media:video') return Icons.Face;
    if (mediaKind === 'media:screen') return Icons.Screen;
    return Icons.Error;
  },

  tooltip(props: t.MediaToolbarButtonProps) {
    const { mediaKind } = props;
    const hasConn = Wrangle.hasConnectionOfKind(props, props.mediaKind);
    const prefix = hasConn ? 'Start' : 'Stop';
    if (mediaKind === 'media:video') return `${prefix} video`;
    if (mediaKind === 'media:screen') return `${prefix} screenshare`;
    return undefined;
  },
} as const;
