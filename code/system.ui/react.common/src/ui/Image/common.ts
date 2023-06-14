import { type t } from '../common';

export * from '../common';
export { useDragTarget } from '../useDragTarget';

const dragOver: t.ImageDragOverProps = {
  blur: 5,
};

export const DEFAULTS = {
  supportedMimeTypes: ['image/png', 'image/jpeg'],
  dragOver,
};
