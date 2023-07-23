import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Item } from './common';

export type IndexProps = {
  slugs?: t.VideoConceptSlug[];
  selected?: number;
  style?: t.CssValue;
  onSelect?: t.VideoConceptClickHandler;
};

export const Index: React.FC<IndexProps> = (props) => {
  const { slugs = [] } = props;
  const length = slugs.length;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      width: 175,
      padding: 5,
      display: 'grid',
      alignContent: 'center',
      paddingBottom: 100,
    }),
    item: css({ marginBottom: 5 }),
  };

  const elList = Array.from({ length }).map((_, index) => {
    const slug = slugs[index];
    const isSelected = index === props.selected;
    return (
      <Item.Label.View
        style={styles.item}
        key={index}
        label={slug.title}
        selected={isSelected}
        borderRadius={3}
        onClick={(e) => props.onSelect?.({ index: index })}
      />
    );
  });

  return <div {...css(styles.base, props.style)}>{elList}</div>;
};
