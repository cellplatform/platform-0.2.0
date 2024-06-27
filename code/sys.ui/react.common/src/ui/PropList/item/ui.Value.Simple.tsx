import { isValidElement } from 'react';
import { COLORS, Color, DEFAULTS, css, type t } from './common';

export type SimpleValueProps = {
  defaults: t.PropListDefaults;
  value: t.PropListValue | JSX.Element;
  message?: string | JSX.Element;
  cursor?: t.CSSProperties['cursor'];
  isOver?: boolean;
  theme?: t.CommonTheme;
  onClick?: React.MouseEventHandler;
};

export const SimpleValue: React.FC<SimpleValueProps> = (props) => {
  const { message } = props;
  const value = wrangle.valueObject(props);

  const is = wrangle.flags(props);
  const textColor = wrangle.textColor(props);
  const cursor = props.cursor ? 'pointer' : 'default';

  /**
   * Render
   */
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
  const style = css(styles.content, !isValidElement(content) ? styles.text : styles.component);
  const elContent = (
    <div {...style} onMouseDown={props.onClick}>
      {content}
    </div>
  );

  const elMessage = message && <div>{message}</div>;
  return <div {...css(styles.base)}>{elMessage || elContent}</div>;
};

/**
 * [Helpers]
 */

const wrangle = {
  flags(props: SimpleValueProps) {
    const value = wrangle.valueObject(props);
    const { isOver, defaults } = props;
    let monospace = value.monospace ?? defaults.monospace;
    if (typeof value.body === 'boolean') monospace = true;
    return {
      over: isOver,
      boolean: typeof value.body === 'boolean',
      monospace,
      clickable: !!props.onClick,
    };
  },

  textColor(props: SimpleValueProps) {
    const value = wrangle.valueObject(props);
    if (value.color !== undefined) return Color.format(value.color);

    const theme = Color.theme(props.theme);
    if (typeof props.message === 'string') return theme.alpha(0.3).fg;

    const is = wrangle.flags(props);
    if (is.over && is.clickable) return COLORS.BLUE;
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
