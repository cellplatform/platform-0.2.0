import { useState } from 'react';

import { Color, COLORS, css, t } from '../common';
import { Icons } from '../Icons.mjs';

export type StatusPanelProps = {
  dimmed?: boolean;
  isLast?: boolean;
  status?: t.VimeoStatus;
  style?: t.CssValue;
  onRightClick?: () => void;
};

export const StatusPanel: React.FC<StatusPanelProps> = (props) => {
  const { dimmed = false, status, isLast } = props;
  const isComplete = status?.percent === 1 ?? false;

  const [isDown, setDown] = useState(false);
  const down = (isDown: boolean) => () => setDown(isDown);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      opacity: dimmed ? 0 : 1,
      transition: `opacity 300ms`,
      Flex: 'x-spaceBetween-stretch',
    }),

    block: css({
      position: 'relative',
      margin: 1,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
      PaddingX: 10,

      backgroundColor: Color.format(0.3),
      backdropFilter: `blur(30px)`,
      borderRadius: 10,
    }),

    rightButton: css({
      cursor: 'pointer',
      transform: `translateY(${isDown ? 2 : 0}px)`,
    }),
  };

  const Icon = isLast ? Icons.Complete : Icons.Arrow.Right;

  const elNext = isComplete && (
    <Icon
      style={styles.rightButton}
      size={140}
      color={COLORS.RED}
      onClick={props.onRightClick}
      onMouseDown={down(true)}
      onMouseUp={down(false)}
    />
  );

  if (!elNext) return null;

  return (
    <div {...css(styles.base, props.style)}>
      <div />
      <div {...styles.block}>{elNext}</div>
    </div>
  );
};
