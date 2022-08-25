import { t, Mime } from '../../common/index.mjs';
import { Image as ImgageJs } from 'image-js';

export const Image = {
  isImagePath(path: string) {
    const mime = Mime.toType(path);
    return ['image/jpeg', 'image/png'].includes(mime);
  },

  async toInfo(path: string, data: Uint8Array) {
    if (!Image.isImagePath(path)) return;
    try {
      const img = await ImgageJs.load(data);
      const { width, height } = img;
      const kind = Mime.toType(path) === 'image/png' ? 'png' : 'jpg';
      const info: t.ManifestFileImage = { kind, width, height };
      return info;
    } catch (error) {
      return undefined; // NB: Failure to load image indicates not a readable image binary.
    }
  },
};
