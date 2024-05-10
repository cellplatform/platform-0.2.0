import { useEffect, useState } from 'react';
import { DEFAULTS, Keyboard, useFocus, type t } from './common';
import { Util } from './u';

const supportedMimetypes = DEFAULTS.supportedMimetypes;

/**
 * Hook to manage paste operations.
 */
export function usePaste(
  ref: React.RefObject<HTMLDivElement>,
  props: t.ImageProps,
  options: { warn?: (message: string) => void } = {},
) {
  const blur = () => ref.current?.blur();

  const enabled = props.paste?.enabled ?? DEFAULTS.paste.enabled;
  const primary = props.paste?.primary ?? DEFAULTS.paste.primary;
  const tabIndex = !enabled || primary ? -1 : props.paste?.tabIndex ?? DEFAULTS.paste.tabIndex;

  const focus = useFocus(ref);
  const focused = enabled && !primary ? focus.containsFocus : false;

  const [supported, setSupported] = useState<boolean | null>(null);
  const [image, setImage] = useState<t.ImageBinary>();
  const mimetype = image?.mimetype;

  /**
   * Handlers
   */
  const onPaste = async (event: ClipboardEvent) => {
    if (!enabled) return;
    if (!focused && !primary) return;

    setSupported(null);

    for (const item of Wrangle.clipboardItems(event)) {
      const mimetype = item.type;
      const isSupported = Util.isSupportedMimetype(mimetype);
      setSupported(isSupported);

      if (isSupported) {
        const buffer = await Wrangle.buffer(item);
        const file = buffer ? Wrangle.file(buffer, mimetype) : undefined;
        if (file) {
          blur();
          setImage(file);
          props.onDropOrPaste?.({ file, supportedMimetypes, isSupported: true });
        } else {
          setImage(undefined);
        }

        break;
      } else {
        options.warn?.(Util.notSupportedMessage(mimetype));
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
    mimetype,
    tabIndex,
    is: { enabled, focused, supported },
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

  clipboardItems(event: ClipboardEvent): DataTransferItem[] {
    return Array.from(event.clipboardData?.items || []);
  },
};
