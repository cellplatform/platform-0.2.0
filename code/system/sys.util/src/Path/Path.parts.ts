import { trimFilePrefix } from './Path.trim';

/**
 * Break a path into it's constituent parts.
 */
export function parts(input: string) {
  const path = trimFilePrefix(input);

  let filename = '';
  let dir = '';
  let name = '';
  let ext = '';

  if (path) {
    const index = path.lastIndexOf('/');
    if (index > -1) {
      dir = path.substring(0, index);
      filename = path.substring(index + 1);
    } else {
      filename = path;
    }
  }

  if (filename) {
    const index = filename.lastIndexOf('.');
    if (index > -1) {
      name = filename.substring(0, index);
      ext = filename.substring(index + 1);
    } else {
      name = filename;
    }
  }

  return {
    dir, //       Directory (without trailing "/").
    filename, //  Full filename (with extension).
    name, //      Name without extension.
    ext, //       File extension.
    path, //      Complete path.
  };
}
