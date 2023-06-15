import { type t } from '../common';
export * from '../common';

export { Keyboard } from '../Text.Keyboard';
export { useDragTarget } from '../useDragTarget';
export { useFocus } from '../useFocus';

/**
 * Defaults.
 */
const drop: Required<t.ImageDropSettings> = {
  enabled: true,
  blur: 20,
  content: 'Drop Image',
};

const paste: Required<t.ImagePasteSettings> = {
  enabled: true,
  primary: false,
  tabIndex: 0,
  blur: 20,
  content: 'Paste Image',
};

const warning: Required<t.ImageWarningSettings> = {
  blur: 20,
  delay: 2500,
};

const supportedMimetypes: t.ImageSupportedMimetypes[] = ['image/png', 'image/jpeg', 'image/webp'];
const sizing: t.ImageSizeStrategy = 'contain';

export const DEFAULTS = {
  supportedMimetypes,
  sizing,
  drop,
  paste,
  warning,
};
