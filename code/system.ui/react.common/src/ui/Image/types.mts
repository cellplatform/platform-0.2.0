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
  paste?: t.ImagePasteSettings;
  tabIndex?: number;
  style?: t.CssValue;
  onAdd?: t.ImageAddHandler;
};

export type ImageDropSettings = {
  enabled?: boolean;
  overBlur?: Pixels;
  overContent?: string | JSX.Element;
};

export type ImagePasteSettings = {
  enabled?: boolean;
  tabIndex?: number;
  focusedBlur?: Pixels;
  focusedContent?: string | JSX.Element;
};

/**
 * Events
 */
export type ImageAddHandler = (e: ImageAddHandlerArgs) => void;
export type ImageAddHandlerArgs = {
  file?: t.DroppedFile;
  supportedMimeTypes: string[];
  isSupported: boolean | null;
};
