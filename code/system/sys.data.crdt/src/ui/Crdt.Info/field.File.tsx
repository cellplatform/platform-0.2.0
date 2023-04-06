import { t, Value, Wrangle, COLORS, Icons, Path } from './common';
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
      value: files.length === 0 ? `(not saved)` : <Icons.Repo size={15} color={COLORS.DARK} />,
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

        res.push({
          label: 'Hash',
          value: Wrangle.displayHash(manifest.hash.files, [12, 5]),
          tooltip: `files hash:\n${manifest.hash.files}`,
          indent,
        });

        let strategy = '';
        let strategyCount = 0;
        if (docFile.autosaving || stdFiles.length > 0) {
          strategy += `(compressed) file`;
          strategyCount++;
        }
        if (docFile.logging || logFiles.length > 0) {
          strategy += `${strategy ? ', ' : ''}running log`;
          strategyCount++;
        }
        if (strategy.trim()) {
          res.push({
            label: Value.plural(strategyCount, 'Strategy', 'Strategies'),
            value: strategy,
            indent,
          });
        }
      }

      if (file.path && filesTotal.count > 0) {
        res.push({
          label: 'Filesystem',
          value: Path.ensureSlashes(file.path),
          tooltip: `file: ${file.path}`,
          indent,
        });
      }
    }
  }

  return res;
}
