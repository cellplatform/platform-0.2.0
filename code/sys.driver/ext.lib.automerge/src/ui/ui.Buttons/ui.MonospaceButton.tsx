import { useState } from 'react';
import { Button, COLORS, Color, FONTS, Time, css, type t } from './common';

/**
 * A button with monospace font.
 */
export const MonospaceButton: React.FC<t.MonospaceButtonProps> = (props) => {
  const { text = '', prefix, suffix, prefixMargin, suffixMargin } = props;

  const [message, setMessage] = useState<JSX.Element | undefined>();
  const [isOver, setOver] = useState(false);

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
    copied: css({ color: COLORS.GREEN }),
    edge: css({
      color: isOver ? COLORS.BLUE : color,
      opacity: isOver ? 1 : 0.4,
    }),
  };

  const elPrefix = prefix && (
    <span {...css(styles.edge, { marginRight: prefixMargin })}>{prefix}</span>
  );

  const elSuffix = suffix && (
    <span {...css(styles.edge, { marginLeft: suffixMargin })}>{suffix}</span>
  );

  return (
    <div {...css(styles.base, styles.mono, props.style)}>
      <Button
        theme={theme.name}
        onClick={handleClick}
        overlay={message}
        onMouse={(e) => setOver(e.isOver)}
      >
        <>
          {elPrefix}
          <span>{text}</span>
          {elSuffix}
        </>
      </Button>
    </div>
  );
};
