import { useState } from 'react';
import { Util } from '../Util.mjs';
import { DEFAULTS, useDragTarget, type t } from '../common';

const supportedMimetypes = DEFAULTS.supportedMimetypes;

/**
 * Hook to manage drag/drop operations.
 */
export function useDrop(
  ref: React.RefObject<HTMLDivElement>,
  props: t.ImageProps,
  options: { warn?: (message: string) => void } = {},
) {
  const blur = () => ref.current?.blur();
  const enabled = props.drop?.enabled ?? DEFAULTS.drop.enabled;

  const [file, setFile] = useState<t.ImageBinary>();
  const [supported, setSupported] = useState<boolean | null>(null);

  const drag = useDragTarget({
    ref,
    enabled,
    onDrop(e) {
      blur();

      const { file, isSupported } = Wrangle.file(e.files);
      setFile(file);
      setSupported(isSupported);
      props.onDropOrPaste?.({ file, supportedMimetypes, isSupported });
      if (!isSupported) options.warn?.(Util.notSupportedMessage(file?.mimetype));
    },
  });

  /**
   * API
   */
  return {
    ref: drag.ref,
    is: { ...drag.is, supported },
    file,
    supportedMimetypes,
    blur,
  } as const;
}

/**
 * Helpers
 */
const Wrangle = {
  file(files: t.DroppedFile[]) {
    const file = Wrangle.toImageBinary(files[0]);
    const isSupported = file ? Util.isSupportedMimetype(file?.mimetype) : null;
    return {
      file,
      isSupported,
    };
  },

  toImageBinary(file?: t.DroppedFile): t.ImageBinary | undefined {
    if (!file) return;
    const { data, mimetype } = file;
    return { data, mimetype };
  },
};
