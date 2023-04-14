import { COLORS, DEFAULTS, Icons, Path, t, Value, Wrangle } from './common';
import { Hash } from './ui.Hash';

export function FieldFile(
  data: t.CrdtInfoData,
  info?: { exists: boolean; manifest: t.DirManifest },
): t.PropListItem[] {
  const file = data.file;
  const docFile = file?.doc;
  const res: t.PropListItem[] = [];

  const MSG = {
    NOT_SAVED: `in-memory (not saved)`,
  };

  if (!docFile) {
    res.push({
      label: file?.title ?? 'Persistence',
      value: MSG.NOT_SAVED,
    });
  }

  if (docFile) {
    const indent = DEFAULTS.indent;

    const manifest = info?.manifest;
    const files = manifest?.files ?? [];
    const hasFiles = files.length > 0;

    res.push({
      label: file?.title ?? 'Local Persistence',
      value: hasFiles ? <Icons.Repo size={15} color={COLORS.DARK} /> : MSG.NOT_SAVED,
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
          value: <Hash text={manifest.hash.files} />,
          tooltip: `files hash:\n${manifest.hash.files}`,
          indent,
        });

        if (file.path && filesTotal.count > 0) {
          res.push({
            label: 'Filesystem',
            value: Path.ensureSlashes(file.path),
            tooltip: `file path: ${file.path}`,
            indent,
          });
        }

        let strategy = '';
        let strategyCount = 0;
        if (docFile.autosaving || stdFiles.length > 0) {
          strategy += `compressed file`;
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
    }
  }

  return res;
}
