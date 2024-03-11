import { toMimetype } from './toMimetype';

/**
 * Helpers for working with MIME types.
 */
export class Mime {
  public static toType = toMimetype;

  /**
   * Determine if the given MIME type represents a binary file.
   */
  public static isBinary(mimetype: string) {
    return !Mime.isText(mimetype) && !Mime.isJson(mimetype);
  }

  /**
   * Determine if the given MIME type represents a text file.
   */
  public static isText(mimetype: string) {
    return isIncluded(mimetype, ['text/']);
  }

  /**
   * Determine if the given MIME type represents json.
   */
  public static isJson(mimetype: string) {
    const parts = (mimetype || '')
      .trim()
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean);
    return parts.some((part) => {
      if (!part.startsWith('application/')) return false;
      return part.endsWith('/json') || part.endsWith('+json');
    });
  }
}

/**
 * [Helpers]
 */

function isIncluded(mimetype: string, match: string[]) {
  mimetype = (mimetype || '').trim();
  return match.some((item) => mimetype.includes(item));
}
