import { isValidElement } from 'react';
import { COLORS, Color, DEFAULTS, css, type t } from './common';
import { CopyIcon } from './ui.CopyIcon';

export type SimpleValueProps = {
  defaults: t.PropListDefaults;
  value: t.PropListValue | JSX.Element;
  message?: string | JSX.Element;
  cursor?: t.CSSProperties['cursor'];
  isOver?: boolean;
  isCopyable?: boolean;
  theme?: t.CommonTheme;
  onClick?: () => void;
};

export const SimpleValue: React.FC<SimpleValueProps> = (props) => {
  const { message } = props;
  const value = wrangle.valueObject(props);

  const is = wrangle.flags(props);
  const textColor = wrangle.textColor(props);
  const cursor = props.cursor ?? is.copyActive ? 'pointer' : 'default';

  const styles = {
    base: css({
      position: 'relative',
      opacity: value.opacity ?? 1,
      transition: 'opacty 100ms ease-out',
      display: 'grid',
    }),
    content: css({
      cursor,
      color: textColor,
      fontFamily: is.monospace ? 'monospace' : undefined,
      fontWeight: is.monospace ? 'bolder' : undefined,
      fontSize: wrangle.fontSize(props),
    }),
    text: css({ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }),
    component: css({ Flex: 'center-end' }),
  };

  const content = message ? message : wrangle.renderValue(props);

  return (
    <div {...css(styles.base)}>
      <div
        {...css(styles.content, !isValidElement(content) ? styles.text : styles.component)}
        onMouseDown={props.onClick}
      >
        {content}
      </div>
      {is.copyActive && !message && <CopyIcon />}
    </div>
  );
};

/**
 * [Helpers]
 */

const wrangle = {
  flags(props: SimpleValueProps) {
    const value = wrangle.valueObject(props);
    const { isOver, isCopyable, defaults } = props;
    let monospace = value.monospace ?? defaults.monospace;
    if (typeof value.body === 'boolean') monospace = true;
    return {
      boolean: typeof value.body === 'boolean',
      copyActive: isOver && isCopyable,
      monospace,
    };
  },

  textColor(props: SimpleValueProps) {
    const value = wrangle.valueObject(props);
    if (value.color !== undefined) return Color.format(value.color);

    const theme = Color.theme(props.theme);
    if (typeof props.message === 'string') return theme.alpha.fg(0.3);

    const is = wrangle.flags(props);
    if (is.copyActive) return COLORS.BLUE;
    if (is.boolean) return COLORS.PURPLE;

    return theme.fg;
  },

  renderValue(props: SimpleValueProps) {
    const value = wrangle.valueObject(props);
    return isValidElement(value.body) ? value.body : value.body?.toString();
  },

  valueObject(props: SimpleValueProps) {
    if (isValidElement(props.value)) return { body: props.value };
    return props.value as t.PropListValue;
  },

  fontSize(props: SimpleValueProps) {
    const value = wrangle.valueObject(props);
    if (value.fontSize !== undefined) return value.fontSize;

    const is = wrangle.flags(props);
    return is.monospace ? DEFAULTS.fontSize.mono : DEFAULTS.fontSize.sans;
  },
} as const;
