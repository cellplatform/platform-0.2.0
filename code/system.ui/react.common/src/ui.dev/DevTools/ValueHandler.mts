import { debounceTime } from 'rxjs/operators';
import { R, t } from '../common';

type O = Record<string, unknown>;
type Milliseconds = number;

/**
 * Dynamic value that updates when state/props changes.
 */
export function ValueHandler<V, S extends O = O>(
  events: t.DevEvents,
  options: { debounce?: Milliseconds } = {},
) {
  type Handler = t.DevValueHandler<V, S>;
  type Subscriber = () => void;

  const { debounce = 10 } = options;
  events.dispose$.subscribe(() => api.dispose());

  let _latest: V | undefined;
  let _handler: t.DevValueHandler<V, S> | undefined;
  const subscribers = new Set<Subscriber>();

  const getState = async () => ((await events.info.get()).render.state ?? {}) as S;
  const handleChanged = async (info?: t.DevInfo) => {
    const value = await api.current(info);
    if (!R.equals(value, _latest)) subscribers.forEach((fn) => fn());
    _latest = value;
  };

  events.state.changed$.pipe(debounceTime(debounce)).subscribe((e) => handleChanged(e.info));
  events.props.changed$.pipe(debounceTime(debounce)).subscribe((e) => handleChanged(e.info));

  const api = {
    async current(info?: t.DevInfo) {
      const state = (info?.render.state ?? (await getState())) as S;
      const res = _handler?.({ state });
      return res;
    },
    handler(input: V | Handler) {
      _handler = (typeof input === 'function' ? input : () => input as V) as Handler;
      handleChanged();
    },
    subscribe(fn: Subscriber) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    dispose() {
      subscribers.clear();
    },
  };
  return api;
}
