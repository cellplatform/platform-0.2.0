import { Time, type t } from './common';

export function ResetTimer(delay: t.Milliseconds, action: () => void) {
  let _timer: t.TimeDelayPromise | undefined;
  const clear = () => _timer?.cancel();
  const start = () => {
    clear();
    _timer = Time.delay(delay, action);
  };
  const api = { start, clear } as const;
  return api;
}
