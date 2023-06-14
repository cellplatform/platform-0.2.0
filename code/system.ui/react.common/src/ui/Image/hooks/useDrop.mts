import { useState } from 'react';
import { DEFAULTS, useDragTarget, type t } from '../common';

const supportedMimeTypes = DEFAULTS.supportedMimeTypes;

/**
 * Hook to manage drag/drop operations.
 */
export function useDrop(props: t.ImageProps) {
  const enabled = props.drop?.enabled ?? DEFAULTS.drop.enabled;

  const [file, setFile] = useState<t.DroppedFile>();
  const [supported, setSupported] = useState<boolean>();

  const drag = useDragTarget({
    enabled,
    onDrop(e) {
      const { file, isSupported } = Wrangle.file(e.files);
      setFile(file);
      setSupported(isSupported);
      if (file) props.onDrop?.({ file, supportedMimeTypes, isSupported });
    },
  });

  return {
    ref: drag.ref,
    is: { ...drag.is, supported },
    file,
  };
}

/**
 * Helpers
 */
const Wrangle = {
  file(files: t.DroppedFile[]) {
    const file = files.find((item) => supportedMimeTypes.includes(item.mimetype));
    const isSupported = files.length > 1 ? Boolean(file) : true;
    return { file, isSupported };
  },
};
