import { type t, Time } from './common';

export function timer(delay: t.Milliseconds, action: () => void) {
  let _timer: t.TimeDelayPromise | undefined;
  const api = {
    clear: () => _timer?.cancel(),
    start() {
      api.clear();
      _timer = Time.delay(delay, action);
    },
  } as const;
  return api;
}
