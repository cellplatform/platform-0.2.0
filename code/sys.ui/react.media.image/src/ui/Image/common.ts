import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Defaults.
 */
const drop: Required<t.ImageDropSettings> = {
  content: 'Drop Image',
  enabled: true,
  blur: 25,
};

const paste: Required<t.ImagePasteSettings> = {
  enabled: true,
  primary: false,
  tabIndex: 0,
};

const warning: Required<t.ImageWarningSettings> = {
  blur: 20,
  delay: 2500,
};

const supportedMimetypes: t.ImageSupportedMimetypes[] = ['image/png', 'image/jpeg', 'image/webp'];
const sizing: t.ImageSizeStrategy = 'cover';

export const DEFAULTS = {
  displayName: `${Pkg.name}:Image`,
  supportedMimetypes,
  sizing,
  drop,
  paste,
  warning,
};
