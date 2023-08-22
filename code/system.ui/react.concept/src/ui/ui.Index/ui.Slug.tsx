import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Item, Is } from './common';

export type SlugProps = {
  index: t.Index;
  item: t.Slug;
  selected?: t.Index;
  focused?: boolean;
  editing?: boolean;
  style?: t.CssValue;
  onSelect?: t.IndexSelectHandler;
  onEditStart?: t.IndexSlugEditStartHandler;
  onEditComplete?: t.IndexSlugEditCompleteHandler;
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
      props.onEditComplete?.({ index, title: editedText });
    }
  };

  const onEnter = (editing: boolean) => {
    if (editing) onEditComplete();

    /**
     * TODO 🐷 Toggle editing on as well
     * [Edit]
     * NB: requires update in [sys.ui.common.TextInput] on fire [onEnter] from a non-editing state.
     */
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    item: css({ marginBottom: 1 }),
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
        onEditChange={(e) => setEditedText(e.label)}
        onEnter={(e) => onEnter(e.editing)}
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
