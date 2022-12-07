import { R, t } from '../common';
import { Wrangle } from './Wrangle.mjs';

type SecondsInput = number | null | undefined;

/**
 * Helpers for interpreting the play sequence of a time-map expressed
 * on a diagram.
 */
export const TimeMap = {
  /**
   * Time events sorted by `start` second (ascending).
   */
  sortedMedia(input?: t.DocDiagramMedia[]): t.DocDiagramMediaTimeRef[] {
    const res = (input || [])
      .map((media, indexRef) => {
        const { start, end } = media;
        const kind = Wrangle.toKind(media);
        const res = kind ? { kind, start, end, indexRef } : undefined;
        return res;
      })
      .filter(Boolean)
      .map((e) => e as t.DocDiagramMediaTimeRef);

    return TimeMap.sortedTimeMap(res);
  },

  sortedTimeMap<T extends t.DocTimeWindow>(input?: T[]): T[] {
    const prop = R.prop('start');
    return R.sortBy(prop as any, input ?? []); // HACK 🐷: type issue (any).
  },

  /**
   * Look at the list of items, and determine if the current item to display.
   */
  current(input: t.DocDiagramMedia[] | undefined, seconds: number) {
    const isBefore = (start?: SecondsInput) => typeof start === 'number' && start <= seconds;
    const isEnded = (end?: SecondsInput) => typeof end === 'number' && end <= seconds;

    const sorted = TimeMap.sortedMedia(input).filter((item) => typeof item.start === 'number');
    const before = sorted.filter(({ start }) => isBefore(start));
    const last = before[before.length - 1];

    return isEnded(last?.end) ? undefined : last;
  },
};
