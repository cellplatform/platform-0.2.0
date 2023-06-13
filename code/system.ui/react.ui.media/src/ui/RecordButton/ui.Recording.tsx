import { m } from 'framer-motion';
import { AudioWaveform } from '../Audio.Waveform';
import { Icons } from '../Icons';
import { COLORS, Color, TRANSITION, css, type t } from './common';

export type RecordingProps = {
  isEnabled: boolean;
  stream?: MediaStream;
  width: number;
  state: t.RecordButtonState;
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
      color: COLORS.WHITE,
    }),
    waveform: css({
      Absolute: [0, 0, 0, 0],
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
    }),
    icon: css({
      Absolute: 0,
      paddingTop: 3,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
    }),
    labels: {
      base: css({
        Absolute: 0,
        fontSize: 8,
        fontWeight: 900,
        color: COLORS.RED,
        PaddingX: 8,
        opacity: 0.7,
        pointerEvents: 'none',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignContent: 'center',
      }),
    },
  };
  return (
    <m.div
      {...css(styles.base, props.style)}
      style={{ opacity }}
      animate={{ opacity }}
      transition={TRANSITION}
    >
      <div {...styles.waveform}>
        {isEnabled && stream && (
          <AudioWaveform
            width={width}
            height={40}
            stream={stream}
            lineColor={Color.alpha(COLORS.RED, 0.3)}
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
          <Icons.Player.Pause color={COLORS.RED} size={28} />
        </m.div>
      </div>
      <div {...styles.labels.base}>
        <div>{'REC'}</div>
        <div />
        <div>{'0.0.00'}</div>
      </div>
    </m.div>
  );
};
