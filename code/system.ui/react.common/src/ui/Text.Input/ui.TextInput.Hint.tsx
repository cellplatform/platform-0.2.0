import { css, type t } from '../common';
import { Util } from './util.mjs';

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
      display: 'grid',
      gridTemplateColumns: `auto 1fr`,
      alignContent: 'center',
    }),
    value: css({
      ...fontProps,
      boxSizing: 'border-box',
      paddingLeft: 2,
      opacity: 1, // NB: Hidden (placeholder that pushes out the "hint" to the right)
    }),
    hint: css({
      ...fontProps,
      boxSizing: 'border-box',
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
