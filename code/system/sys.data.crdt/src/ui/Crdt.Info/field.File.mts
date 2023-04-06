import { t, Value, Wrangle, Filesize } from './common';
import { DEFAULTS } from '../common';

export function File(
  data: t.CrdtInfoData,
  info?: { exists: boolean; manifest: t.DirManifest },
): t.PropListItem[] {
  const file = data.file;
  const docFile = file?.data;
  const res: t.PropListItem[] = [];

  if (!docFile) {
    res.push({
      label: file?.title ?? 'Persistence',
      value: `(not saved)`,
    });
  }

  if (docFile) {
    const indent = 15;
    const manifest = info?.manifest;
    const files = manifest?.files ?? [];

    res.push({
      label: file?.title ?? 'Persistence',
      value: files.length === 0 ? `(not saved)` : undefined,
    });

    if (manifest) {
      const getTotals = (files: t.ManifestFile[]) => {
        const count = files.length;
        const bytes = files.reduce((acc, next) => acc + next.bytes, 0);
        return {
          count,
          bytes,
          toString: () => Wrangle.filesTotal(count, bytes),
        };
      };

      const filesTotal = getTotals(files);
      const logFiles = files.filter((f) => f.path.startsWith(DEFAULTS.doc.logdir));
      const stdFiles = files.filter((f) => !f.path.startsWith(DEFAULTS.doc.logdir));

      if (filesTotal.count > 0) {
        res.push({
          label: 'Size',
          value: filesTotal.toString(),
          indent,
        });

        let strategy = '';
        if (docFile.autosaving || stdFiles.length > 0) {
          strategy += `compressed file`;
        }
        if (docFile.logging || logFiles.length > 0) {
          strategy += `${strategy ? ', ' : ''}change logging`;
        }
        if (strategy.trim()) {
          res.push({ label: 'Strategy', value: strategy, indent });
        }

        res.push({
          label: 'Hash',
          value: Wrangle.displayHash(manifest.hash.files, [12, 5]),
          tooltip: `files hash:\n${manifest.hash.files}`,
          indent,
        });
      }
    }
  }

  return res;
}
