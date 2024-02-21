import { useRef, useState } from 'react';
import { format } from '../u.format';
import { DEFAULTS, Time, type t } from './common';

export function useClickHandler(props: { item: t.PropListItem; defaults: t.PropListDefaults }) {
  const item = format(props.item);
  const isCopyable = item.isCopyable(props.defaults);

  const [message, setMessage] = useState<JSX.Element | string>();
  const messageDelay = useRef<t.TimeDelayPromise>();

  /**
   * Handlers
   */
  const showMessage = (message: JSX.Element | string, delay?: number) => {
    messageDelay.current?.cancel();
    setMessage(message);
    const msecs = delay ?? DEFAULTS.messageDelay;
    messageDelay.current = Time.delay(msecs, () => setMessage(undefined));
  };

  const onClick = async () => {
    const { clipboard, value } = item;
    let message: JSX.Element | string | undefined;
    let delay: number | undefined;

    value.onClick?.({
      item,
      value,
      message(text, msecs) {
        message = text;
        delay = msecs;
      },
    });

    if (clipboard && isCopyable) {
      const value = typeof clipboard === 'function' ? clipboard() : clipboard;
      await navigator.clipboard.writeText(value ?? '');
      if (!message) {
        const text = (value || '').toString().trim();
        const isHttp = text.startsWith('http://') || text.startsWith('https://');
        message = isHttp ? 'copied url' : 'copied';
      }
    }

    if (message) showMessage(message, delay);
  };

  /**
   * API
   */
  return { message, onClick } as const;
}
