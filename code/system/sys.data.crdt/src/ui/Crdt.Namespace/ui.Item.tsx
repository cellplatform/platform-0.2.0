import { DEFAULTS, LabelItem, css, type t } from './common';

export type ItemProps = {
  data?: t.CrdtNs<{}, {}>;
  enabled?: boolean;
  style?: t.CssValue;
};

export const Item: React.FC<ItemProps> = (props) => {
  const { data, enabled = DEFAULTS.enabled } = props;
  const placeholder = data ? DEFAULTS.placeholder.default : DEFAULTS.placeholder.empty;
  const text = data?.namespace;

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
  };

  return (
    <LabelItem
      label={text}
      placeholder={placeholder}
      enabled={enabled}
      style={css(styles.base, props.style)}
    />
  );
};
