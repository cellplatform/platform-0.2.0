import { useState } from 'react';
import { Storage } from './Wrangle';
import { Path, useDragTarget, type t } from './common';

type Args = {
  apiKey?: string;
  onDropPut?: t.SampleDropPutHandler;
};

/**
 * Upload a file when dropped.
 */
export function useDropFile(args: Args) {
  const [spinning, setSpinning] = useState(false);

  const drag = useDragTarget({
    suppressGlobal: true,
    async onDrop(e) {
      setSpinning(true);
      const store = await Storage.import(args.apiKey);
      const rootDir = 'my-dropped';

      if (e.files.length === 1) {
        const file = e.files[0].toFile();
        const name = Path.join(rootDir, file.name);
        const cid = await store.put([file], { name });
        args.onDropPut?.({ cid });
      }

      if (e.files.length > 1) {
        const dir = Path.parts(e.files[0].path).dir;
        const name = Path.join(rootDir, dir);
        const files = e.toFiles();
        const cid = await store.put(files, { name });
        args.onDropPut?.({ cid });
      }

      setSpinning(false);
    },
  });

  const label = drag.is.over ? 'Drop file...' : 'Drop file here';
  const is = { ...drag.is, spinning };

  /**
   * API
   */
  return {
    ref: drag.ref,
    is,
    label,
  } as const;
}
