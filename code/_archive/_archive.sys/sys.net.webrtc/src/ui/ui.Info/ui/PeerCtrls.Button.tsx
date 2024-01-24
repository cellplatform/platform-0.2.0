import { useState } from 'react';
import { Button, COLORS, Spinner, css, type t } from '../common';
import { PeerCtrlIcon } from './PeerCtrls.Icon';

export type PeerCtrlButtonProps = {
  kind: t.WebRtcInfoPeerFacet;
  enabled?: boolean;
  isSelf?: boolean;
  isClickable?: boolean;
  isSpinning?: boolean;
  isOff?: boolean;
  isOverParent?: boolean;
  tooltip?: string;
  style?: t.CssValue;
  paddingX?: [number, number];
  spinnerColor?: string | number;
  keyboard?: t.KeyboardState;
  onClick?: () => void;
};

export const PeerCtrlButton: React.FC<PeerCtrlButtonProps> = (props) => {
  const {
    kind,
    isOff = false,
    isClickable = true,
    isSelf = false,
    isSpinning = false,
    isOverParent,
    paddingX = [5, 5],
    keyboard,
  } = props;

  const enabled = isClickable && (props.enabled ?? true);
  const disabledOpacity = isClickable ? 0.15 : 1;
  const [isOver, setOver] = useState(false);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid', placeItems: 'center' }),
    body: css({ marginLeft: paddingX[0], marginRight: paddingX[1] }),
    icon: css({
      display: 'grid',
      placeItems: 'center',
      opacity: isSpinning ? 0 : 1,
      transition: `opacity 0.15s ease`,
    }),
    spinner: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elSpinner = isSpinning && (
    <div {...styles.spinner}>
      <Spinner.Bar width={16} color={props.spinnerColor ?? COLORS.DARK} />
    </div>
  );

  const elIcon = (
    <div {...styles.icon}>
      <PeerCtrlIcon
        kind={kind}
        isSelf={isSelf}
        isOff={isOff}
        enabled={enabled}
        isOver={isOver}
        isOverParent={isOverParent}
        keyboard={keyboard}
      />
    </div>
  );

  return (
    <Button
      style={css(styles.base, props.style)}
      enabled={enabled}
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
