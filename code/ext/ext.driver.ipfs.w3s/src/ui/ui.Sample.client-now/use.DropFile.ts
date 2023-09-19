import { useState } from 'react';
import { Storage } from './Wrangle';
import { Time, useDragTarget, type t } from './common';

/**
 * Upload a file when dropped.
 */
export function useDropFile(args: { apiKey?: string }) {
  const [spinning, setSpinning] = useState(false);

  const drag = useDragTarget({
    async onDrop(e) {
      setSpinning(true);

      console.log('args.apiKey', args.apiKey);

      const store = await Storage.import(args.apiKey);

      console.log('e', e);
      console.log('store', store);

      /**
       * TODO 🐷
       * put on t.DroppedFile as method(??)
       */
      const toFile = (dropped: t.DroppedFile) => {
        const { data, path, mimetype: type } = dropped;
        return new File([data], path, { type });
      };

      // const file = e.files[0];
      // console.log('file', file);

      const dir = 'my-dropped';
      const file = toFile(e.files[0]);
      const res = await store.put([file], { name: dir });

      console.log('res', res);

      // store.put()

      await Time.delay(1000, () => {
        setSpinning(false);
      });
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
