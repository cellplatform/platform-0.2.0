import { Mime } from '../common';

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
};
