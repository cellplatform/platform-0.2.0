import type { t } from './common';

type Pixels = number;

export type ImageBinary = {
  data: Uint8Array;
  mimetype: string;
};

/**
 * Component Properties
 */
export type ImageProps = {
  src?: string | t.ImageBinary;
  dragOver?: t.ImageDragOverProps;
  style?: t.CssValue;
  onDrop?: t.ImageDropHandler;
};

export type ImageDragOverProps = {
  blur?: Pixels;
};

/**
 * Events
 */
export type ImageDropHandler = (e: ImageDropHandlerArgs) => void;
export type ImageDropHandlerArgs = { file: t.DroppedFile };
