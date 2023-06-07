import { m } from 'framer-motion';
import { COLORS, TRANSITION, css, type t } from './common';

export type PausedProps = {
  isEnabled: boolean;
  width: number;
  height: number;
  state: t.RecordButtonState;
  style?: t.CssValue;
  onClick?: (e: { action: t.RecordButtonAction }) => void;
};

export const Paused: React.FC<PausedProps> = (props) => {
  const { isEnabled, state, width, height } = props;
  const opacity = isEnabled && state === 'paused' ? 1 : 0;

  const styles = {
    base: css({
      Absolute: 0,
      overflow: 'hidden',
      color: COLORS.WHITE,
      borderRadius: height,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }),
    button: {
      base: css({
        flex: 1,
        position: 'relative',
        boxSizing: 'border-box',
        PaddingX: 12,
        paddingBottom: 2,
        cursor: isEnabled ? 'pointer' : 'default',
        overflow: 'hidden',
      }),
      left: css({ backgroundColor: COLORS.RED, marginLeft: -10 }),
      right: css({ backgroundColor: COLORS.DARK, marginRight: -10 }),
      body: {
        base: css({
          position: 'relative',
          paddingBottom: 2,
          display: 'grid',
          justifyContent: 'center',
          alignContent: 'center',
        }),
        left: css({ Absolute: [0, 0, 0, 10] }),
        right: css({ Absolute: [0, 10, 0, 0] }),
      },
    },
  };

  const clickHandler = (action: t.RecordButtonAction) => {
    return () => props.onClick?.({ action });
  };

  const edgeButtonBody = (label: string, style: t.CssValue) => {
    return (
      <m.div {...css(styles.button.body.base, style)} whileTap={{ y: 1 }}>
        {label}
      </m.div>
    );
  };

  const edgeButtonOuter = (
    action: t.RecordButtonAction,
    style: t.CssValue,
    x: number,
    children: React.ReactNode,
  ) => {
    return (
      <m.div
        {...css(styles.button.base, style)}
        onClick={clickHandler(action)}
        style={{ x }}
        animate={{ x }}
        transition={{ type: 'tween' }}
      >
        {children}
      </m.div>
    );
  };

  const offset = state === 'paused' ? 0 : width / 2;

  const elLeftBody = edgeButtonBody('Resume', styles.button.body.left);
  const elLeft = edgeButtonOuter('resume', styles.button.left, 0 - offset, elLeftBody);

  const elRightBody = edgeButtonBody('Done', styles.button.body.right);
  const elRight = edgeButtonOuter('finish', styles.button.right, offset, elRightBody);

  return (
    <m.div
      {...css(styles.base, props.style)}
      style={{ opacity }}
      animate={{ opacity }}
      transition={TRANSITION}
    >
      {elLeft}
      {elRight}
    </m.div>
  );
};
