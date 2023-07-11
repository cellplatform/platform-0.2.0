import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, rx, FC, type t, TextInput } from './common';

export type NamespaceItemProps = t.CrdtNamespaceProps & {
  name?: string;
};

export const NamespaceItem: React.FC<NamespaceItemProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <TextInput
        valueStyle={{ fontSize: 13, color: COLORS.DARK }}
        placeholder={'namespace'}
        placeholderStyle={{ opacity: 0.2, italic: true }}
        spellCheck={false}
      />
    </div>
  );
};
