import { create } from './Dispose.create';
import { done } from './Dispose.done';
import { until } from './Dispose.until';

export const Dispose = {
  create,
  until,
  done,
} as const;
