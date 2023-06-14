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
  drop?: t.ImageDropSettings;
  style?: t.CssValue;
  onDrop?: t.ImageDropHandler;
};

export type ImageDropSettings = {
  enabled?: boolean;
  overBlur?: Pixels;
  overContent?: string | JSX.Element;
};

/**
 * Events
 */
export type ImageDropHandler = (e: ImageDropHandlerArgs) => void;
export type ImageDropHandlerArgs = {
  file: t.DroppedFile;
  supportedMimeTypes: string[];
  isSupported: boolean;
};
