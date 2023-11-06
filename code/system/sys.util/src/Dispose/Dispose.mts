import { create } from './Dispose.create.mjs';
import { done } from './Dispose.done.mjs';
import { until } from './Dispose.until.mjs';

export const Dispose = {
  create,
  until,
  done,
} as const;
