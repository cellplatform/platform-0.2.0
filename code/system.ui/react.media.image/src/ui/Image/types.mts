import type { t } from './common';

type Pixels = number;
type Milliseconds = number;

export type ImageBinary = {
  data: Uint8Array;
  mimetype: string;
};

export type ImageSupportedMimetypes = 'image/png' | 'image/jpeg' | 'image/webp';
export type ImageSizeStrategy = 'cover' | 'contain';

/**
 * Component Properties
 */
export type ImageProps = {
  src?: string | t.ImageBinary | null;
  drop?: t.ImageDropSettings;
  paste?: t.ImagePasteSettings;
  warning?: t.ImageWarningSettings;
  sizing?: t.ImageSizeStrategy;
  debug?: boolean;
  style?: t.CssValue;
  onDropOrPaste?: t.ImageDropOrPasteHandler;
};

export type ImageDropSettings = {
  enabled?: boolean;
  blur?: Pixels;
  content?: string | JSX.Element;
};

export type ImagePasteSettings = {
  enabled?: boolean;
  primary?: boolean;
  tabIndex?: number;
};

export type ImageWarningSettings = {
  blur?: Pixels;
  delay?: Milliseconds;
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
