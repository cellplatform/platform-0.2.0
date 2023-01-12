import { m } from 'framer-motion';

import { COLORS, css, t, transition } from './common';
import { RecordButtonAction, RecordButtonState } from './types';

export type PausedProps = {
  isEnabled: boolean;
  width: number;
  height: number;
  state: RecordButtonState;
  style?: t.CssValue;
  onClick?: (e: { action: RecordButtonAction }) => void;
};

export const Paused: React.FC<PausedProps> = (props) => {
  const { isEnabled, state, width, height } = props;
  const opacity = isEnabled && state === 'paused' ? 1 : 0;

  const styles = {
    base: css({
      Absolute: 0,
      Flex: 'horizontal-stretch-stretch',
      display: 'flex',
      overflow: 'hidden',
      color: COLORS.WHITE,
      borderRadius: height,
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
        Flex: 'horizontal-stretch-stretch',
      }),
      left: css({ backgroundColor: COLORS.RED, marginLeft: -10 }),
      right: css({ backgroundColor: COLORS.BLACK, marginRight: -10 }),
      body: {
        base: css({ flex: 1, Flex: 'center-center', paddingBottom: 2 }),
        left: css({ Absolute: [0, 0, 0, 10] }),
        right: css({ Absolute: [0, 10, 0, 0], textAlign: 'right' }),
      },
    },
  };

  const clickHandler = (action: RecordButtonAction) => {
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
    action: RecordButtonAction,
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
      transition={transition}
    >
      {elLeft}
      {elRight}
    </m.div>
  );
};
