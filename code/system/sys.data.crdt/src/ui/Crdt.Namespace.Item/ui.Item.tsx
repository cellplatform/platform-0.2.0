import { COLORS, DEFAULTS, Style, css, type t } from './common';

import { Wrangle } from './Wrangle';
import { ItemLabel } from './ui.Item.Label';
import { RightOptions } from './ui.RightOptions';

export const Item: React.FC<t.CrdtNamespaceItemProps> = (props) => {
  const {
    enabled = DEFAULTS.enabled,
    selected = DEFAULTS.selected,
    indent = DEFAULTS.indent,
    padding = DEFAULTS.padding,
  } = props;

  /**
   * [Render]
   */

  const styles = {
    base: css({
      pointerEvents: enabled ? 'auto' : 'none',
      backgroundColor: selected ? COLORS.BLUE : undefined,
      boxSizing: 'border-box',
      ...Style.toPadding(props.padding ?? padding),
    }),
    body: css({
      boxSizing: 'border-box',
      marginLeft: indent,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: 3,
    }),
    right: css({ marginLeft: 5 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        {Wrangle.leftIcon(props)}
        <ItemLabel {...props} />
        <RightOptions {...props} style={styles.right} />
      </div>
    </div>
  );
};
