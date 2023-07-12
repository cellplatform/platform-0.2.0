import { DEFAULTS, css, type t } from './common';

import { Wrangle } from './Wrangle';
import { ItemIcon } from './ui.Item.Icon';

export const RightOptions: React.FC<t.CrdtNamespaceItemProps> = (props) => {
  const { selected = DEFAULTS.selected } = props;
  const opacity = selected ? 0.5 : 1;

  /**
   * [Render]
   */
  const color = Wrangle.foreColor(props);
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      columnGap: 5,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <ItemIcon kind={'Json'} color={color} opacity={opacity} />
      <ItemIcon kind={'ObjectTree'} color={color} opacity={opacity} />
    </div>
  );
};
