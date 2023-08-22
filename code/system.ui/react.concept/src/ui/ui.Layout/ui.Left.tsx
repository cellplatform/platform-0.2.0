import { Index } from '../ui.Index';
import { COLORS, Color, css, type t } from './common';

export type LeftProps = {
  slugs?: t.SlugListItem[];
  selected?: number;
  focused?: boolean;
  playing?: boolean;
  style?: t.CssValue;
  onSelect?: t.LayoutSelectHandler;
};

export const Left: React.FC<LeftProps> = (props) => {
  const { slugs = [] } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      borderRight: `solid 1px ${Color.alpha(COLORS.DARK, 0.06)}`,
      width: 255,
      display: 'grid',
    }),
    index: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Index
        style={styles.index}
        items={props.slugs}
        selected={props.selected}
        focused={props.focused}
        padding={8}
        onSelect={(e) => props.onSelect?.(e)}
      />
    </div>
  );
};
