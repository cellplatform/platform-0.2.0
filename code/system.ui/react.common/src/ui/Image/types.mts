import type { t } from './common';

type Pixels = number;

export type ImageBinary = {
  data: Uint8Array;
  mimetype: string;
};

export type ImageSupportedMimetypes = 'image/png' | 'image/jpeg' | 'image/webp';

/**
 * Component Properties
 */
export type ImageProps = {
  src?: string | t.ImageBinary;
  drop?: t.ImageDropSettings;
  paste?: t.ImagePasteSettings;
  tabIndex?: number;
  style?: t.CssValue;
  onDropOrPaste?: t.ImageDropOrPasteHandler;
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
  primary?: boolean;
};

/**
 * Events
 */
export type ImageDropOrPasteHandler = (e: ImageDropOrPasteHandlerArgs) => void;
export type ImageDropOrPasteHandlerArgs = {
  file?: t.ImageBinary;
  supportedMimetypes: string[];
  isSupported: boolean | null;
};
