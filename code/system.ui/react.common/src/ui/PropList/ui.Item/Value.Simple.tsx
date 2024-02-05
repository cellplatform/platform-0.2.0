import { isValidElement } from 'react';
import { Color, COLORS, css, type t, DEFAULTS } from './common';

import { Wrangle } from '../util';
import { CopyIcon } from './CopyIcon';

export type SimpleValueProps = {
  defaults: t.PropListDefaults;
  value: t.PropListValue | JSX.Element;
  message?: string | JSX.Element;
  cursor?: t.CSSProperties['cursor'];
  isOver?: boolean;
  isCopyable?: boolean;
  theme?: t.PropListTheme;
  onClick: () => void;
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
    text: css({
      // Absolute: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    component: css({ Flex: 'center-end' }),
  };

  const content = message ? message : wrangle.renderValue(props);

  return (
    <div {...css(styles.base)}>
      <div
        {...css(styles.content, !isValidElement(content) ? styles.text : styles.component)}
        onClick={props.onClick}
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
    if (typeof value.data === 'boolean') monospace = true;
    return {
      boolean: typeof value.data === 'boolean',
      copyActive: isOver && isCopyable,
      monospace,
    };
  },

  textColor(props: SimpleValueProps) {
    const value = wrangle.valueObject(props);
    if (value.color !== undefined) return Color.format(value.color);

    const theme = Wrangle.theme(props.theme);
    if (props.message) return theme.color.alpha(0.3);

    const is = wrangle.flags(props);
    if (is.copyActive) return COLORS.BLUE;
    if (is.boolean) return COLORS.PURPLE;

    return theme.color.base;
  },

  renderValue(props: SimpleValueProps) {
    const value = wrangle.valueObject(props);
    return isValidElement(value.data) ? value.data : value.data?.toString();
  },

  valueObject(props: SimpleValueProps) {
    if (isValidElement(props.value)) return { data: props.value };
    return props.value as t.PropListValue;
  },

  fontSize(props: SimpleValueProps) {
    const value = wrangle.valueObject(props);
    if (value.fontSize !== undefined) return value.fontSize;

    const is = wrangle.flags(props);
    return is.monospace ? DEFAULTS.fontSize.mono : DEFAULTS.fontSize.sans;
  },
} as const;
