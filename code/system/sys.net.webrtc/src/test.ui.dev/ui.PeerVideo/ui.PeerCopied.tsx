import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, Icons } from '../common';

type Milliseconds = number;

export type PeerCopiedProps = {
  style?: t.CssValue;
};

export const PeerCopied: React.FC<PeerCopiedProps> = (props) => {
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: Color.alpha(COLORS.WHITE, 0.6),
      backdropFilter: 'blur(5px)',
      display: 'grid',
      placeItems: 'center',
    }),
    message: {
      base: css({
        backgroundColor: Color.alpha(COLORS.WHITE, 0.4),
        border: `solid 1px ${Color.format(1)}`,
        borderRadius: 10,
        Padding: [15, 30],
        Flex: 'x-center-center',
      }),
      text: css({
        display: 'grid',
        placeItems: 'center',
        boxSizing: 'border-box',
      }),
      icon: css({
        marginLeft: 20,
      }),
    },
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.message.base}>
        <div {...styles.message.text}>{`Peer Copied`}</div>
        <div {...styles.message.icon}>
          <Icons.Done.Outline color={COLORS.GREEN} />
        </div>
      </div>
    </div>
  );
};
