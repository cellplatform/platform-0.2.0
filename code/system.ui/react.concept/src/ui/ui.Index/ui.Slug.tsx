import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Item, Is } from './common';

export type SlugProps = {
  index: t.Index;
  item: t.Slug;
  selected?: t.Index;
  focused?: boolean;
  editing?: boolean;
  style?: t.CssValue;
  onEdited?: t.IndexSlugEditHandler;
  onSelect?: t.LayoutSelectHandler;
};

export const Slug: React.FC<SlugProps> = (props) => {
  const { item, index } = props;
  const text = item.title || DEFAULTS.untitled;
  const isSelected = index === props.selected;
  const isFocused = isSelected && props.focused;
  const isEditing = isSelected && props.editing;

  const [editedText, setEditedText] = useState('');

  /**
   * [Handlers]
   */
  const onEditComplete = () => {
    if (editedText !== item.title) {
      props.onEdited?.({ index, title: editedText });
    }
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    item: css({ marginBottom: 3 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Item.Label.View
        style={styles.item}
        borderRadius={3}
        label={text}
        selected={isSelected}
        editing={isEditing}
        focused={isFocused}
        focusOnEdit={true}
        onClick={(e) => props.onSelect?.({ index })}
        onChange={(e) => setEditedText(e.label)}
        onEnter={onEditComplete}
        onEditClickAway={onEditComplete}

        /**
         * TODO 🐷
         * - single event for (complete) >> onEnter + onEditClickAway
         * - onEscape >> onCancelEdit
         */
      />
    </div>
  );
};
