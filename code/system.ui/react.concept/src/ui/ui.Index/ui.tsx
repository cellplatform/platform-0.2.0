import { Wrangle } from './Wrangle';
import { DEFAULTS, Item, css, type t, Is } from './common';
import { Title } from './ui.Title';
import { Slug } from './ui.Slug';

export const View: React.FC<t.IndexProps> = (props) => {
  const { items = [], scroll = DEFAULTS.scroll } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    body: css({
      Absolute: 0,
      Scroll: true,
    }),
  };

  const elList = items.map((item, index) => {
    if (Is.namespace(item)) {
      return <Title key={index} item={item} />;
    }

    if (Is.slug(item)) {
      return (
        <Slug
          key={index}
          index={index}
          item={item}
          selected={props.selected}
          focused={props.focused}
          editing={props.editing}
          onEditStart={props.onSlugEditStart}
          onEditComplete={props.onSlugEditComplete}
          onSelect={props.onSelect}
        />
      );
    }

    return null;
  });

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>{elList}</div>
    </div>
  );
};
