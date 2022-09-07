import { t } from './common.mjs';

/**
 * A single file within a manifest.
 */
export type ManifestFile = {
  path: string;
  bytes: number;
  filehash: string;
  image?: t.ManifestFileImage;
};

/**
 * Meta information about [image] file types.
 */
export type ManifestFileImage = {
  kind: 'png' | 'jpg' | 'svg';
  width: number;
  height: number;
};
