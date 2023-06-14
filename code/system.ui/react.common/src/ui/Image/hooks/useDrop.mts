import { useState } from 'react';
import { DEFAULTS, useDragTarget, type t, Keyboard } from '../common';

const supportedMimeTypes = DEFAULTS.supportedMimeTypes;

/**
 * Hook to manage drag/drop operations.
 */
export function useDrop(ref: React.RefObject<HTMLDivElement>, props: t.ImageProps) {
  const enabled = props.drop?.enabled ?? DEFAULTS.drop.enabled;

  const [file, setFile] = useState<t.DroppedFile>();
  const [supported, setSupported] = useState<boolean | null>(null);

  const drag = useDragTarget({
    ref,
    enabled,
    onDrop(e) {
      const { file, isSupported } = Wrangle.file(e.files);
      setFile(file);
      setSupported(isSupported);
      props.onAdd?.({ file, supportedMimeTypes, isSupported });
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
    const file = files[0];
    const isSupported = file ? supportedMimeTypes.includes(file.mimetype) : null;
    return {
      file,
      isSupported,
    };
  },

  isSupported(files: t.DroppedFile[]) {},
};
