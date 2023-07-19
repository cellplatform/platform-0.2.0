import { isValidElement } from 'react';
import { Color, COLORS, css, type t } from './common';

import { Wrangle } from '../util.mjs';
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
  const value = toValueObject(props);

  const is = toFlags(props);
  const textColor = toTextColor(props);
  const cursor = props.cursor ?? is.copyActive ? 'pointer' : 'default';

  const styles = {
    base: css({
      position: 'relative',
      opacity: value.opacity ?? 1,
      transition: 'opacty 100ms ease-out',
      flex: 1,
    }),
    content: css({
      cursor,
      color: textColor,
      fontFamily: is.monospace ? 'monospace' : undefined,
      fontWeight: is.monospace ? 'bolder' : undefined,
      fontSize: value.fontSize !== undefined ? value.fontSize : undefined,
    }),
    text: css({
      Absolute: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'right',
    }),
    component: css({ Flex: 'center-end' }),
  };

  const content = message ? message : toRenderValue(props);

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

function toValueObject(props: SimpleValueProps) {
  if (isValidElement(props.value)) return { data: props.value };
  return props.value as t.PropListValue;
}

function toRenderValue(props: SimpleValueProps) {
  const value = toValueObject(props);
  return isValidElement(value.data) ? value.data : value.data?.toString();
}

function toTextColor(props: SimpleValueProps) {
  const value = toValueObject(props);
  if (value.color !== undefined) return Color.format(value.color);

  const theme = Wrangle.theme(props.theme);
  if (props.message) return theme.color.alpha(0.3);

  const is = toFlags(props);
  if (is.copyActive) return COLORS.BLUE;
  if (is.boolean) return COLORS.PURPLE;

  return theme.color.base;
}

function toFlags(props: SimpleValueProps) {
  const value = toValueObject(props);
  const { isOver, isCopyable, defaults } = props;
  let monospace = value.monospace ?? defaults.monospace;
  if (typeof value.data === 'boolean') monospace = true;
  return {
    boolean: typeof value.data === 'boolean',
    copyActive: isOver && isCopyable,
    monospace,
  };
}
