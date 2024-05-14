import { useState } from 'react';
import { Button, COLORS, Color, FONTS, Time, css, type t } from './common';

/**
 * A button with monospace font.
 */
export const MonospaceButton: React.FC<t.MonospaceButtonProps> = (props) => {
  const { text = '', prefix } = props;
  const [message, setMessage] = useState<JSX.Element | undefined>();

  /**
   * Handlers
   */
  const handleClipboard = () => {
    let text = '';
    props.onClipboard?.({ write: (value) => (text = value) });
    if (!text) return;

    navigator.clipboard.writeText(text);
    setMessage(<div {...styles.copied}>{'copied'}</div>);
    Time.delay(2000, () => setMessage(undefined));
  };

  const handleClick: React.MouseEventHandler = (e) => {
    handleClipboard();
    props.onClick?.(e);
  };

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const color = theme.fg;
  const styles = {
    base: css({ color, Flex: 'x-center-center' }),
    mono: css(FONTS.mono),
    prefix: css({ color, opacity: 0.4, marginRight: props.prefixMargin }),
    copied: css({ color: COLORS.GREEN }),
  };

  return (
    <div {...css(styles.base, styles.mono, props.style)}>
      <Button theme={theme.name} onClick={handleClick} overlay={message}>
        <>
          {prefix && <span {...styles.prefix}>{prefix}</span>}
          <span>{text}</span>
        </>
      </Button>
    </div>
  );
};
