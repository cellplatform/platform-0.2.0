import { useRef, useState } from 'react';
import { format } from '../u.format';
import { DEFAULTS, Time, type t } from './common';

export function useHandler(
  input: t.PropListItem,
  defaults: t.PropListDefaults,
  handler?: t.PropListItemHandler | undefined,
) {
  const item = format(input);
  const isCopyable = item.isCopyable(defaults);
  const cursor = handler ? 'pointer' : undefined;

  const [message, setMessage] = useState<JSX.Element | string>();
  const timer = useRef<t.TimeDelayPromise>();

  /**
   * Handlers
   */
  const showMessage = (message: JSX.Element | string, hideAfter?: t.Msecs) => {
    timer.current?.cancel();
    setMessage(message);
    const msecs = hideAfter ?? DEFAULTS.messageDelay;
    timer.current = Time.delay(msecs, () => setMessage(undefined));
  };

  const onClick = async () => {
    if (!handler) return;

    const { clipboard, value } = item;
    let _message: JSX.Element | string | undefined;
    let _delay: number | undefined;

    handler({
      item: input,
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
  return {
    message,
    cursor,
    onClick: handler ? onClick : undefined,
  } as const;
}
