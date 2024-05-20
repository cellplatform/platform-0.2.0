import { COLORS, PropList, css, type t } from './common';
import { Wrangle } from './u';

export const List: React.FC<t.ModuleNamespaceListProps> = (props) => {
  const is = Wrangle.is(props);

  /**
   * Render
   */
  const color = is.dark ? COLORS.WHITE : COLORS.DARK;
  const styles = {
    base: css({
      display: 'grid',
      color,
    }),
  };

  /**
   * TODO 🐷
   */
  const items: t.PropListItem[] = [
    { label: 'foo', value: 'foo.bar' },
    { label: 'foo', value: 'foo.bar.baz' },
    { label: 'foo', value: 'foo.bar.zoo' },
  ];

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 `}</div>
      <PropList items={items} theme={props.theme} />
    </div>
  );
};
