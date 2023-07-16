import { DEFAULTS, Item as BaseItem, css, type t } from './common';

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
    <BaseItem.Label
      enabled={enabled}
      label={text}
      placeholder={placeholder}
      style={css(styles.base, props.style)}
    />
  );
};
