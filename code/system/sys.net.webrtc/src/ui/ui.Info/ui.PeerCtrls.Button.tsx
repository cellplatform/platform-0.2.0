import { useState } from 'react';
import { Button, COLORS, Spinner, css, t } from './common';
import { PeerCtrlIcon } from './ui.PeerCtrls.Icon';

export type PeerCtrlButtonProps = {
  kind: t.WebRtcInfoPeerFacet;
  clickable?: boolean;
  enabled?: boolean;
  off?: boolean;
  tooltip?: string;
  spinning?: boolean;
  style?: t.CssValue;
  paddingX?: [number, number];
  spinnerColor?: string | number;
  keyboard?: t.KeyboardState;
  onClick?: () => void;
};

export const PeerCtrlButton: React.FC<PeerCtrlButtonProps> = (props) => {
  const {
    kind,
    off = false,
    clickable = true,
    spinning = false,
    paddingX = [5, 5],
    keyboard,
  } = props;
  const enabled = clickable && (props.enabled ?? true);
  const disabledOpacity = clickable ? 0.15 : 1;

  const [isOver, setOver] = useState(false);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
    }),
    body: css({
      marginLeft: paddingX[0],
      marginRight: paddingX[1],
    }),
    icon: css({
      display: 'grid',
      placeItems: 'center',
      opacity: spinning ? 0 : 1,
      transition: `opacity 0.15s ease`,
    }),
    spinner: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elSpinner = spinning && (
    <div {...styles.spinner}>
      <Spinner.Bar width={16} color={props.spinnerColor ?? COLORS.DARK} />
    </div>
  );

  const elIcon = (
    <div {...styles.icon}>
      <PeerCtrlIcon kind={kind} off={off} enabled={enabled} over={isOver} keyboard={keyboard} />
    </div>
  );

  return (
    <Button
      style={css(styles.base, props.style)}
      isEnabled={enabled}
      disabledOpacity={disabledOpacity}
      tooltip={props.tooltip}
      onClick={props.onClick}
      onMouse={(e) => setOver(e.isOver)}
    >
      <div {...styles.body}>
        {elIcon}
        {elSpinner}
      </div>
    </Button>
  );
};
