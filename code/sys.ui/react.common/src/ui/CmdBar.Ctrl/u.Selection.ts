import { Pkg, type t } from './common';

export const Selection = {
  /**
   * Retrieve a new selection by moving back through spaces.
   */
  expandBack(textbox: t.TextInputRef) {
    const { value, selection } = textbox.current;
    const index = wrangle.firstSpaceBeforeIndex(value, selection.start - 1);
    const start = index < 0 ? 0 : index + 1;
    const end = value.length;
    textbox.select(start, end);
  },

  /**
   * Toggle bewtween no selection (caret to end) and fully selected text.
   */
  toggleFull(textbox: t.TextInputRef) {
    const { value, selection } = textbox.current;
    if (wrangle.isFullySelected(value, selection)) {
      const end = value.length;
      textbox.select(end, end);
    } else {
      textbox.selectAll();
    }
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  firstSpaceBeforeIndex(text: string, index: number): number {
    text = text.slice(0, index);
    for (let i = index - 1; i >= 0; i--) {
      if (text[i] === ' ') return i;
    }
    return -1;
  },

  isFullySelected(text: string, selection: t.TextInputSelection) {
    return selection.start === 0 && selection.end === text.length;
  },
} as const;
