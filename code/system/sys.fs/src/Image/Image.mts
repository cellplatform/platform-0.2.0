import { Mime, t } from '../common/index.mjs';
import { Image as Img } from 'image-js';

/**
 * Helpers for operating on image files.
 */
export const Image = {
  /**
   * Determine if the given path represents an image file.
   */
  isImagePath(path: string) {
    const mime = Mime.toType(path);
    return ['image/jpeg', 'image/png'].includes(mime);
  },

  /**
   * Derive common image informatino from the given file.
   */
  async toInfo(path: string, data: Uint8Array) {
    if (!Image.isImagePath(path)) return;
    try {
      const img = await Img.load(data);
      const { width, height } = img;
      const kind = Mime.toType(path) === 'image/png' ? 'png' : 'jpg';
      const info: t.ManifestFileImage = { kind, width, height };
      return info;
    } catch (error) {
      return undefined; // NB: Failure to load image indicates not a readable image binary.
    }
  },
};
