import { m } from 'framer-motion';

import { AudioWaveform } from '../AudioWaveform';
import { Icons } from '../Icons';
import { Color, BUTTON_COLORS, css, t, transition } from './common';
import { RecordButtonState } from './types';

export type RecordingProps = {
  isEnabled: boolean;
  stream?: MediaStream;
  width: number;
  state: RecordButtonState;
  style?: t.CssValue;
  onClick?: () => void;
};

export const Recording: React.FC<RecordingProps> = (props) => {
  const { isEnabled, state, width, stream } = props;
  const opacity = isEnabled && state === 'recording' ? 1 : 0;

  let scale = 1;
  if (isEnabled) {
    if (state === 'default') scale = 0;
    if (state === 'paused') scale = 1.5;
  }

  const styles = {
    base: css({
      Absolute: 0,
      display: 'flex',
      overflow: 'hidden',
      borderRadius: width,
      color: BUTTON_COLORS.WHITE,
    }),
    waveform: css({ Absolute: 0, Flex: 'horizontal-center-center' }),
    icon: css({ Absolute: 0, Flex: 'horizontal-center-center', paddingTop: 3 }),
    labels: {
      base: css({
        Absolute: 0,
        Flex: 'horizontal-spaceBetween-center',
        boxSizing: 'border-box',
        fontSize: 8,
        fontWeight: 900,
        color: BUTTON_COLORS.RED,
        PaddingX: 8,
        opacity: 0.7,
        pointerEvents: 'none',
      }),
    },
  };
  return (
    <m.div
      {...css(styles.base, props.style)}
      style={{ opacity }}
      animate={{ opacity }}
      transition={transition}
    >
      <div {...styles.waveform}>
        {isEnabled && stream && (
          <AudioWaveform
            width={width}
            height={40}
            stream={stream}
            lineColor={Color.alpha(BUTTON_COLORS.RED, 0.3)}
            lineWidth={2}
          />
        )}
      </div>
      <div {...styles.icon}>
        <m.div
          style={{ scale }}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 150 }}
        >
          <Icons.Player.Pause color={BUTTON_COLORS.RED} size={28} />
        </m.div>
      </div>
      <div {...styles.labels.base}>
        <div>REC</div>
        <div>0.0.00</div>
      </div>
    </m.div>
  );
};
