import { trimSlashes } from './Path.trim.mjs';

/**
 * Join multiple parts into a single "/" delimited path.
 * NB:
 *    This is a re-implementation of the native `join` method
 *    to allow this module to have no dependencies on platform node 'fs'.
 */

export function join(...segments: string[]) {
  const parts = segments.map((part, i) => {
    const isFirst = i === 0;
    const isLast = i === segments.length - 1;
    part = isLast ? part : part.replace(/\/*$/, '');
    part = isFirst ? part : part.replace(/^\/*/, '');
    return part;
  });

  const res: string[] = [];

  // Rebuild path observing ".." level-navigation-dots.
  for (const part of parts.join('/').split('/')) {
    const trimmed = part.trim();
    if (trimmed === '.') continue;
    if (trimmed === '..') {
      if (res.length === 0) {
        break; // NB: Exit, we have "stepped up" above the root level.
      } else {
        res.pop(); // Step up a level.
        continue;
      }
    }
    res.push(part);
  }

  return res.join('/');
}

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
