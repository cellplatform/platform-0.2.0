import { useState } from 'react';
import { Wrangle } from './Wrangle';
import { Button, Icons, Spinner, css, type t } from './common';

export const MediaButton: React.FC<t.MediaToolbarButtonProps> = (props) => {
  const { kind, peer } = props;

  const [over, setOver] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const enabled = !spinning;

  /**
   * Event handler
   */
  const handleClick = async () => {
    if (!peer || spinning) return;

    const existing = Wrangle.connectionOfKind(props, kind);
    const hasConn = existing.length > 0;
    const remoteid = Wrangle.remoteid(props);

    if (hasConn) {
      existing.forEach((conn) => peer?.disconnect(conn.id));
    }

    if (!hasConn && remoteid) {
      setSpinning(true);
      await peer?.connect.media(kind, remoteid);
      setSpinning(false);
    }
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
      onClick={handleClick}
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
    const { kind } = props;
    if (kind === 'media:video') return Icons.Face;
    if (kind === 'media:screen') return Icons.Screen;
    return Icons.Error;
  },

  tooltip(props: t.MediaToolbarButtonProps) {
    const { kind } = props;
    const hasConn = Wrangle.hasConnectionOfKind(props, kind);
    const prefix = hasConn ? 'Start' : 'Stop';
    if (kind === 'media:video') return `${prefix} video`;
    if (kind === 'media:screen') return `${prefix} screenshare`;
    return undefined;
  },
} as const;
