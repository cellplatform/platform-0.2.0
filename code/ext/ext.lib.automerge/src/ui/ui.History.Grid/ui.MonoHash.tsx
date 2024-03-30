import { useState } from 'react';
import { Button, COLORS, Color, DEFAULTS, Hash, Time, css, type t } from './common';

export type MonoHashProps = {
  hash?: string;
  length?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const MonoHash: React.FC<MonoHashProps> = (props) => {
  const { hash = '', theme, length = DEFAULTS.hash.length } = props;
  const short = Hash.shorten(hash, [0, length]);
  const [message, setMessage] = useState<JSX.Element | undefined>();

  /**
   * Handlers
   */
  const handleClick = () => {
    navigator.clipboard.writeText(hash);
    setMessage(<div {...styles.copied}>{'Copied'}</div>);
    Time.delay(2000, () => setMessage(undefined));
  };

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({ color, Flex: 'x-center-center' }),
    mono: css(DEFAULTS.mono),
    pound: css({ color, opacity: 0.4, marginRight: 3 }),
    copied: css({
      color: COLORS.GREEN,
    }),
  };

  return (
    <div {...css(styles.base, styles.mono, props.style)}>
      <Button theme={theme} onClick={handleClick} overlay={message}>
        <>
          <span {...styles.pound}>{`#`}</span>
          <span>{short}</span>
        </>
      </Button>
    </div>
  );
};
