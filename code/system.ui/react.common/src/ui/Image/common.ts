import { type t } from '../common';

export * from '../common';
export { useDragTarget } from '../useDragTarget';

const drop: t.ImageDropSettings = {
  enabled: true,
  overBlur: 20,
  overContent: 'Drop Image',
};

export const DEFAULTS = {
  supportedMimeTypes: ['image/png', 'image/jpeg'],
  drop,
};
