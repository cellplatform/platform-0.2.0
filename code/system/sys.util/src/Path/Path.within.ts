import { trimSlashes } from './Path.trim';
import { join } from './Path.join';

/**
 * Determine if the given path is within scope.
 */
export function isWithin(root: string, path: string) {
  root = trimSlashes(root);
  path = trimSlashes(path);

  if (root === '.') root = '';
  if (root === '..' || includesStepup(root)) return false;
  if (path === '.') return true;

  const filename = path.substring(path.lastIndexOf('/') + 1);
  return join(root, path).length > filename.length;
}

function includesStepup(path: string) {
  return path.includes('../') || path.includes('/..');
}
