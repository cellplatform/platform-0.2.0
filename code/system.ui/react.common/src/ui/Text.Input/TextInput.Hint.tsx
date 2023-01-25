import { css, t } from '../common';
import { Util } from './Util';

export type TextInputHintProps = {
  valueStyle: t.TextInputStyle;
  value: string;
  hint: string | JSX.Element;
  style?: t.CssValue;
};

/**
 * Used for displaying an auto-complete "hint".
 */
export const TextInputHint: React.FC<TextInputHintProps> = (props) => {
  const { value, hint, valueStyle } = props;
  const isString = typeof hint === 'string';
  const fontProps = Util.css.pluckFont(valueStyle);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      pointerEvents: 'none',
      boxSizing: 'border-box',
      Flex: 'x-center-start',
    }),
    value: css({
      ...fontProps,
      paddingLeft: 2,
      opacity: 0, // NB: Hidden (placeholder that pushes out the "hint" to the right)
    }),
    hint: css({
      ...fontProps,
      marginLeft: 1,
      opacity: isString ? 0.3 : 1,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.value}>{value}</div>
      <div {...styles.hint}>{hint}</div>
    </div>
  );
};
