import { type t } from '../common';

export * from '../common';
export { useDragTarget } from '../useDragTarget';
export { useFocus } from '../useFocus';
export { Keyboard } from '../Text.Keyboard';

/**
 * Defaults.
 */
const drop: Required<t.ImageDropSettings> = {
  enabled: true,
  overBlur: 20,
  overContent: 'Drop Image',
};

const paste: Required<t.ImagePasteSettings> = {
  enabled: true,
  tabIndex: 0,
  focusedBlur: 20,
  focusedContent: 'Paste Image',
};

export const DEFAULTS = {
  supportedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  drop,
  paste,
};
