import type { t } from '../common.ts';

type Event = { type: string; payload: unknown };

export const Is: t.RxIs = {
  event(input, type) {
    if (
      !(
        input !== null &&
        typeof input === 'object' &&
        typeof input.type === 'string' &&
        typeof input.payload === 'object'
      )
    ) {
      return false;
    }

    if (type === null) return false;

    if (type !== undefined) {
      const event = input as Event;

      if (typeof type === 'object') {
        if (typeof type.startsWith !== 'string') return false;
        return event.type.startsWith(type.startsWith);
      } else {
        if (typeof type !== 'string') return false;
        if (event.type !== type) return false;
      }
    }

    return true;
  },
};
