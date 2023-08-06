import { Style, DEFAULTS, Is, css, type t } from './common';

import { Slug } from './ui.Slug';
import { Title } from './ui.Title';

export const View: React.FC<t.IndexProps> = (props) => {
  const { items = [] } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      ...Style.toMargins(props.margin),
    }),
    inner: css({ position: 'relative' }),
    body: css({
      Absolute: 0,
      Scroll: props.scroll ?? DEFAULTS.scroll,
      ...Style.toPadding(props.padding),
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
      <div {...styles.inner}>
        <div {...styles.body}>{elList}</div>
      </div>
    </div>
  );
};
