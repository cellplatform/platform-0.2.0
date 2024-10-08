import { useState } from 'react';
import { Button, COLORS, Color, FONTS, Time, css, type t } from './common';
import { Copied } from './ui.Copied';

type P = t.MonospaceButtonProps;
/**
 * Constants
 */
const edge: t.MonospaceButtonEdge = { text: '', opacity: 0.4, margin: 2 };
const DEFAULTS = { edge } as const;

/**
 * A button with monospace font.
 */
export const MonospaceButton: React.FC<P> = (props) => {
  const { text = '' } = props;
  const prefix = wrangle.edge(props.prefix);
  const suffix = wrangle.edge(props.suffix);

  const [message, setMessage] = useState<JSX.Element | undefined>();
  const [isOver, setOver] = useState(false);
  const is = { over: isOver || props.isOver } as const;

  /**
   * Handlers
   */
  const handleClipboard = () => {
    if (!props.onClipboard) return;

    let text = '';
    props.onClipboard({ write: (value) => (text = value) });
    if (!text) return;

    navigator.clipboard.writeText(text);
    setMessage(<Copied theme={props.theme} fontSize={fontSize} />);
    Time.delay(2000, () => setMessage(undefined));
  };

  const handleClick: React.MouseEventHandler = (e) => {
    handleClipboard();
    props.onClick?.(e);
  };

  /**
   * Render
   */
  const fontSize = props.fontSize ?? FONTS.mono.fontSize;
  const theme = Color.theme(props.theme);
  const color = theme.fg;
  const styles = {
    base: css({ color, Flex: 'x-center-center' }),
    mono: css({ ...FONTS.mono, fontSize }),
    copied: css({ color: COLORS.GREEN }),
    prefix: css({
      color: is.over ? COLORS.BLUE : color,
      opacity: is.over ? 1 : prefix.opacity,
    }),
    suffix: css({
      color: is.over ? COLORS.BLUE : color,
      opacity: is.over ? 1 : suffix.opacity,
    }),
  };

  const elPrefix = prefix && (
    <span {...css(styles.prefix, { marginRight: prefix.margin })}>{prefix.text}</span>
  );

  const elSuffix = suffix && (
    <span {...css(styles.suffix, { marginLeft: suffix.margin })}>{suffix.text}</span>
  );

  return (
    <div {...css(styles.base, styles.mono, props.style)}>
      <Button
        theme={theme.name}
        onClick={handleClick}
        overlay={message}
        isOver={props.isOver} // NB: force is-over.
        isDown={props.isDown} // NB: force is-down.
        onMouse={(e) => {
          setOver(e.isOver);
          props.onMouse?.(e);
        }}
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

/**
 * Helpers
 */
const wrangle = {
  edge(input?: string | t.MonospaceButtonEdge): t.MonospaceButtonEdge {
    if (!input) return DEFAULTS.edge;
    if (typeof input === 'string') return { ...DEFAULTS.edge, text: input };
    return input;
  },
} as const;
