import { useEffect, useState } from 'react';
import { rx, type t } from '../common';

type T = { exists: boolean; manifest: t.DirManifest };

export function useFile(data: t.CrdtInfoData = {}) {
  const [file, setFile] = useState<T | undefined>();

  useEffect(() => {
    const lifecycle = rx.lifecycle();

    const docFile = data.file?.doc;
    if (docFile) {
      const updateState = async () => {
        const info = await docFile.info();
        if (!lifecycle.disposed) {
          const { exists, manifest } = info;
          setFile({ exists, manifest });
        }
      };

      updateState();
      docFile?.$.pipe(rx.takeUntil(lifecycle.dispose$)).subscribe(updateState);
    }

    return lifecycle.dispose;
  }, [Boolean(data.file?.doc)]);

  return file;
}
