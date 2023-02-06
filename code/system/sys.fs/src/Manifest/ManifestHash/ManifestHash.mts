import { t, Hash } from '../common.mjs';

const sha256 = Hash.sha256;

/**
 * Standard generation of a SHA256 hashes.
 */
export const ManifestHash = {
  sha256,

  /**
   * SHA256 hash for a list of files.
   */
  files(input: t.ManifestFile[] | t.Manifest) {
    let files = Array.isArray(input) ? input : input.files;

    /**
     * TODO 🐷
     * ISSUE: https://github.com/cellplatform/platform-0.2.0/issues/28
     * - which sort code-path
     * - ensure this is a canonical, unambiguous, deterministic product
     *   that can be repeated and solidly verifiable.
     */

    // files =ManifestFiles.sort(files)
    // const f = ManifestFiles.sort(files);

    const hashes = files.filter(Boolean).map((file) => file.filehash);

    sort(hashes);

    return sha256(hashes);
  },

  /**
   * SHA256 hash for a [ModuleManifest].
   */
  module(info: t.ModuleManifestInfo, files: t.ManifestFile[]): t.ModuleManifestHash {
    const fileshash = ManifestHash.files(files);
    return {
      files: fileshash,
      module: sha256({ module: info, files: fileshash }),
    };
  },

  /**
   * SHA256 hash for a [DirManifest].
   */
  dir(info: t.DirManifestInfo, files: t.ManifestFile[]) {
    const fileshash = ManifestHash.files(files);
    return {
      files: fileshash,
      dir: sha256({ dir: info, files: fileshash }),
    };
  },
};

/**
 * Helpers
 */
function sort(hashes: string[]) {
  const collator = new Intl.Collator('en', { usage: 'sort' }); // NB: for performance increase.
  hashes.sort((a, b) => collator.compare(a, b));
}
