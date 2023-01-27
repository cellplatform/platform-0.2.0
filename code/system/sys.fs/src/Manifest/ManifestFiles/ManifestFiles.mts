import { t, Sort } from '../common.mjs';
import { ManifestHash } from '../ManifestHash';

/**
 * Standard operations on a set of files represented by a manifest.
 */
export const ManifestFiles = {
  hash: ManifestHash.files,
  compare: Sort.String.naturalCompare,
  sort<T extends t.ManifestFile | string>(items: T[]) {
    if (items.length === 0) return [];
    return [...items].sort((a, b) => {
      return ManifestFiles.compare(
        typeof a === 'string' ? a : a.path,
        typeof b === 'string' ? b : b.path,
      );
    });
  },
};
