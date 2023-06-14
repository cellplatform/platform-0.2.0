import type { t } from './common';

export type ImageBinary = {
  data: Uint8Array;
  mimetype: string;
};

export type ImageDropHandler = (e: ImageDropHandlerArgs) => void;
export type ImageDropHandlerArgs = { file: t.DroppedFile };
