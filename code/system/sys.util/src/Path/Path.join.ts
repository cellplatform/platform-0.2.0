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
