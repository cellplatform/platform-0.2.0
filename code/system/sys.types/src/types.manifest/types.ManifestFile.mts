/**
 * A single file within a manifest.
 */
export type ManifestFile = {
  path: string;
  bytes: number;
  filehash: string;
};

/**
 * Meta information about [image] file types.
 */
export type ManifestFileImage = {
  kind: 'png' | 'jpg' | 'svg';
  width: number;
  height: number;
};
