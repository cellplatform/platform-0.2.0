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
  primary: false,
  tabIndex: 0,
  focusedBlur: 20,
  focusedContent: 'Paste Image',
};

const supportedMimetypes: t.ImageSupportedMimetypes[] = ['image/png', 'image/jpeg', 'image/webp'];

export const DEFAULTS = {
  supportedMimetypes,
  drop,
  paste,
};
