import { useEffect, useState } from 'react';
import { Util } from '../Util.mjs';
import { DEFAULTS, Keyboard, useFocus, type t } from '../common';

const supportedMimetypes = DEFAULTS.supportedMimetypes;

/**
 * Hook to manage paste operations.
 */
export function usePaste(ref: React.RefObject<HTMLDivElement>, props: t.ImageProps) {
  const blur = () => ref.current?.blur();

  const enabled = props.paste?.enabled ?? DEFAULTS.paste.enabled;
  const primary = props.paste?.primary ?? DEFAULTS.paste.primary;
  const tabIndex = !enabled || primary ? -1 : props.paste?.tabIndex ?? DEFAULTS.paste.tabIndex;

  const focus = useFocus(ref);
  const focused = enabled && !primary ? focus.containsFocus : false;

  const [image, setImage] = useState<t.ImageBinary>();
  const [supported, setSupported] = useState<boolean | null>(null);

  /**
   * Handlers
   */
  const onPaste = async (event: ClipboardEvent) => {
    if (!enabled) return;
    if (!focused && !primary) return;

    const items: DataTransferItem[] = Array.from(event.clipboardData?.items || []);

    setSupported(null);

    for (const item of items) {
      const mime = item.type;


      const isSupported = Util.isSupportedMimetype(mime);
      setSupported(isSupported);

      if (isSupported) {
        const buffer = await Wrangle.buffer(item);
        const file = buffer ? Wrangle.file(buffer, mime) : undefined;
        if (file) {
          blur();
          setImage(file);
          props.onDropOrPaste?.({ file, supportedMimetypes, isSupported: true });
        } else {
          setImage(undefined);
        }

        break;
      }
    }
  };

  /**
   * Clear focus on Escape key.
   */
  useEffect(() => {
    const keyboard = Keyboard.on('Escape', (e) => {
      if (focused && enabled && ref.current) blur();
    });

    return () => keyboard.dispose();
  }, [ref.current, focused, enabled, primary]);

  /**
   * Clipboard listener
   */
  useEffect(() => {
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [focused, enabled, primary]);

  /**
   * API
   */
  return {
    image,
    mimetype: image?.mimetype,
    is: { enabled, focused, supported },
    tabIndex,
    blur,
  } as const;
}

/**
 * Helpers
 */
const Wrangle = {
  buffer(item: DataTransferItem) {
    return item.getAsFile()?.arrayBuffer();
  },

  file(buffer: ArrayBuffer, mimetype: string) {
    const data = new Uint8Array(buffer);
    const file: t.ImageBinary = { data, mimetype };
    return file;
  },
};
