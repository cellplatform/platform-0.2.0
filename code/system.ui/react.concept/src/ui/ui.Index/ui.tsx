import { Wrangle } from './Wrangle';
import { DEFAULTS, Item, css, type t, Is } from './common';
import { Title } from './ui.Title';
import { Slug } from './ui.Slug';

export const View: React.FC<t.IndexProps> = (props) => {
  const { items = [] } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
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
          onEdited={props.onSlugEdited}
          onSelect={props.onSelect}
        />
      );
    }

    return null;
  });

  return <div {...css(styles.base, props.style)}>{elList}</div>;
};
