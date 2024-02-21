import { useRef, useState } from 'react';
import { format } from '../u.format';
import { DEFAULTS, Time, type t } from './common';

export function useHandler(
  props: { item: t.PropListItem; defaults: t.PropListDefaults },
  handler?: t.PropListItemHandler | undefined,
) {
  const item = format(props.item);
  const isCopyable = item.isCopyable(props.defaults);

  const [message, setMessage] = useState<JSX.Element | string>();
  const messageDelay = useRef<t.TimeDelayPromise>();

  /**
   * Handlers
   */
  const showMessage = (message: JSX.Element | string, hideAfter?: t.Msecs) => {
    messageDelay.current?.cancel();
    setMessage(message);
    const delay = hideAfter ?? DEFAULTS.messageDelay;
    messageDelay.current = Time.delay(delay, () => setMessage(undefined));
  };

  const onClick = async () => {
    const { clipboard, value } = item;
    let _message: JSX.Element | string | undefined;
    let _delay: number | undefined;

    handler?.({
      item,
      value,
      message(text, msecs) {
        _message = text;
        _delay = msecs;
      },
    });

    if (clipboard && isCopyable) {
      const value = typeof clipboard === 'function' ? clipboard() : clipboard;
      await navigator.clipboard.writeText(value ?? '');
      if (!_message) {
        const text = String(value || '').trim();
        const isHttp = text.startsWith('http://') || text.startsWith('https://');
        _message = isHttp ? 'copied url' : 'copied';
      }
    }

    if (_message) showMessage(_message, _delay);
  };

  /**
   * API
   */
  return { message, onClick } as const;
}
